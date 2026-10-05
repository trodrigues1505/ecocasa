/* =====================================================================
   ECOCASA — LÓGICA DO JOGO
   Fonte única de verdade: o objeto G (gameState).
   ===================================================================== */
'use strict';

/* ---------- Utilidades ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = n => Math.round(n).toLocaleString('pt-BR');
const rnd = n => Math.floor(Math.random() * n);
function shuffle(a) { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = rnd(i + 1);[r[i], r[j]] = [r[j], r[i]]; } return r; }
/* Remove caracteres de controle e símbolos perigosos; limita a 16 caracteres */
function sanitizarNick(v) { return String(v).replace(/[\u0000-\u001F\u007F<>"'`&\\]/g, '').replace(/\s+/g, ' ').trim().slice(0, 16); }
const MELH = id => MELHORIAS.find(m => m.id === id);

/* ---------- Armazenamento local (com fallback em memória) ---------- */
const LS = { ranking: 'ecocasa_ranking_v1', cfg: 'ecocasa_cfg_v1' };
const memoria = {};
function lsGet(k, def) {
  if (k in memoria) return memoria[k];
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; }
}
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); delete memoria[k]; } catch (e) { memoria[k] = v; } }
const cfg = Object.assign({ som: true, anim: true, exposicao: true }, lsGet(LS.cfg, {}));
function salvarCfg() { lsSet(LS.cfg, cfg); document.body.classList.toggle('sem-anim', !cfg.anim); }

/* ---------- Som (WebAudio, só após interação) ---------- */
let audioCtx = null;
function audioInit() {
  try {
    if (!audioCtx) { const AC = window.AudioContext || window.webkitAudioContext; if (AC) audioCtx = new AC(); }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  } catch (e) { audioCtx = null; }
}
function tom(f, d = .12, tipo = 'sine', v = .07, t0 = 0) {
  if (!cfg.som || !audioCtx) return;
  try {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain(), t = audioCtx.currentTime + t0;
    o.type = tipo; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g); g.connect(audioCtx.destination); o.start(t); o.stop(t + d + .03);
  } catch (e) { /* som é opcional */ }
}
const SOM = {
  clique: () => tom(520, .06, 'triangle', .05),
  acerto: () => { tom(660, .12); tom(880, .2, 'sine', .07, .1); },
  erro: () => tom(200, .25, 'sawtooth', .04),
  moeda: () => { tom(988, .07, 'square', .03); tom(1319, .12, 'square', .03, .07); },
  evento: () => { tom(440, .1); tom(554, .1, 'sine', .07, .1); tom(659, .22, 'sine', .07, .2); },
  conquista: () => [523, 659, 784, 1047].forEach((f, i) => tom(f, .18, 'triangle', .07, i * .1)),
  fim: () => [392, 523, 659, 784].forEach((f, i) => tom(f, .3, 'sine', .07, i * .15))
};

/* ---------- Estado ---------- */
let G = null;
const tem = id => G.melhorias.includes(id);
function snap() { const s = { ecoCoins: G.ecoCoins }; INDS.forEach(k => s[k] = G[k]); return s; }

function novoEstado(nick) {
  return {
    nickname: nick, rodadaAtual: 1, totalRodadas: 10,
    ecoCoins: 10000, energia: 40, agua: 40, residuos: 30, natureza: 20, conforto: 60, pontuacao: 0,
    melhorias: [], conquistas: [], eventosAtivos: [], desafiosRespondidos: [],
    areasDesbloqueadas: ['sala', 'cozinha'], historicoDecisoes: [], modoExposicao: cfg.exposicao,
    // controle interno
    sinergias: [], gastoTotal: 0, acertos: 0, tentativas: 0, pontosDecisao: 0, pontosEvento: 0, pontosFinal: 0,
    ignorados: {}, desconto: 0, obras: 0, crises: {}, crisesHist: {}, crisisOferta: {},
    usados: { p: [], d: [], e: [] }, inicial: { energia: 40, agua: 40, residuos: 30, natureza: 20, conforto: 60 },
    fila: [], passo: null, avisos: [], flags: {}, eventosRodadas: [], finalizado: false,
    rankingId: null, resultado: null, sim: null, filtroArea: 'todas', msgObras: '', ultimoInd: null, ultimoIc: null
  };
}

