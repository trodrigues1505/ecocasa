/* =====================================================================
   ECOCASA — INTERFACE
   Renderização de telas, HUD, modais, ranking e modo exposição.
   Todo texto digitado pelo jogador passa por esc() antes de ir ao HTML.
   ===================================================================== */
'use strict';

let telaAtual = 'home', telaAnt = 'home', rankOrigem = 'home', nickAtual = '', tutIdx = 0;

/* ---------- Navegação ---------- */
function ir(nome) {
  telaAnt = telaAtual; telaAtual = nome;
  fecharOverlay();
  $$('.tela').forEach(t => t.classList.toggle('ativa', t.id === 'tela-' + nome));
  window.scrollTo(0, 0);
}

/* ---------- Toast ---------- */
function toast(msg, tipo) {
  const box = $('#toasts'); if (!box) return;
  const el = document.createElement('div'); el.className = 'toast ' + (tipo || ''); el.textContent = msg;
  box.appendChild(el);
  while (box.children.length > 3) box.removeChild(box.firstChild);
  setTimeout(() => el.remove(), 3400);
}

/* ---------- HUD ---------- */
function montarHUD() {
  $('#hud-inds').innerHTML = INDS.map(k => `
    <div class="ind" id="ind-${k}" data-k="${k}">
      <div class="ind-top"><span aria-hidden="true">${META[k].ic}</span><span class="ind-nome">${META[k].nome}</span><b class="ind-val">0</b></div>
      <div class="bar" role="progressbar" aria-label="${META[k].nome}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div>
      <small class="ind-faixa"></small><span class="ind-delta" aria-hidden="true"></span>
    </div>`).join('');
}
let coinsMostrado = 10000;
function contarCoins(para) {
  const el = $('#coins-val'); if (!el) return;
  const de = coinsMostrado; coinsMostrado = para;
  if (!cfg.anim || de === para) { el.textContent = fmt(para); return; }
  const t0 = performance.now(), dur = 600;
  (function passo(t) {
    const p = Math.min(1, (t - t0) / dur); el.textContent = fmt(de + (para - de) * p);
    if (p < 1 && coinsMostrado === para) requestAnimationFrame(passo);
  })(t0);
}
function flutuar(el, d, moeda) {
  if (!el || !d) return;
  el.textContent = (d > 0 ? '+' : '−') + (moeda ? fmt(Math.abs(d)) : Math.abs(d));
  el.className = el.className.replace(/\b(pos|neg|show)\b/g, '').trim() + (d > 0 ? ' pos' : ' neg');
  void el.offsetWidth; el.classList.add('show');
}
function atualizarHUD(deltas) {
  if (!G) return;
  INDS.forEach(k => {
    const el = $('#ind-' + k); if (!el) return; const v = G[k], fi = faixaIdx(v);
    $('.ind-val', el).textContent = v; $('.bar i', el).style.width = v + '%'; $('.bar', el).setAttribute('aria-valuenow', v);
    $('.ind-faixa', el).textContent = FAIXA_ICONES[fi] + ' ' + FAIXAS[k][fi];
    el.classList.toggle('crise', v < 20);
  });
  contarCoins(G.ecoCoins);
  (deltas || []).forEach(d => {
    if (!d.d) return;
    if (d.k === 'ecoCoins') flutuar($('#coins-dlt'), d.d, true);
    else flutuar($('#ind-' + d.k + ' .ind-delta'), d.d, false);
  });
}
const EVO = [
  { ids: ['solar'], ic: '☀️', on: 'Painéis solares', off: 'sem painéis' },
  { ids: ['nativas', 'telhado_verde', 'horta'], ic: '🌳', on: 'Jardim e verde', off: 'pouco verde' },
  { ids: ['chuva', 'reuso'], ic: '🌧️', on: 'Captação de chuva', off: 'sem captação' },
  { ids: ['compostagem', 'coleta'], ic: '♻️', on: 'Reciclagem', off: 'sem reciclagem' },
  { ids: ['bicicletario'], ic: '🚲', on: 'Bicicletário', off: 'sem bicicletário' },
  { ids: ['led', 'sensores'], ic: '💡', on: 'Energia eficiente', off: 'luz comum' }
];
function estagioCasa() {
  const n = G.melhorias.length;
  return n < 3 ? '🏠 Casa simples' : n < 7 ? '🏡 Casa em transformação' : '🌿 Casa sustentável';
}
function atualizarCasa() {
  if (!G) return;
  pintarCasa($('#casa-wrap .house'), G.melhorias, calcSust(G), G.natureza, G.areasDesbloqueadas);
  $('#evolucao').innerHTML = `<span class="estagio">${estagioCasa()}</span>` +
    EVO.map(e => { const on = e.ids.some(tem); return `<span class="evo ${on ? 'on' : ''}"><span aria-hidden="true">${e.ic}</span>${on ? '✓ ' + e.on : e.off}</span>`; }).join('');
}
function atualizarHUDExtra() {
  if (!G) return;
  $('#hud-nick').textContent = G.nickname; $('#hud-score').textContent = '★ ' + fmt(G.pontuacao);
  $('#hud-round').innerHTML = `<span class="rot">Rodada ${G.rodadaAtual}/${G.totalRodadas}</span>` +
    Array.from({ length: G.totalRodadas }, (_, i) => `<span class="pip ${i + 1 < G.rodadaAtual ? 'feita' : i + 1 === G.rodadaAtual ? 'atual' : ''}"></span>`).join('');
  $('#hud-crise').innerHTML = INDS.filter(k => G.crises[k]).map(k => `<span class="chip">⚠️ ${CRISE_NOMES[k]}</span>`).join('');
}
function pulsarArea(id) {
  const a = $(`#casa-wrap .area[data-area="${id}"]`); if (!a) return;
  a.classList.add('pulse'); setTimeout(() => a.classList.remove('pulse'), 3200);
}

