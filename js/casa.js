/* =====================================================================
   ECOCASA — ILUSTRAÇÃO DA CASA (SVG puro, 100% offline)
   Cada melhoria é um <g class="up" data-up="id">: ligada pela classe .on
   ===================================================================== */
'use strict';

function hexRgb(h) { return [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); }
function mixCor(a, b, t) {
  const A = hexRgb(a), B = hexRgb(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
}

/* Tema do cenário: céu, colinas e grama mudam conforme o desempenho */
function aplicarTema(root, sust, nat) {
  const t = Math.max(0, Math.min(1, sust / 100)), n = Math.max(0, Math.min(1, nat / 100));
  const s = root.style;
  s.setProperty('--sky-top', mixCor('#B5B1A0', '#69BFE9', t));
  s.setProperty('--sky-bot', mixCor('#E4DFC9', '#DDF4F5', t));
  s.setProperty('--hill', mixCor('#A59D72', '#7FC08F', n));
  s.setProperty('--grass', mixCor('#BEA95E', '#4FB26C', n));
  s.setProperty('--grass2', mixCor('#A18F49', '#3A9657', n));
  s.setProperty('--leaf', mixCor('#AEA44B', '#2F9E5D', n));
}

/* Liga/desliga melhorias, áreas bloqueadas e tema */
function pintarCasa(root, ups, sust, nat, areasLiberadas) {
  if (!root) return;
  root.querySelectorAll('.up').forEach(el => el.classList.toggle('on', ups.includes(el.dataset.up)));
  root.classList.toggle('t-coleta', ups.includes('coleta'));
  root.classList.toggle('t-bike', ups.includes('bicicletario'));
  if (areasLiberadas) {
    root.querySelectorAll('.area').forEach(a => {
      const livre = areasLiberadas.includes(a.dataset.area);
      a.classList.toggle('bloq', !livre);
      a.setAttribute('aria-disabled', livre ? 'false' : 'true');
    });
  }
  aplicarTema(root, sust, nat);
}

function badgeArea(id, x, y, emoji) {
  return `<g class="badge" transform="translate(${x} ${y})"><circle r="15"/><text class="t-emoji" y="6" text-anchor="middle" font-size="16">${emoji}</text><text class="t-lock" y="6" text-anchor="middle" font-size="14">🔒</text></g>`;
}

function casaSVG(p, interativa) {
  const A = (id, nome, conteudo) => interativa
    ? `<g class="area" data-area="${id}" tabindex="0" role="button" aria-label="${nome}"><title>${nome}</title>${conteudo}</g>`
    : `<g>${conteudo}</g>`;
  const hit = pts => `<polygon class="hit" points="${pts}"/>`;
  const B = (id, x, y, e) => interativa ? badgeArea(id, x, y, e) : '';
  return `
<svg class="house ${interativa ? 'interativa' : ''}" viewBox="0 0 760 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustração da casa">
<defs>
  <linearGradient id="${p}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--sky-top)"/><stop offset="1" style="stop-color:var(--sky-bot)"/></linearGradient>
  <radialGradient id="${p}glow"><stop offset="0" stop-color="#FFE9A0" stop-opacity=".95"/><stop offset="1" stop-color="#FFE9A0" stop-opacity="0"/></radialGradient>
</defs>
<rect width="760" height="420" fill="url(#${p}sky)"/>
<g class="sol"><circle cx="86" cy="72" r="44" fill="#FFC94A" opacity=".25"/><circle cx="86" cy="72" r="30" fill="#FFC94A"/></g>
<g class="nuvem n1"><ellipse cx="560" cy="62" rx="42" ry="14" fill="#fff" opacity=".85"/><ellipse cx="590" cy="52" rx="28" ry="12" fill="#fff" opacity=".85"/></g>
<g class="nuvem n2"><ellipse cx="300" cy="40" rx="34" ry="11" fill="#fff" opacity=".8"/><ellipse cx="322" cy="33" rx="22" ry="9" fill="#fff" opacity=".8"/></g>
<path d="M0 300 Q120 240 240 290 T480 280 T760 285 V340 H0Z" style="fill:var(--hill)"/>
<rect y="330" width="760" height="90" style="fill:var(--grass)"/>
<rect y="330" width="760" height="6" style="fill:var(--grass2)"/>

<!-- JARDIM -->
${A('jardim', 'Jardim', `
  ${hit('8,250 214,250 214,418 8,418')}
  <g class="arvore"><rect x="82" y="262" width="12" height="70" rx="3" fill="#7A5A3C"/>
   <ellipse cx="88" cy="250" rx="38" ry="32" style="fill:var(--leaf)"/><ellipse cx="66" cy="266" rx="24" ry="20" style="fill:var(--leaf)" opacity=".9"/><ellipse cx="112" cy="266" rx="24" ry="20" style="fill:var(--leaf)" opacity=".9"/></g>
  <g class="up" data-up="nativas">
    <g><circle cx="38" cy="334" r="15" fill="#3E9C62"/><circle cx="54" cy="338" r="12" fill="#2F8A55"/><circle cx="32" cy="330" r="3.5" fill="#E56A8A"/><circle cx="52" cy="332" r="3.5" fill="#F5C451"/><circle cx="44" cy="342" r="3" fill="#fff"/>
    <circle cx="150" cy="336" r="14" fill="#3E9C62"/><circle cx="168" cy="340" r="11" fill="#2F8A55"/><circle cx="146" cy="331" r="3.5" fill="#F5C451"/><circle cx="166" cy="335" r="3.5" fill="#E56A8A"/><circle cx="124" cy="346" r="3" fill="#E56A8A"/><circle cx="108" cy="348" r="3" fill="#F5C451"/></g></g>
  <g class="up" data-up="horta"><g><rect x="30" y="366" width="130" height="26" rx="5" fill="#8A5E3C"/>
    <g fill="#3E9C62"><path d="M46 366l5-12 5 12z"/><path d="M70 366l5-12 5 12z"/><path d="M94 366l5-12 5 12z"/><path d="M118 366l5-12 5 12z"/><path d="M140 366l5-12 5 12z"/></g>
    <circle cx="76" cy="364" r="4" fill="#E04F3B"/><circle cx="124" cy="364" r="4" fill="#E04F3B"/><circle cx="52" cy="364" r="3.5" fill="#F5A524"/></g></g>
  <g class="up" data-up="chuva"><g><path d="M203 156V286" stroke="#7C939B" stroke-width="4" fill="none"/>
    <rect x="186" y="284" width="32" height="46" rx="6" fill="#3B86C4"/><rect x="186" y="296" width="32" height="3" fill="#2A6AA0"/><rect x="186" y="314" width="32" height="3" fill="#2A6AA0"/><circle cx="202" cy="276" r="3" fill="#6EB6F0"/></g></g>
  <g class="up" data-up="avancado"><g><rect x="106" y="346" width="56" height="24" rx="6" fill="#DDEBF7" stroke="#2B8BE0" stroke-width="2"/><path d="M116 352v12M126 352v12M136 352v12M146 352v12" stroke="#2B8BE0" stroke-width="2"/></g></g>
  <g class="up" data-up="reuso"><path class="fluxo" d="M223 236V346H164" stroke="#2B8BE0" stroke-width="3" fill="none" stroke-dasharray="6 5"/></g>
  ${B('jardim', 30, 276, '🌱')}`)}

<!-- CASA -->
<g class="casa-corpo">
  <rect x="216" y="148" width="268" height="186" rx="6" fill="#F2F5F4" stroke="#C3D1D3" stroke-width="2"/>
  <rect x="226" y="156" width="118" height="78" rx="4" fill="#E3EDF1"/>
  <rect x="356" y="156" width="118" height="78" rx="4" fill="#E6EEE8"/>
  <rect x="226" y="246" width="118" height="78" rx="4" fill="#E3EDF1"/>
  <rect x="356" y="246" width="118" height="78" rx="4" fill="#EAEFE6"/>
  <!-- banheiro -->
  <rect x="316" y="166" width="22" height="22" rx="3" fill="#BFE3EE" stroke="#9DB6BC"/>
  <rect x="236" y="208" width="72" height="22" rx="10" fill="#fff" stroke="#B4C5C9"/>
  <path d="M312 196h10v7" stroke="#8FA3A9" stroke-width="3" fill="none"/>
  <!-- quarto -->
  <rect x="368" y="210" width="84" height="22" rx="6" fill="#8EA8D8"/><rect x="368" y="204" width="22" height="10" rx="4" fill="#fff"/>
  <rect x="418" y="166" width="34" height="26" rx="3" fill="#BFE3EE" stroke="#9DB6BC"/>
  <!-- sala -->
  <rect x="300" y="258" width="34" height="30" rx="3" fill="#BFE3EE" stroke="#9DB6BC"/><path d="M317 258v30M300 273h34" stroke="#9DB6BC"/>
  <rect x="236" y="290" width="62" height="12" rx="5" fill="#3D6A77"/><rect x="236" y="298" width="62" height="22" rx="6" fill="#4C7E8C"/>
  <!-- cozinha -->
  <rect x="380" y="258" width="40" height="24" rx="3" fill="#BFE3EE" stroke="#9DB6BC"/>
  <rect x="440" y="258" width="26" height="62" rx="4" fill="#D6DEE0" stroke="#B4C5C9"/><path d="M462 270v12" stroke="#8FA3A9" stroke-width="2"/>
  <rect x="366" y="298" width="66" height="22" rx="3" fill="#B9C7CB"/>
</g>

<!-- Melhorias internas -->
<g class="up" data-up="led"><g><ellipse cx="285" cy="262" rx="42" ry="26" fill="url(#${p}glow)"/><ellipse cx="415" cy="262" rx="36" ry="22" fill="url(#${p}glow)"/><ellipse cx="285" cy="170" rx="36" ry="20" fill="url(#${p}glow)"/>
  <path d="M285 246v8" stroke="#555" stroke-width="2"/><path d="M279 254h12l-3 7h-6z" fill="#F5C451"/></g></g>
<g class="up" data-up="sensores"><g fill="#2B8BE0"><circle cx="330" cy="252" r="3"/><circle cx="364" cy="252" r="3"/><circle cx="234" cy="162" r="3"/>
  <path d="M325 248q5-5 10 0M359 248q5-5 10 0M229 158q5-5 10 0" stroke="#2B8BE0" stroke-width="1.5" fill="none"/></g></g>
<g class="up" data-up="smart"><g><rect x="236" y="256" width="24" height="18" rx="3" fill="#0E2F3B"/><path d="M241 270v-5M246 270v-9M251 270v-6M256 270v-11" stroke="#4FD18B" stroke-width="2"/></g></g>
<g class="up" data-up="eletro"><g><circle cx="453" cy="268" r="8" fill="#27A168"/><path d="M449 268l3 3 5-6" stroke="#fff" stroke-width="2" fill="none"/></g></g>
<g class="up" data-up="granel"><g><rect x="372" y="285" width="10" height="13" rx="2" fill="#F5A524"/><rect x="385" y="283" width="10" height="15" rx="2" fill="#27A168"/><rect x="398" y="285" width="10" height="13" rx="2" fill="#7A5AD8"/></g></g>
<g class="up" data-up="torneiras"><g><path d="M327 205q-4 7 0 10 4-3 0-10z" fill="#2B8BE0"/><circle cx="337" cy="196" r="5" fill="#27A168"/><path d="M335 196l2 2 3-4" stroke="#fff" stroke-width="1.5" fill="none"/></g></g>
<g class="up" data-up="isolamento"><rect x="210" y="142" width="280" height="198" rx="8" fill="none" stroke="#F0A25A" stroke-width="6" stroke-dasharray="14 6"/></g>
<g class="up" data-up="ventilacao"><g class="fluxo" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-dasharray="7 7"><path d="M194 290q10-9 20 0t20 0"/><path d="M490 282q10-9 20 0t20 0"/></g></g>

<!-- Telhado -->
${A('telhado', 'Telhado', `
  ${hit('196,152 350,70 504,152')}
  <polygon points="196,152 350,70 504,152" fill="#3E6D7C"/>
  <polygon points="196,152 350,70 504,152" fill="none" stroke="#2D5562" stroke-width="3" stroke-linejoin="round"/>
  <g class="up" data-up="telhado_verde"><g><polygon points="350,68 192,152 208,162 350,86" fill="#3FA566"/><g fill="#2F8A55"><circle cx="230" cy="140" r="6"/><circle cx="268" cy="120" r="6"/><circle cx="306" cy="100" r="6"/><circle cx="332" cy="86" r="5"/></g><circle cx="248" cy="132" r="3" fill="#E56A8A"/><circle cx="290" cy="108" r="3" fill="#F5C451"/></g></g>
  <g class="up" data-up="solar"><g transform="translate(352 74) rotate(28)"><rect x="14" y="6" width="52" height="24" rx="2" fill="#1E4E8C" stroke="#9CC4EE" stroke-width="2"/><path d="M40 6v24M14 18h52" stroke="#9CC4EE" stroke-width="1.5"/>
    <rect x="72" y="6" width="52" height="24" rx="2" fill="#1E4E8C" stroke="#9CC4EE" stroke-width="2"/><path d="M98 6v24M72 18h52" stroke="#9CC4EE" stroke-width="1.5"/></g></g>
  ${B('telhado', 350, 118, '☀️')}`)}

<!-- ÁREAS INTERNAS -->
${A('banheiro', 'Banheiro', `${hit('220,150 348,150 348,238 220,238')}${B('banheiro', 240, 176, '🚿')}`)}
${A('sala', 'Sala', `${hit('220,240 348,240 348,332 220,332')}${B('sala', 242, 268, '🛋️')}`)}
${A('cozinha', 'Cozinha', `${hit('352,240 482,240 482,332 352,332')}${B('cozinha', 372, 268, '🍳')}`)}

<!-- GARAGEM -->
${A('garagem', 'Garagem', `
  ${hit('480,236 618,236 618,332 480,332')}
  <polygon points="476,264 547,234 618,264" fill="#6E8791"/>
  <rect x="484" y="262" width="126" height="68" fill="#E4EBEA" stroke="#C3D1D3" stroke-width="2"/>
  <rect x="492" y="272" width="110" height="58" fill="#CBD7D9"/>
  <g class="carro"><rect x="496" y="306" width="66" height="22" rx="8" fill="#8B98A3"/><path d="M508 306l8-14h26l8 14z" fill="#A9B6BF"/><circle cx="512" cy="330" r="7" fill="#2C3A40"/><circle cx="548" cy="330" r="7" fill="#2C3A40"/><circle cx="490" cy="326" r="4" fill="#9AA5A5" opacity=".6"/><circle cx="484" cy="320" r="3" fill="#9AA5A5" opacity=".4"/></g>
  <g class="up" data-up="bicicletario"><g><rect x="568" y="296" width="36" height="34" rx="3" fill="none" stroke="#2D5562" stroke-width="2"/><circle cx="575" cy="322" r="6" fill="none" stroke="#27A168" stroke-width="2"/><circle cx="593" cy="322" r="6" fill="none" stroke="#27A168" stroke-width="2"/><path d="M575 322l6-10h8l4 10M581 312l-2-4" stroke="#27A168" stroke-width="2" fill="none"/></g></g>
  ${B('garagem', 498, 280, '🚲')}`)}

<!-- RECICLAGEM -->
${A('reciclagem', 'Área de reciclagem', `
  ${hit('620,270 750,270 750,418 620,418')}
  <rect x="620" y="330" width="130" height="8" fill="#C9D3D3"/>
  <g class="base-bin"><rect x="706" y="298" width="26" height="34" rx="4" fill="#7C8A8E"/><rect x="703" y="294" width="32" height="7" rx="3" fill="#657276"/></g>
  <g class="up" data-up="coleta"><g><rect x="672" y="300" width="16" height="32" rx="3" fill="#2B8BE0"/><rect x="691" y="300" width="16" height="32" rx="3" fill="#D9482B"/><rect x="710" y="300" width="16" height="32" rx="3" fill="#27A168"/><rect x="729" y="300" width="16" height="32" rx="3" fill="#F2C14E"/></g></g>
  <g class="up" data-up="compostagem"><g><rect x="628" y="298" width="36" height="34" rx="4" fill="#7A5230"/><rect x="624" y="292" width="44" height="9" rx="3" fill="#5E3E24"/><path d="M646 288q-4-8 2-12 4 6-2 12z" fill="#3FA566"/></g></g>
  <text x="688" y="286" text-anchor="middle" font-size="18">♻️</text>
  ${B('reciclagem', 636, 284, '♻️')}`)}
</svg>`;
}