/* Limites: indicadores 0-100, EcoCoins >= 0 */
function clampValor(k, v) { return k === 'ecoCoins' ? Math.max(0, Math.round(v)) : clamp(Math.round(v), 0, 100); }

/* Aplica efeitos e devolve [{k, antes, depois, d}] */
function aplicarEfeitos(ef) {
  const out = [];
  Object.keys(ef).forEach(k => {
    const antes = G[k], depois = clampValor(k, antes + ef[k]);
    G[k] = depois; out.push({ k, antes, depois, d: depois - antes });
  });
  atualizarHUD(out);
  return out;
}

/* ---------- Índices derivados (nunca armazenados) ---------- */
function calcSust(s) { return Math.round(s.energia * .25 + s.agua * .25 + s.residuos * .2 + s.natureza * .2 + s.conforto * .1); }
function calcEquilibrio(s) {
  const v = INDS.map(k => s[k]); const spread = Math.max(...v) - Math.min(...v);
  return clamp(Math.round(100 - spread * 1.25), 0, 100);
}
function calcEficiencia(s) {
  const ganho = ['energia', 'agua', 'residuos', 'natureza'].reduce((a, k) => a + Math.max(0, s[k] - s.inicial[k]), 0);
  const gasto = s.gastoTotal, ppm = ganho / Math.max(1, gasto / 1000);
  const base = clamp(ppm * 6, 0, 100), uso = clamp(gasto / 9000, 0, 1);
  return Math.round(base * (0.4 + 0.6 * uso)); // quem não investe não rende; quem gasta mal também não
}
function classificar(i) { let c = CLASSES[0]; CLASSES.forEach(x => { if (i >= x.min) c = x; }); return c; }
function faixaIdx(v) { return Math.min(4, Math.floor(v / 20)); }
function calcRenda() { return Math.round((150 + 6 * Math.max(0, G.energia - 40) + 4 * Math.max(0, G.agua - 40) + 3 * Math.max(0, G.residuos - 30)) / 10) * 10; }

/* Pontuação 0-10000, baseada no estado real */
function calcPontos() {
  const sust = calcSust(G), eq = calcEquilibrio(G), ef = calcEficiencia(G);
  const eqEfetivo = eq * (0.4 + 0.6 * sust / 100);
  const conqPts = G.conquistas.filter(id => !CONQUISTAS.find(c => c.id === id).semPontos).length * 35;
  const partes = {
    'Sustentabilidade': sust * 40, 'Equilíbrio': eqEfetivo * 15, 'Eficiência dos investimentos': ef * 15,
    'Conforto': G.conforto * 5, 'Conhecimento e decisões': Math.min(1000, G.pontosDecisao),
    'Conquistas': Math.min(500, conqPts), 'Eventos': Math.min(300, G.pontosEvento), 'Decisão final': G.pontosFinal
  };
  Object.keys(partes).forEach(k => partes[k] = Math.round(partes[k]));
  const total = Object.values(partes).reduce((a, b) => a + b, 0);
  return { total, partes, sust, eq, ef };
}