/* ---------- Pedaços de HTML reutilizáveis ---------- */
function chipsDelta(ds) {
  const h = ds.filter(d => d.d !== 0).map(d => {
    const pos = d.d > 0, v = d.k === 'ecoCoins' ? fmt(Math.abs(d.d)) : Math.abs(d.d);
    const de = d.k === 'ecoCoins' ? '' : `${d.antes} → ${d.depois} `;
    return `<span class="chip ${pos ? 'pos' : 'neg'}">${META[d.k].ic} ${META[d.k].nome} ${de}${pos ? '▲ +' : '▼ −'}${v}</span>`;
  }).join('');
  return h || '<span class="chip neutro">Sem mudança nos indicadores</span>';
}
function chipsPrev(ef, custo, extra) {
  const c = [];
  if (custo) c.push(`<span class="chip neg">💰 −${fmt(custo)}</span>`);
  Object.keys(ef).forEach(k => { if (ef[k]) c.push(`<span class="chip ${ef[k] > 0 ? 'pos' : 'neg'}">${META[k].ic} ${ef[k] > 0 ? '+' : '−'}${Math.abs(ef[k])}</span>`); });
  if (extra) c.push(extra);
  if (!c.length) c.push('<span class="chip neutro">Sem custo e sem efeito</span>');
  return `<span class="chips">${c.join('')}</span>`;
}
function avisosHTML() {
  if (!G.avisos.length) return '';
  const h = `<div class="avisos">${G.avisos.map(a => `<div>${esc(a)}</div>`).join('')}</div>`; G.avisos = []; return h;
}
function setPainel(html) { const p = $('#painel'); p.innerHTML = html; p.scrollTop = 0; p.style.animation = 'none'; void p.offsetWidth; p.style.animation = ''; }
const saldoHTML = () => `<p class="saldo">Você tem <b>💰 ${fmt(G.ecoCoins)} EcoCoins</b></p>`;

/* ---------- Painel: início de rodada ---------- */
function renderInicio() {
  const i = G.passo.info, t = TEMAS[i.n], li = (ic, h) => `<li><span class="ic">${ic}</span><span>${h}</span></li>`;
  const L = [];
  if (i.n === 1) L.push(li('🏠', 'Você começa com <b>10.000 EcoCoins</b> e uma casa convencional. A <b>Sala</b> e a <b>Cozinha</b> já estão liberadas.'));
  if (i.renda) L.push(li('💰', `Economia nas contas: <b>+${fmt(i.renda)} EcoCoins</b>. Quanto mais eficiente a casa, maior a economia.`));
  i.andamento.forEach(a => L.push(li(a.ev.ic, `<b>${a.ev.t}</b> continua.<div class="chips" style="margin-top:6px">${chipsDelta(a.deltas)}</div>`)));
  i.novas.forEach(a => L.push(li('🔓', `Área liberada: <b>${a.ic} ${a.nome}</b>. ${a.desc}`)));
  if (G.desconto > 0) L.push(li('🏷️', `Desconto de <b>${Math.round(G.desconto * 100)}%</b> na próxima obra.`));
  setPainel(`<span class="pill">Rodada ${i.n} de ${G.totalRodadas}</span><h2>${t[0]}</h2><p class="txt">${t[1]}</p>
    <ul class="linhas">${L.join('')}</ul>${avisosHTML()}
    <button class="btn btn-primary btn-lg btn-block" data-act="cont">Vamos!</button>`);
}

/* ---------- Painel: pergunta ---------- */
function renderQuiz() {
  const p = G.passo, q = p.q, feito = p.resp !== undefined;
  const opts = p.opcoes.map((o, i) => {
    let cls = 'opt', marca = '';
    if (feito) { if (o.ok) { cls += ' certa'; marca = '✓ Correta'; } else if (i === p.resp) { cls += ' errada'; marca = '✗ Sua resposta'; } }
    return `<button class="${cls}" data-act="quiz" data-i="${i}" ${feito ? 'disabled' : ''}><span class="letra">${'ABCD'[i]}</span><span class="corpo"><span class="t">${esc(o.t)}</span></span>${marca ? `<span class="marca">${marca}</span>` : ''}</button>`;
  }).join('');
  let fb = '';
  if (feito) {
    const ok = p.opcoes[p.resp].ok;
    fb = `<div class="feedback ${ok ? 'bom' : 'meio'}"><h3>${ok ? '🎉 Correto!' : '🤔 Quase!'}</h3><p>${esc(q.expl)}</p>
      <div class="chips">${chipsDelta(p.deltas)}</div>${avisosHTML()}</div>
      <button class="btn btn-primary btn-lg btn-block" data-act="cont">Continuar</button>`;
  }
  setPainel(`<span class="pill">🧠 Desafio de conhecimento · ${p.idx} de ${p.total}</span><h2>${esc(q.txt)}</h2>
    <p class="txt">Acertar rende ${META[q.ind].ic} ${META[q.ind].nome} e EcoCoins.</p><div class="opcoes">${opts}</div>${fb}`);
}