/* ---------- Verificações após cada ação ---------- */
function verificarSinergias() {
  SINERGIAS.forEach(s => {
    if (!G.sinergias.includes(s.id) && s.req.every(tem)) {
      G.sinergias.push(s.id);
      aplicarEfeitos(s.ef);
      G.avisos.push(`${s.ic} COMBO: ${s.nome}! ${efTexto(s.ef)}`);
      toast(`${s.ic} Combo descoberto: ${s.nome}`, 'bom'); SOM.conquista();
    }
  });
}
function verificarCrises() {
  INDS.forEach(k => {
    const baixo = G[k] < 20;
    if (baixo && !G.crises[k]) {
      G.crises[k] = true; G.crisesHist[k] = true;
      G.avisos.push(`⚠️ ${CRISE_NOMES[k]}: as obras dessa área ficam mais caras até você se recuperar.`);
      toast(`⚠️ ${CRISE_NOMES[k]}`, 'ruim');
    } else if (!baixo && G.crises[k]) {
      G.crises[k] = false;
      G.avisos.push(`✅ Você saiu da ${CRISE_NOMES[k].toLowerCase()}.`);
    }
  });
}
function verificarConquistas(final) {
  CONQUISTAS.forEach(c => {
    if (G.conquistas.includes(c.id) || (c.final && !final)) return;
    let ok = false; try { ok = c.check(G); } catch (e) { ok = false; }
    if (ok) {
      G.conquistas.push(c.id);
      G.avisos.push(`🏅 Conquista: ${c.nome}`);
      toast(`🏅 Conquista: ${c.nome}`, 'conquista'); SOM.conquista();
    }
  });
}
function posAcao() {
  verificarSinergias(); verificarCrises(); verificarConquistas(false);
  G.pontuacao = calcPontos().total;
  atualizarCasa(); atualizarHUDExtra();
}
function efTexto(ef) {
  return Object.keys(ef).map(k => `${META[k].ic}${ef[k] > 0 ? '+' : ''}${ef[k]}`).join(' ');
}

/* ---------- Melhorias ---------- */
function precoBase(m) { return Math.round(m.custo * (G.crises[m.cat] ? 1.15 : 1) / 10) * 10; }
function precoDe(m) { return Math.round(precoBase(m) * (1 - G.desconto) / 10) * 10; }
function liberarArea(id) {
  if (G.areasDesbloqueadas.includes(id)) return;
  G.areasDesbloqueadas.push(id);
  const a = AREAS.find(x => x.id === id);
  toast(`🔓 Nova área liberada: ${a.nome}`, 'bom'); pulsarArea(id);
}
function registrarInstalacao(id) {
  if (tem(id)) return false;
  G.melhorias.push(id); liberarArea(MELH(id).area); return true;
}
function motivoBloqueio(m) {
  if (tem(m.id)) return 'instalada';
  if (!G.areasDesbloqueadas.includes(m.area)) return 'area';
  const falta = m.req.filter(r => !tem(r));
  if (falta.length) return 'req:' + falta.map(r => MELH(r).nome).join(', ');
  return '';
}
function comprarMelhoria(id) {
  const m = MELH(id); if (!m || G.obras <= 0 || motivoBloqueio(m)) return;
  const preco = precoDe(m); if (preco > G.ecoCoins) return;
  const antes = snap();
  G.desconto = 0; G.gastoTotal += preco; G.obras--; registrarInstalacao(id);
  const deltas = aplicarEfeitos(Object.assign({}, m.ef, { ecoCoins: -preco }));
  G.historicoDecisoes.push({ rodada: G.rodadaAtual, tipo: 'obra', ic: m.ic, titulo: `Instalou ${m.nome}`, custo: preco, antes, depois: snap() });
  SOM.moeda(); posAcao();
  G.msgObras = `<div class="feedback bom"><h3>${m.ic} ${esc(m.nome)} instalada!</h3><p>${esc(m.edu)}</p><div class="chips">${chipsDelta(deltas)}</div>${avisosHTML()}</div>`;
  renderObras();
}

/* ---------- Sorteios ---------- */
function sortearPergunta(nv) {
  const livre = PERGUNTAS.map((q, i) => ({ q, i })).filter(x => !G.usados.p.includes(x.i));
  let pool = livre.filter(x => x.q.nivel === nv);
  if (!pool.length) pool = livre.filter(x => x.q.nivel <= nv);
  if (!pool.length) pool = livre.length ? livre : PERGUNTAS.map((q, i) => ({ q, i }));
  const dif = pool.filter(x => x.q.ind !== G.ultimoInd); if (dif.length) pool = dif;
  const e = pool[rnd(pool.length)];
  G.usados.p.push(e.i); G.ultimoInd = e.q.ind; return e.q;
}
function sortearDecisao(nv) {
  const el = DECISOES.filter(d => !G.usados.d.includes(d.id) && (!d.cond || d.cond(G)));
  let pool = el.filter(d => d.nivel === nv);
  if (!pool.length) pool = el.filter(d => d.nivel <= nv);
  if (!pool.length) pool = el;
  if (!pool.length) pool = DECISOES.filter(d => !d.cond);
  const dif = pool.filter(d => d.ic !== G.ultimoIc); if (dif.length) pool = dif;
  const d = pool[rnd(pool.length)];
  G.usados.d.push(d.id); G.ultimoIc = d.ic; return d;
}
function sortearEvento() {
  let pool = EVENTOS.filter(e => !G.usados.e.includes(e.id));
  if (!pool.length) pool = EVENTOS;
  const e = pool[rnd(pool.length)]; G.usados.e.push(e.id); return e;
}

/* ---------- Eventos ---------- */
function efeitosEvento(ev) {
  const ef = Object.assign({}, ev.base), msgs = []; let acionou = false;
  ev.bonus.forEach(b => {
    const ok = (!b.se || b.se.every(tem)) && (!b.minUp || G.melhorias.length >= b.minUp);
    if (ok) { acionou = true; Object.keys(b.ef).forEach(k => ef[k] = (ef[k] || 0) + b.ef[k]); msgs.push('✅ ' + b.msg); }
  });
  return { ef, msgs, acionou };
}
function aplicarEvento(ev, primeira) {
  const r = efeitosEvento(ev), deltas = aplicarEfeitos(r.ef);
  if (primeira) {
    if (ev.extra && ev.extra.desconto) G.desconto = Math.max(G.desconto, ev.extra.desconto);
    if (r.acionou) G.pontosEvento += 25;
    if (ev.id === 'onda_calor' && r.acionou) G.flags.calorOk = true;
    if (!r.acionou && ev.dica) r.msgs.push('💡 ' + ev.dica);
    if (ev.dur > 1) G.eventosAtivos.push({ id: ev.id, restantes: ev.dur - 1 });
  }
  return { deltas, msgs: r.msgs };
}