/* ---------- Painel: decisão ---------- */
function renderDecisao() {
  const p = G.passo, d = p.d, feito = p.resp !== undefined;
  const opts = d.opcoes.map((o, i) => {
    let bloq = '', falta = '';
    if (o.c > G.ecoCoins) falta = `Faltam ${fmt(o.c - G.ecoCoins)} EcoCoins`;
    else if (o.req && !o.req.every(tem)) falta = 'Requer: ' + o.req.filter(r => !tem(r)).map(r => MELH(r).nome).join(', ');
    else if (o.inst && tem(o.inst)) falta = 'Já instalado';
    bloq = falta ? 'disabled' : '';
    let cls = 'opt', ef = o.ef, extra = '';
    if (o.ign) { const n = (G.ignorados[o.ign.k] || 0) + 1; ef = Object.assign({}, o.ef, { [o.ign.ind]: -5 * Math.min(n, 3) }); extra = '<span class="chip warn">⚠️ piora se repetir</span>'; }
    if (feito) { cls += i === p.resp ? ' escolhida' : ''; bloq = 'disabled'; }
    return `<button class="${cls}" data-act="dec" data-i="${i}" ${bloq}><span class="letra">${'ABCD'[i]}</span><span class="corpo"><span class="t">${o.ic ? o.ic + ' ' : ''}${esc(o.t)}</span>${chipsPrev(ef, o.c, extra)}${falta ? `<span class="falta">${falta}</span>` : ''}${o.tag && feito && i === p.resp ? `<span class="tag">${esc(o.tag)}</span>` : ''}</span>${feito && i === p.resp ? '<span class="marca">✓</span>' : ''}</button>`;
  }).join('');
  let fb = '';
  if (feito) {
    const o = d.opcoes[p.resp];
    const titulo = d.final ? (o.fit >= 1 ? '🏆 Escolha certeira!' : '👍 Boa aposta!') : o.pts >= 75 ? '👏 Boa escolha!' : o.pts >= 45 ? '🤷 Escolha razoável' : '⚠️ Cuidado com essa escolha';
    const cls = d.final ? (o.fit >= 1 ? 'bom' : 'meio') : o.pts >= 75 ? 'bom' : o.pts >= 45 ? 'meio' : 'ruim';
    fb = `<div class="feedback ${cls}"><h3>${titulo}</h3><p>${esc(o.fb)}</p>${o.tag ? `<p><span class="chip neutro">${esc(o.tag)}</span></p>` : ''}
      <div class="chips">${chipsDelta(p.deltas)}</div>${avisosHTML()}</div>
      <button class="btn btn-primary btn-lg btn-block" data-act="cont">${d.final ? 'Ver o futuro da casa' : 'Continuar'}</button>`;
  }
  const pill = d.crise ? `<span class="pill warn">⚠️ ${d.t}</span>` : d.final ? '<span class="pill">🏁 Última rodada</span>' : '<span class="pill">🧭 Decisão estratégica</span>';
  setPainel(`${pill}<h2>${d.ic} ${d.crise ? 'Hora de reagir' : esc(d.t)}</h2><p class="txt">${esc(d.txt)}</p>${saldoHTML()}<div class="opcoes">${opts}</div>${fb}`);
}

/* ---------- Painel: obras (loja) ---------- */
function renderObras() {
  const p = G.passo, filtro = G.filtroArea || 'todas';
  const filtros = `<button class="${filtro === 'todas' ? 'on' : ''}" data-act="filtro" data-a="todas">Todas</button>` +
    AREAS.map(a => `<button class="${filtro === a.id ? 'on' : ''}" data-act="filtro" data-a="${a.id}">${G.areasDesbloqueadas.includes(a.id) ? a.ic : '🔒'} ${a.nome}</button>`).join('');
  const cards = MELHORIAS.filter(m => filtro === 'todas' || m.area === filtro).map(m => {
    const bl = motivoBloqueio(m), preco = precoDe(m), area = AREAS.find(a => a.id === m.area);
    let estado = '', pode = false;
    if (bl === 'instalada') estado = '<div class="estado" style="color:var(--good)">✓ Instalada</div>';
    else if (bl === 'area') estado = `<div class="estado">🔒 Área bloqueada (libera na rodada ${area.libera})</div>`;
    else if (bl.startsWith('req:')) estado = `<div class="estado">🔒 Requer: ${esc(bl.slice(4))}</div>`;
    else if (G.obras <= 0) estado = '<div class="estado">Sem obras nesta rodada</div>';
    else if (preco > G.ecoCoins) estado = `<div class="estado" style="color:var(--bad)">Faltam ${fmt(preco - G.ecoCoins)} EcoCoins</div>`;
    else pode = true;
    const precoH = precoBase(m) !== preco ? `<s>${fmt(precoBase(m))}</s>${fmt(preco)}` : fmt(preco);
    return `<div class="mel ${bl === 'instalada' ? 'inst' : ''}"><span class="ic" aria-hidden="true">${m.ic}</span>
      <div><h4>${esc(m.nome)}</h4><p>${esc(m.desc)}</p>${chipsPrev(m.ef, 0)}${estado}</div>
      <div style="text-align:right;display:grid;gap:6px;justify-items:end"><span class="preco">💰 ${precoH}</span>
      ${bl === 'instalada' ? '' : `<button class="btn btn-sec" data-act="comprar" data-id="${m.id}" ${pode ? '' : 'disabled'}>Instalar</button>`}</div></div>`;
  }).join('');
  const combos = SINERGIAS.map(s => {
    const on = G.sinergias.includes(s.id);
    return `<div class="chip ${on ? 'pos' : ''}" style="margin:0 6px 6px 0">${on ? '✓' : '?'} ${s.ic} ${esc(s.nome)}: ${s.req.map(r => MELH(r).ic).join(' + ')} ${efTexto(s.ef)}</div>`;
  }).join('');
  const rodape = p.t === 'invest'
    ? `<button class="btn btn-primary btn-lg btn-block" data-act="cont" style="margin-top:16px">Concluir investimentos</button>`
    : `<button class="btn btn-primary btn-lg btn-block" data-act="voltar-fim" style="margin-top:16px">Voltar</button>`;
  setPainel(`<span class="pill">🔨 Obras</span><h2>Melhorias da casa</h2>
    <p class="txt">Obras restantes nesta rodada: <b>${G.obras}</b>. Toque numa área da casa para filtrar.</p>${saldoHTML()}
    ${G.desconto > 0 ? `<p class="chip warn" style="margin-bottom:12px">🏷️ ${Math.round(G.desconto * 100)}% de desconto na próxima obra</p>` : ''}
    ${G.msgObras}<div class="areas-filtro">${filtros}</div><div class="loja">${cards}</div>
    <div class="combos"><h3>🧩 Combos (bônus por sinergia)</h3>${combos}</div>${rodape}`);
}

/* ---------- Painel: fim da rodada ---------- */
function renderFim() {
  const c = classificar(calcSust(G));
  setPainel(`<span class="pill">Fim da rodada ${G.rodadaAtual}</span><h2>${c.ic} ${c.nome.charAt(0) + c.nome.slice(1).toLowerCase()}</h2>
    <p class="txt">Índice de sustentabilidade: <b>${calcSust(G)}</b>. ${c.desc}</p>${saldoHTML()}
    <ul class="linhas">${G.obras > 0 ? '<li><span class="ic">🔨</span><span>Você ainda pode fazer <b>1 obra</b> nesta rodada.</span></li>' : '<li><span class="ic">✅</span><span>Obras desta rodada concluídas.</span></li>'}</ul>
    ${avisosHTML()}
    <div class="opcoes">${G.obras > 0 ? '<button class="btn btn-sec btn-lg btn-block" data-act="obra">🔨 Fazer uma obra</button>' : ''}
    <button class="btn btn-primary btn-lg btn-block" data-act="cont">Próxima rodada</button></div>`);
}

/* ---------- Evento (carta) ---------- */
function abrirOverlay(html) { const o = $('#overlay'); o.innerHTML = html; o.classList.add('on'); const b = $('button', o); if (b) b.focus(); }
function fecharOverlay() { const o = $('#overlay'); if (o) { o.classList.remove('on'); o.innerHTML = ''; } modalFns = []; }
function mostrarEvento(ev) {
  SOM.evento();
  const r = aplicarEvento(ev, true); posAcao();
  const rotulo = ev.tom === 'bom' ? 'Boa notícia' : ev.tom === 'ruim' ? 'Desafio' : 'Clima';
  const extra = ev.extra && ev.extra.desconto ? `<span class="chip pos">🏷️ −${Math.round(ev.extra.desconto * 100)}% na próxima obra</span>` : '';
  abrirOverlay(`<div class="carta ${ev.tom}" role="dialog" aria-modal="true" aria-label="${esc(ev.t)}">
    <span class="pill ${ev.tom === 'ruim' ? 'warn' : ''}">${rotulo}</span><div class="ic">${ev.ic}</div><h2>${ev.t}</h2><p>${ev.txt}</p>
    ${ev.dur > 1 ? `<p><span class="chip warn">Dura ${ev.dur} rodadas</span></p>` : ''}
    <div class="chips">${chipsDelta(r.deltas)}${extra}</div>
    <div class="notas">${r.msgs.map(m => `<div>${esc(m)}</div>`).join('')}</div>${avisosHTML()}
    <button class="btn btn-primary btn-lg btn-block" data-act="evento-ok">Continuar</button></div>`);
}