/* ---------- Fluxo de rodadas ---------- */
function iniciarJogo(nick) {
  G = novoEstado(nick);
  G.eventosRodadas = shuffle([2, 3, 5, 6, 8, 9]).slice(0, 5);
  montarHUD(); atualizarHUD([]); atualizarCasa(); atualizarHUDExtra();
  ir('jogo');
  montarRodada(1); avancar();
}
function montarRodada(n) {
  G.rodadaAtual = n; G.obras = 0;
  const fila = [{ t: 'inicio' }];
  if (n === G.totalRodadas) {
    fila.push({ t: 'decisao', final: true });
  } else {
    if (G.eventosRodadas.includes(n)) fila.push({ t: 'evento' });
    fila.push({ t: 'crise-check' });
    const plano = PLANO[n], nq = plano.filter(x => x.startsWith('quiz')).length; let qi = 0;
    plano.forEach(item => {
      const [tipo, arg] = item.split(':');
      if (tipo === 'quiz') fila.push({ t: 'quiz', nivel: +arg, idx: ++qi, total: nq });
      else if (tipo === 'decisao') fila.push({ t: 'decisao', nivel: +arg });
      else if (tipo === 'invest') fila.push({ t: 'invest', n: +arg });
    });
    if (!plano.some(x => x.startsWith('invest'))) fila.push({ t: 'fim' });
  }
  G.fila = fila; atualizarHUDExtra();
}
function iniciarRodada() {
  const n = G.rodadaAtual, info = { n, renda: 0, andamento: [], novas: [] };
  AREAS.filter(a => a.libera === n && !G.areasDesbloqueadas.includes(a.id)).forEach(a => { liberarArea(a.id); info.novas.push(a); });
  if (n > 1) {
    info.renda = calcRenda(); aplicarEfeitos({ ecoCoins: info.renda });
    const resto = [];
    G.eventosAtivos.forEach(at => {
      const ev = EVENTOS.find(e => e.id === at.id), r = aplicarEvento(ev, false);
      info.andamento.push({ ev, deltas: r.deltas, msgs: r.msgs });
      at.restantes--; if (at.restantes > 0) resto.push(at);
    });
    G.eventosAtivos = resto;
  }
  posAcao(); return info;
}
function checarCriseOferta() {
  const ativos = INDS.filter(k => G.crises[k]).sort((a, b) => G[a] - G[b]);
  if (!ativos.length) return;
  const k = ativos[0]; if (G.crisisOferta[k] === G.rodadaAtual) return;
  G.crisisOferta[k] = G.rodadaAtual;
  const b = CRISES_DEC[k];
  G.fila.unshift({ t: 'decisao', crise: true, d: { id: 'crise_' + k, ic: b.ic, t: b.t, txt: b.txt, opcoes: b.opcoes, crise: true } });
}
function avancar() {
  if (!G || G.finalizado) return;
  const p = G.fila.shift();
  if (!p) { proximaRodada(); return; }
  G.passo = p; G.msgObras = '';
  switch (p.t) {
    case 'inicio': p.info = iniciarRodada(); renderInicio(); break;
    case 'evento': p.ev = sortearEvento(); mostrarEvento(p.ev); break;
    case 'crise-check': checarCriseOferta(); avancar(); break;
    case 'quiz':
      p.q = sortearPergunta(p.nivel);
      p.opcoes = shuffle([{ t: p.q.ok, ok: true }].concat(p.q.erradas.map(t => ({ t, ok: false }))));
      renderQuiz(); break;
    case 'decisao':
      if (p.final) { aplicarEfeitos({ ecoCoins: 5000 }); p.d = decisaoFinal(); }
      else if (!p.d) p.d = sortearDecisao(p.nivel);
      renderDecisao(); break;
    case 'invest': G.obras = p.n; G.filtroArea = 'todas'; renderObras(); break;
    case 'fim': G.obras = 1; renderFim(); break;
  }
}
function proximaRodada() {
  if (G.rodadaAtual >= G.totalRodadas) { finalizarJogo(); return; }
  montarRodada(G.rodadaAtual + 1); avancar();
}

/* ---------- Respostas ---------- */
function responderPergunta(i) {
  const p = G.passo; if (!p || p.t !== 'quiz' || p.resp !== undefined) return;
  p.resp = i; const o = p.opcoes[i], q = p.q;
  G.tentativas++; G.desafiosRespondidos.push(q.txt);
  let ef;
  if (o.ok) { G.acertos++; G.pontosDecisao += 60; ef = { [q.ind]: 6, ecoCoins: 250 }; SOM.acerto(); }
  else { ef = { [q.ind]: 1 }; SOM.erro(); }
  const antes = snap();
  p.deltas = aplicarEfeitos(ef);
  G.historicoDecisoes.push({ rodada: G.rodadaAtual, tipo: 'quiz', ic: '🧠', titulo: o.ok ? 'Acertou uma pergunta' : 'Errou uma pergunta', custo: 0, antes, depois: snap() });
  posAcao(); renderQuiz();
}

function decisaoFinal() {
  const ordem = INDS.slice().sort((a, b) => G[a] - G[b]);
  const spread = Math.max(...INDS.map(k => G[k])) - Math.min(...INDS.map(k => G[k]));
  const fracoNome = META[ordem[0]].nome;
  const opcoes = FINAL_OPCOES.map(f => {
    let fit;
    if (f.alvo === 'equilibrio') fit = spread >= 30 ? 1 : spread >= 20 ? .8 : .6;
    else fit = [1, .8, .6][ordem.indexOf(f.alvo)] || .45;
    const fb = fit >= 1
      ? `Excelente leitura da sua casa! ${f.txt}`
      : `${f.txt} Mas o ponto mais fraco da sua casa era ${fracoNome}: reforçá-lo teria rendido mais.`;
    return O(f.t, f.c, f.ef, Math.round(fit * 100), fb, { fit, ic: f.ic, tag: fit >= 1 ? '' : '' });
  });
  return { id: 'final', final: true, ic: '🏁', t: 'DECISÃO FINAL', txt: 'Você recebeu 5.000 EcoCoins para realizar sua última grande melhoria. Onde irá investir?', opcoes };
}