/* ---------- Modais ---------- */
let modalFns = [];
function modal(titulo, corpo, botoes) {
  modalFns = botoes.map(b => b.fn);
  abrirOverlay(`<div class="modal" role="dialog" aria-modal="true" aria-label="${esc(titulo)}"><h2>${titulo}</h2>${corpo}
    <div class="acoes">${botoes.map((b, i) => `<button class="btn ${b.cls || 'btn-ghost'}" data-mi="${i}">${b.t}</button>`).join('')}</div></div>`);
}
function swHTML(k, titulo, sub) {
  return `<div class="linha-cfg"><div><b>${titulo}</b><small>${sub}</small></div>
    <button class="sw" role="switch" data-cfg="${k}" aria-checked="${cfg[k]}" aria-label="${titulo}"><span class="txt-sw">${cfg[k] ? 'SIM' : 'NÃO'}</span></button></div>`;
}
function abrirConfig() {
  modal('⚙️ Configurações',
    swHTML('som', '🔊 Som', 'Efeitos sonoros do jogo') + swHTML('anim', '✨ Animações', 'Desligue se o computador estiver lento') +
    swHTML('exposicao', '🖼️ Modo exposição', 'Volta sozinho ao início quando ninguém está jogando') +
    `<div class="linha-cfg"><div><b>🏆 Ranking local</b><small>Apaga todas as pontuações deste computador</small></div><button class="btn btn-danger" data-mi="9">Limpar</button></div>`,
    [{ t: 'Fechar', cls: 'btn-primary', fn: () => true }]);
}
function confirmarLimparRanking() {
  modal('Limpar o ranking?', '<p>Isso apaga <b>todas</b> as pontuações salvas neste computador. Não dá para desfazer.</p>', [
    { t: 'Cancelar', fn: () => true },
    { t: 'Apagar tudo', cls: 'btn-danger', fn: () => { limparRanking(); toast('🗑️ Ranking apagado', 'bom'); if (telaAtual === 'ranking') mostrarRanking(); return true; } }
  ]);
}
function confirmarSair() {
  modal('Sair da partida?', '<p>Seu progresso nesta partida será perdido.</p>', [
    { t: 'Continuar jogando', cls: 'btn-primary', fn: () => true },
    { t: 'Sair', fn: () => { G = null; ir('home'); return true; } }
  ]);
}

/* ---------- Tutorial ---------- */
function mostrarTutorial(i) {
  tutIdx = i; const slides = $$('.tut-slide');
  slides.forEach((s, k) => s.classList.toggle('on', k === i));
  $('#tut-pontos').innerHTML = slides.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('');
  $('#btn-tut-prox').textContent = i === slides.length - 1 ? 'Entendi, vamos!' : 'Próximo';
}

/* ---------- Final: 10 anos depois ---------- */
function mostrarFinal() {
  ir('final');
  const box = $('#sim-casa'); box.innerHTML = casaSVG('f', false);
  const root = $('.house', box); pintarCasa(root, G.melhorias, calcSust(G), G.natureza); root.classList.add('futuro');
  const s = G.sim;
  const itens = [
    ['⚡', 'Consumo de energia', `−${s.energia}%`], ['💧', 'Consumo de água', `−${s.agua}%`], ['♻️', 'Resíduos enviados ao aterro', `−${s.residuos}%`],
    ['🌱', 'Biodiversidade no entorno', `+${s.natureza}%`], ['💰', 'Economia acumulada', `${fmt(s.economia)} EcoCoins`], ['😊', 'Conforto dos moradores', s.conforto]
  ];
  $('#sim-nums').innerHTML = itens.map(i => `<div class="num"><span class="ic">${i[0]}</span><b>${esc(i[2])}</b><span>${i[1]}</span></div>`).join('');
  $$('#sim-nums .num').forEach((n, i) => setTimeout(() => n.classList.add('on'), 500 + i * 650));
}