function tomarDecisao(i) {
  const p = G.passo; if (!p || p.t !== 'decisao' || p.resp !== undefined) return;
  const d = p.d, o = d.opcoes[i];
  if (o.c > G.ecoCoins || (o.req && !o.req.every(tem)) || (o.inst && tem(o.inst))) return;
  p.resp = i; const antes = snap(); const ef = Object.assign({}, o.ef);
  if (o.ign) {
    const n = G.ignorados[o.ign.k] = (G.ignorados[o.ign.k] || 0) + 1;
    ef[o.ign.ind] = -5 * Math.min(n, 3);
    p.ignN = n;
    if (n >= 3) G.avisos.push('⚠️ Ignorar o mesmo problema várias vezes virou uma crise doméstica.');
    else if (n === 2) G.avisos.push('⚠️ Problema repetido: a penalidade dobrou.');
  }
  if (o.c) { ef.ecoCoins = (ef.ecoCoins || 0) - o.c; G.gastoTotal += o.c; }
  p.deltas = aplicarEfeitos(ef);
  if (o.inst) registrarInstalacao(o.inst);
  if (d.final) G.pontosFinal = Math.round(o.fit * 700);
  else G.pontosDecisao += Math.round(o.pts * 1.2);
  G.historicoDecisoes.push({ rodada: G.rodadaAtual, tipo: d.final ? 'final' : 'decisao', ic: o.ic || d.ic, titulo: o.t, custo: o.c, antes, depois: snap() });
  SOM[o.pts >= 60 ? 'acerto' : o.pts >= 30 ? 'clique' : 'erro']();
  posAcao(); renderDecisao();
}

/* ---------- Final ---------- */
function simular() {
  const red = v => clamp(Math.round(v * 1.1), 0, 95);
  const econ = Math.max(0, (G.energia - 40) * 40 + (G.agua - 40) * 30 + (G.residuos - 30) * 12) * 10;
  return {
    energia: red(G.energia - 40), agua: red(G.agua - 40), residuos: red(G.residuos - 30),
    natureza: Math.max(0, Math.round((G.natureza - 20) * 3)), economia: Math.round(econ / 10) * 10, conforto: FAIXAS.conforto[faixaIdx(G.conforto)]
  };
}
function finalizarJogo() {
  G.finalizado = true;
  verificarConquistas(true);
  const c = calcPontos(); c.classe = classificar(c.sust); G.pontuacao = c.total; G.resultado = c; G.sim = simular();
  atualizarHUD([]); atualizarHUDExtra(); SOM.fim();
  mostrarFinal();
}

/* ---------- Ranking local ---------- */
function carregarRanking() {
  const r = lsGet(LS.ranking, []);
  return Array.isArray(r) ? r.filter(e => e && typeof e.pontos === 'number' && e.nick) : [];
}
function ordenarRanking(r) { return r.slice().sort((a, b) => b.pontos - a.pontos || (a.data < b.data ? -1 : 1)); }
function salvarRanking() {
  if (!G || !G.resultado || G.rankingId) return null;
  const e = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), nick: G.nickname, pontos: G.resultado.total,
    classe: G.resultado.classe.nome, ic: G.resultado.classe.ic, data: new Date().toISOString(),
    ind: { energia: G.energia, agua: G.agua, residuos: G.residuos, natureza: G.natureza, conforto: G.conforto }, indice: G.resultado.sust
  };
  const r = ordenarRanking(carregarRanking().concat([e])).slice(0, 300);
  lsSet(LS.ranking, r); G.rankingId = e.id; return e;
}
function posicaoRanking(id) { const i = ordenarRanking(carregarRanking()).findIndex(e => e.id === id); return i < 0 ? null : i + 1; }
function posicaoPotencial(pontos) { return carregarRanking().filter(e => e.pontos > pontos).length + 1; }
function limparRanking() { lsSet(LS.ranking, []); }