/* ---------- Resultado ---------- */
function mostrarResultado() {
  ir('resultado');
  const r = G.resultado, c = r.classe, salvo = !!G.rankingId;
  const pos = salvo ? posicaoRanking(G.rankingId) : posicaoPotencial(r.total);
  const linhaInd = k => { const fi = faixaIdx(G[k]); return `<div class="ind" data-k="${k}"><div class="ind-top"><span>${META[k].ic}</span><span class="ind-nome">${META[k].nome}</span><b class="ind-val">${G.inicial[k]} → ${G[k]}</b></div><div class="bar"><i style="width:${G[k]}%"></i></div><small class="ind-faixa">${FAIXA_ICONES[fi]} ${FAIXAS[k][fi]}</small></div>`; };
  const conq = CONQUISTAS.map(q => {
    const on = G.conquistas.includes(q.id);
    return `<li class="${on ? '' : 'off'}"><span class="ic">${on ? q.ic : '🔒'}</span><span><b>${on || !q.secreta ? q.nome : 'CONQUISTA SECRETA'}</b><small>${on || !q.secreta ? q.desc : 'Continue jogando para descobrir.'}</small></span></li>`;
  }).join('');
  const hist = G.historicoDecisoes.filter(h => h.tipo !== 'quiz').map(h => `<li><b>RODADA ${h.rodada}</b> ${h.ic} ${esc(h.titulo)}</li>`).join('') || '<li>Nenhuma decisão registrada.</li>';
  const partes = Object.keys(r.partes).map(k => `<div><span>${k}</span><b>${fmt(r.partes[k])}</b></div>`).join('');
  const minK = INDS.slice().sort((a, b) => G[a] - G[b])[0], maxK = INDS.slice().sort((a, b) => G[b] - G[a])[0];
  const dica = G[maxK] - G[minK] >= 30
    ? `Sua casa foi muito bem em ${META[maxK].nome.toLowerCase()}, mas ${META[minK].nome.toLowerCase()} ficou para trás. Equilíbrio vale pontos.`
    : 'Sua casa ficou equilibrada: cada área ajuda as outras a funcionar melhor.';
  $('#res').innerHTML = `
    <div class="res-topo">
      <div class="res-nota"><div class="nick">👤 ${esc(G.nickname)}</div><div class="pts">${fmt(r.total)}</div>
        <div class="classe">${c.ic} ${c.nome}</div><div class="classe-d">${c.desc} Índice de sustentabilidade: ${r.sust}.</div>
        <div class="pos">🏆 ${salvo ? `Você está em ${pos}º no ranking` : `Com essa pontuação você ficaria em ${pos}º. Salve para entrar!`}</div></div>
      <div class="casa-wrap">${casaSVG('r', false)}</div>
    </div>
    <div class="res-grid">
      <div class="cx"><h3>Indicadores finais</h3>${INDS.map(linhaInd).join('')}
        <div class="partes" style="margin-top:12px"><div><span>⚖️ Equilíbrio da casa</span><b>${r.eq}</b></div><div><span>📈 Eficiência dos investimentos</span><b>${r.ef}</b></div><div><span>💰 EcoCoins restantes</span><b>${fmt(G.ecoCoins)}</b></div></div></div>
      <div class="cx"><h3>De onde vieram os pontos</h3><div class="partes">${partes}</div>
        <h3 style="margin-top:16px">Melhorias instaladas</h3><div class="chips">${G.melhorias.map(id => `<span class="chip">${MELH(id).ic} ${esc(MELH(id).nome)}</span>`).join('') || '<span class="chip">Nenhuma</span>'}</div>
        ${G.sinergias.length ? `<h3 style="margin-top:16px">Combos</h3><div class="chips">${G.sinergias.map(id => { const s = SINERGIAS.find(x => x.id === id); return `<span class="chip pos">${s.ic} ${esc(s.nome)}</span>`; }).join('')}</div>` : ''}</div>
      <div class="cx"><h3>Conquistas (${G.conquistas.length}/${CONQUISTAS.length})</h3><ul class="conq">${conq}</ul></div>
    </div>
    <div class="cx"><h3>Suas principais decisões</h3><ul class="hist">${hist}</ul></div>
    <div class="msg-edu"><p>Uma casa sustentável não depende de uma única tecnologia. Eficiência, consumo consciente, água, resíduos, biodiversidade e conforto precisam trabalhar juntos. ${dica}</p>
      <p>Seu desafio terminou. Mas outra pessoa pode tentar superar seu recorde.</p></div>
    <div class="res-acoes">
      <button class="btn btn-primary btn-lg" data-act="salvar" ${salvo ? 'disabled' : ''}>${salvo ? '✓ Salvo no ranking' : '💾 SALVAR NO RANKING'}</button>
      <button class="btn btn-sec btn-lg" data-act="jogar">🔄 JOGAR NOVAMENTE</button>
      <button class="btn btn-ghost btn-lg" data-act="ranking">🏆 RANKING</button>
      <button class="btn btn-ghost btn-lg" data-act="inicio">🏠 VOLTAR AO INÍCIO</button></div>`;
  const rootR = $('#res .house'); pintarCasa(rootR, G.melhorias, r.sust, G.natureza);
  window.scrollTo(0, 0);
}

/* ---------- Ranking ---------- */
function linhaRank(e, pos, eu) {
  const medalha = pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : pos + 'º';
  return `<li class="${eu ? 'eu' : ''}"><span class="pos">${medalha}</span><span class="nome">${esc(e.nick)}<small>${e.ic || ''} ${esc(e.classe || '')}</small></span><span class="pt">${fmt(e.pontos)}</span></li>`;
}
function mostrarRanking() {
  if (telaAtual !== 'ranking') rankOrigem = telaAtual;
  ir('ranking');
  const lista = ordenarRanking(carregarRanking()), top = lista.slice(0, 10);
  let atual = '', fora = '';
  if (G && G.resultado) {
    const salvo = !!G.rankingId, pos = salvo ? posicaoRanking(G.rankingId) : posicaoPotencial(G.resultado.total);
    atual = `<div class="rank-atual"><div><b>${esc(G.nickname)}</b><br>${salvo ? `Você está em ${pos}º` : `Ficaria em ${pos}º (ainda não salvo)`}</div><div style="font-size:1.8rem;font-weight:900">${fmt(G.resultado.total)}</div></div>`;
    if (salvo && pos > 10) fora = `<h3>SUA POSIÇÃO</h3><ul class="rank-lista">${linhaRank(lista[pos - 1], pos, true)}</ul>`;
  }
  const corpo = top.length
    ? `<ul class="rank-lista">${top.map((e, i) => linhaRank(e, i + 1, G && e.id === G.rankingId)).join('')}</ul>${fora}`
    : '<div class="vazio"><span class="ic">🏆</span><b>Ninguém jogou ainda.</b><p>Seja a primeira pessoa a entrar no ranking!</p></div>';
  $('#rank').innerHTML = `<h1>🏆 RANKING ECOCASA</h1><p class="frase">Quem construiu a casa mais sustentável?</p>${atual}${corpo}
    <div class="res-acoes"><button class="btn btn-ghost btn-lg" data-act="ranking-voltar">← Voltar</button>${G && G.resultado ? '' : '<button class="btn btn-primary btn-lg" data-act="comecar">COMEÇAR DESAFIO</button>'}</div>`;
}

/* ---------- Modo exposição: demonstração + inatividade ---------- */
let ultimaAtiv = Date.now(), attractOn = false, attractTimer = null, avisoIdle = null;
const ATT = [['led', '💡 Iluminação LED'], ['solar', '☀️ Energia solar'], ['nativas', '🌳 Jardim de espécies nativas'], ['chuva', '🌧️ Captação de água da chuva'],
  ['horta', '🥕 Horta em casa'], ['compostagem', '🪱 Compostagem'], ['coleta', '♻️ Coleta seletiva'], ['bicicletario', '🚲 Mobilidade sustentável'], ['telhado_verde', '🌿 Telhado verde']];
function iniciarAttract() {
  attractOn = true; const box = $('#attract'); box.classList.add('on');
  const root = $('.house', box); const todas = AREAS.map(a => a.id);
  let i = -1, ups = [];
  const cap = $('#attract-legenda');
  const passo = () => {
    i++;
    if (i >= ATT.length + 2) { i = -1; ups = []; pintarCasa(root, ups, 30, 15, todas); cap.textContent = 'Começando de novo...'; return; }
    if (i < ATT.length) { ups.push(ATT[i][0]); cap.textContent = ATT[i][1]; }
    else cap.textContent = 'Sua casa pode chegar ao futuro. Consegue?';
    const prog = Math.min(1, (i + 1) / ATT.length);
    pintarCasa(root, ups, 30 + prog * 60, 15 + prog * 75, todas);
  };
  pintarCasa(root, [], 30, 15, todas); cap.textContent = 'Uma casa comum...';
  attractTimer = setInterval(passo, 1500);
}
function pararAttract() { attractOn = false; clearInterval(attractTimer); $('#attract').classList.remove('on'); }
function voltarAoInicio() { G = null; avisoIdle = null; pararAttract(); ir('home'); }
function checarInatividade() {
  const idle = (Date.now() - ultimaAtiv) / 1000, aberto = $('#overlay').classList.contains('on');
  if (avisoIdle) {
    avisoIdle.t--; const c = $('#idle-cont'); if (c) c.textContent = avisoIdle.t;
    if (avisoIdle.t <= 0) voltarAoInicio();
    return;
  }
  if (telaAtual === 'home' && !attractOn && idle > 20 && !aberto) { iniciarAttract(); return; }
  if (!cfg.exposicao || attractOn) return;
  if (['resultado', 'ranking', 'final'].includes(telaAtual) && idle > 45 && !aberto) voltarAoInicio();
  else if (['nick', 'tutorial'].includes(telaAtual) && idle > 60 && !aberto) voltarAoInicio();
  else if (telaAtual === 'jogo' && idle > 150) {
    if (aberto) { if (idle > 300) voltarAoInicio(); return; }
    avisoIdle = { t: 15 };
    modal('Ainda está aí?', '<p>A partida volta ao início em <b id="idle-cont">15</b> segundos.</p>', [{ t: 'Continuar jogando', cls: 'btn-primary', fn: () => { avisoIdle = null; return true; } }]);
  }
}

/* ---------- Nickname ---------- */
const NICKS = ['Eco Visitante', 'Solarzinho', 'Mestre Verde', 'Gota Azul', 'Casa Viva', 'Folha Nova', 'Ventania', 'Semente'];
function irNick() {
  const inp = $('#nick-input'); inp.value = ''; inp.classList.remove('erro'); $('#nick-msg').textContent = ''; $('#nick-cont').textContent = '0/16';
  $('#nick-sug').innerHTML = shuffle(NICKS).slice(0, 4).map(n => `<button type="button" data-nick="${esc(n)}">${esc(n)}</button>`).join('');
  ir('nick'); setTimeout(() => inp.focus(), 80);
}
function confirmarNick() {
  const inp = $('#nick-input'), n = sanitizarNick(inp.value);
  if (!n) { inp.classList.add('erro'); $('#nick-msg').textContent = 'Digite um nome ou nickname para continuar.'; inp.focus(); return; }
  nickAtual = n; ir('tutorial'); mostrarTutorial(0);
}

/* ---------- Casa interativa ---------- */
function casaClick(id) {
  if (!G) return;
  const a = AREAS.find(x => x.id === id); if (!a) return;
  if (!G.areasDesbloqueadas.includes(id)) { toast(`🔒 ${a.nome} será liberada na rodada ${a.libera}`); return; }
  const p = G.passo;
  if (p && (p.t === 'invest' || p.t === 'obra')) { G.filtroArea = id; renderObras(); return; }
  const inst = G.melhorias.filter(m => MELH(m).area === id).map(m => MELH(m).nome);
  toast(`${a.ic} ${a.nome}: ${a.desc} ${inst.length ? 'Instalado: ' + inst.join(', ') + '.' : 'Nada instalado ainda.'}`);
}

/* ---------- Ações (delegação de eventos) ---------- */
function acao(a, d) {
  switch (a) {
    case 'comecar': irNick(); break;
    case 'ranking': mostrarRanking(); break;
    case 'ranking-voltar': if (rankOrigem === 'resultado' && G && G.resultado) mostrarResultado(); else { ir('home'); } break;
    case 'cfg': abrirConfig(); break;
    case 'sair': confirmarSair(); break;
    case 'nick-ok': confirmarNick(); break;
    case 'nick-voltar': ir('home'); break;
    case 'tut-prox': if (tutIdx >= $$('.tut-slide').length - 1) iniciarJogo(nickAtual); else mostrarTutorial(tutIdx + 1); break;
    case 'tut-pular': iniciarJogo(nickAtual); break;
    case 'sim-res': mostrarResultado(); break;
    case 'cont': avancar(); break;
    case 'quiz': responderPergunta(+d.i); break;
    case 'dec': tomarDecisao(+d.i); break;
    case 'comprar': comprarMelhoria(d.id); break;
    case 'filtro': G.filtroArea = d.a; renderObras(); break;
    case 'obra': G.fimPasso = G.passo; G.passo = { t: 'obra' }; G.filtroArea = 'todas'; G.msgObras = ''; renderObras(); break;
    case 'voltar-fim': G.passo = G.fimPasso; G.msgObras = ''; renderFim(); break;
    case 'evento-ok': fecharOverlay(); avancar(); break;
    case 'salvar': if (salvarRanking()) { toast('🏆 Pontuação salva no ranking!', 'bom'); SOM.moeda(); mostrarResultado(); } break;
    case 'jogar': G = null; irNick(); break;
    case 'inicio': voltarAoInicio(); break;
  }
}

function iniciarUI() {
  salvarCfg();
  montarHUD();
  $('#casa-wrap').innerHTML = casaSVG('g', true);
  const hero = $('#hero-casa'); hero.innerHTML = casaSVG('h', false); pintarCasa($('.house', hero), [], 36, 20);
  $('#attract-casa').innerHTML = casaSVG('a', false);
  pintarCasa($('#casa-wrap .house'), [], 36, 20, ['sala', 'cozinha']);

  document.addEventListener('click', e => {
    audioInit();
    const mi = e.target.closest('[data-mi]');
    if (mi && $('#overlay').contains(mi)) {
      const i = +mi.dataset.mi; SOM.clique();
      if (i === 9) { confirmarLimparRanking(); return; }
      const fn = modalFns[i]; if (fn && fn() !== false) { fecharOverlay(); avisoIdle = null; }
      return;
    }
    const sw = e.target.closest('[data-cfg]');
    if (sw) { const k = sw.dataset.cfg; cfg[k] = !cfg[k]; salvarCfg(); sw.setAttribute('aria-checked', cfg[k]); $('.txt-sw', sw).textContent = cfg[k] ? 'SIM' : 'NÃO'; if (k === 'som') SOM.clique(); return; }
    const ns = e.target.closest('[data-nick]');
    if (ns) { const inp = $('#nick-input'); inp.value = ns.dataset.nick; inp.dispatchEvent(new Event('input')); inp.focus(); return; }
    const ar = e.target.closest('.area');
    if (ar && !ar.closest('#attract')) { SOM.clique(); casaClick(ar.dataset.area); return; }
    const b = e.target.closest('[data-act]');
    if (!b || b.disabled) return;
    SOM.clique(); acao(b.dataset.act, b.dataset);
  });
  ['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach(ev => document.addEventListener(ev, () => { ultimaAtiv = Date.now(); if (attractOn) pararAttract(); }, { passive: true }));
  document.addEventListener('keydown', e => {
    audioInit();
    if (e.key === 'Escape' && $('#overlay').classList.contains('on') && modalFns.length) { fecharOverlay(); avisoIdle = null; return; }
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('area')) { e.preventDefault(); casaClick(e.target.dataset.area); return; }
    if (e.key === 'Enter' && e.target.id === 'nick-input') { e.preventDefault(); confirmarNick(); return; }
    if (/^[1-4]$/.test(e.key) && telaAtual === 'jogo' && !$('#overlay').classList.contains('on')) {
      const o = $$('#painel .opt:not(:disabled)')[+e.key - 1]; if (o) o.click();
    }
  });
  $('#nick-input').addEventListener('input', e => {
    const v = sanitizarNick(e.target.value.replace(/\s{2,}/g, ' ')); if (v !== e.target.value.trim() && !/\s$/.test(e.target.value)) e.target.value = v;
    $('#nick-cont').textContent = e.target.value.length + '/16'; e.target.classList.remove('erro'); $('#nick-msg').textContent = '';
  });
  setInterval(checarInatividade, 1000);
}
document.addEventListener('DOMContentLoaded', iniciarUI);
