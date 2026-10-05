/* =====================================================================
   ECOCASA — DADOS (fácil de editar)
   Para adicionar conteúdo, copie um item existente e altere os valores.
   Todos os números de efeito são VALORES FICTÍCIOS DO JOGO.
   ===================================================================== */
'use strict';

const INDS = ['energia', 'agua', 'residuos', 'natureza', 'conforto'];

const META = {
  ecoCoins: { ic: '💰', nome: 'EcoCoins' },
  energia:  { ic: '⚡', nome: 'Energia' },
  agua:     { ic: '💧', nome: 'Água' },
  residuos: { ic: '♻️', nome: 'Resíduos' },
  natureza: { ic: '🌱', nome: 'Natureza' },
  conforto: { ic: '😊', nome: 'Conforto' }
};

/* Faixas qualitativas (0-19, 20-39, 40-59, 60-79, 80-100) */
const FAIXAS = {
  energia:  ['Desperdício energético', 'Baixa eficiência', 'Eficiência moderada', 'Boa eficiência', 'Alta eficiência'],
  agua:     ['Alto desperdício', 'Uso pouco eficiente', 'Uso moderado', 'Boa gestão hídrica', 'Excelente gestão hídrica'],
  residuos: ['Grande geração de resíduos', 'Gestão insuficiente', 'Gestão moderada', 'Boa gestão', 'Gestão exemplar'],
  natureza: ['Alto impacto ambiental', 'Baixa integração ambiental', 'Integração moderada', 'Boa integração', 'Excelente integração'],
  conforto: ['Ambiente inadequado', 'Baixo conforto', 'Conforto aceitável', 'Ambiente confortável', 'Excelente qualidade']
};
const FAIXA_ICONES = ['🔴', '🟠', '🟡', '🟢', '🌟'];

const CRISE_NOMES = {
  energia: 'CRISE ENERGÉTICA', agua: 'CRISE HÍDRICA', residuos: 'CRISE DE RESÍDUOS',
  natureza: 'DEGRADAÇÃO AMBIENTAL', conforto: 'QUALIDADE DE VIDA BAIXA'
};

/* Classificação geral (índice de sustentabilidade 0-100) */
const CLASSES = [
  { min: 0,  ic: '🏚️', nome: 'CASA CONVENCIONAL',     desc: 'A casa ainda apresenta muitos problemas ambientais.' },
  { min: 30, ic: '🔧', nome: 'CASA EM TRANSFORMAÇÃO', desc: 'Você começou a implementar melhorias.' },
  { min: 45, ic: '🌱', nome: 'CASA CONSCIENTE',       desc: 'Já existem boas práticas sustentáveis.' },
  { min: 60, ic: '♻️', nome: 'CASA EFICIENTE',        desc: 'Bom equilíbrio entre consumo e sustentabilidade.' },
  { min: 75, ic: '🌿', nome: 'CASA SUSTENTÁVEL',      desc: 'A maioria dos sistemas funciona de maneira eficiente.' },
  { min: 90, ic: '🌎', nome: 'CASA DO FUTURO',        desc: 'A casa atingiu excelente desempenho geral.' }
];

/* Áreas da casa. "libera" = rodada em que a área é liberada */
const AREAS = [
  { id: 'sala',       ic: '🛋️', nome: 'Sala',               libera: 1, desc: 'Iluminação, conforto e eletricidade.' },
  { id: 'cozinha',    ic: '🍳', nome: 'Cozinha',            libera: 1, desc: 'Consumo, resíduos e alimentação.' },
  { id: 'telhado',    ic: '☀️', nome: 'Telhado',            libera: 2, desc: 'Energia solar e eficiência energética.' },
  { id: 'banheiro',   ic: '🚿', nome: 'Banheiro',           libera: 3, desc: 'Consumo e reaproveitamento de água.' },
  { id: 'jardim',     ic: '🌱', nome: 'Jardim',             libera: 4, desc: 'Biodiversidade, vegetação e água.' },
  { id: 'reciclagem', ic: '♻️', nome: 'Área de reciclagem', libera: 5, desc: 'Resíduos, reciclagem e compostagem.' },
  { id: 'garagem',    ic: '🚲', nome: 'Garagem',            libera: 6, desc: 'Mobilidade sustentável.' }
];

/* Melhorias. req = ids que precisam estar instalados antes. */
const MELHORIAS = [
  { id: 'led', nome: 'Iluminação LED', ic: '💡', area: 'sala', cat: 'energia', nivel: 1, custo: 600,
    ef: { energia: 8, conforto: 3 }, req: [],
    desc: 'Troca as lâmpadas antigas por LED.',
    edu: 'LEDs produzem a mesma luz com bem menos energia e duram muito mais.' },
  { id: 'sensores', nome: 'Sensores de presença', ic: '📡', area: 'sala', cat: 'energia', nivel: 2, custo: 500,
    ef: { energia: 5 }, req: ['led'],
    desc: 'Luz só acende quando há gente no ambiente.',
    edu: 'Sensores evitam luzes esquecidas acesas, um desperdício comum.' },
  { id: 'ventilacao', nome: 'Ventilação natural', ic: '🪟', area: 'sala', cat: 'conforto', nivel: 1, custo: 900,
    ef: { conforto: 8, energia: 5 }, req: [],
    desc: 'Aberturas que criam ventilação cruzada.',
    edu: 'Ar circulando entre janelas em lados diferentes renova o ambiente sem gastar energia.' },
  { id: 'isolamento', nome: 'Isolamento térmico', ic: '🧱', area: 'sala', cat: 'conforto', nivel: 2, custo: 2000,
    ef: { energia: 6, conforto: 12 }, req: [],
    desc: 'Reduz a troca de calor com o exterior.',
    edu: 'Isolar a casa ajuda tanto no calor quanto no frio e reduz o uso de climatização.' },
  { id: 'solar', nome: 'Painéis solares', ic: '☀️', area: 'telhado', cat: 'energia', nivel: 2, custo: 4000,
    ef: { energia: 25, natureza: 6 }, req: [],
    desc: 'Geram eletricidade a partir da luz do sol.',
    edu: 'Painéis fotovoltaicos transformam luz solar em eletricidade. Funcionam melhor em casas já eficientes.' },
  { id: 'smart', nome: 'Sistema inteligente de energia', ic: '🧠', area: 'telhado', cat: 'energia', nivel: 3, custo: 2500,
    ef: { energia: 12, conforto: 4 }, req: ['sensores', 'solar'],
    desc: 'Monitora e ajusta o consumo da casa.',
    edu: 'Monitorar o consumo ajuda a achar desperdícios e a usar melhor a energia que a casa gera.' },
  { id: 'telhado_verde', nome: 'Telhado verde', ic: '🌿', area: 'telhado', cat: 'natureza', nivel: 3, custo: 3000,
    ef: { natureza: 14, conforto: 6, agua: 4, energia: 4 }, req: ['nativas'],
    desc: 'Cobertura vegetal sobre o telhado.',
    edu: 'A camada de plantas ajuda no conforto térmico e retém parte da água da chuva.' },
  { id: 'eletro', nome: 'Eletrodomésticos eficientes', ic: '🧊', area: 'cozinha', cat: 'energia', nivel: 1, custo: 1500,
    ef: { energia: 8, agua: 3 }, req: [],
    desc: 'Geladeira e máquinas de alta eficiência.',
    edu: 'Aparelhos com selo de eficiência fazem o mesmo trabalho gastando menos.' },
  { id: 'granel', nome: 'Cozinha sem desperdício', ic: '🫙', area: 'cozinha', cat: 'residuos', nivel: 1, custo: 700,
    ef: { residuos: 10, natureza: 2 }, req: [],
    desc: 'Compras a granel, potes e reaproveitamento.',
    edu: 'Comprar só o necessário e reutilizar potes reduz embalagens e sobras.' },
  { id: 'torneiras', nome: 'Torneiras econômicas', ic: '🚰', area: 'banheiro', cat: 'agua', nivel: 1, custo: 700,
    ef: { agua: 10 }, req: [],
    desc: 'Arejadores que reduzem a vazão.',
    edu: 'Arejadores misturam ar ao jato e economizam água sem perder a sensação de pressão.' },
  { id: 'reuso', nome: 'Reúso de água cinza', ic: '🔁', area: 'banheiro', cat: 'agua', nivel: 2, custo: 2200,
    ef: { agua: 15 }, req: ['chuva'],
    desc: 'Reaproveita água de chuveiro e lavatório.',
    edu: 'Depois de tratada, a água cinza pode abastecer descargas e a rega.' },
  { id: 'avancado', nome: 'Sistema hídrico avançado', ic: '🧪', area: 'banheiro', cat: 'agua', nivel: 3, custo: 2800,
    ef: { agua: 14, energia: 2 }, req: ['reuso'],
    desc: 'Filtragem e gestão integrada da água.',
    edu: 'Integrar chuva, reúso e filtragem fecha o ciclo da água dentro da casa.' },
  { id: 'chuva', nome: 'Captação de água da chuva', ic: '🌧️', area: 'jardim', cat: 'agua', nivel: 1, custo: 2500,
    ef: { agua: 18, natureza: 3 }, req: [],
    desc: 'Cisterna que guarda a chuva do telhado.',
    edu: 'A chuva captada serve para rega e limpeza, poupando água potável.' },
  { id: 'nativas', nome: 'Jardim de espécies nativas', ic: '🌳', area: 'jardim', cat: 'natureza', nivel: 1, custo: 1000,
    ef: { natureza: 14, agua: 3 }, req: [],
    desc: 'Plantas da região que atraem a fauna local.',
    edu: 'Espécies nativas costumam precisar de menos água e dão abrigo e comida à fauna local.' },
  { id: 'horta', nome: 'Horta', ic: '🥕', area: 'jardim', cat: 'natureza', nivel: 1, custo: 800,
    ef: { natureza: 6, residuos: 4, conforto: 2 }, req: [],
    desc: 'Canteiros com alimentos frescos.',
    edu: 'Uma horta traz alimento fresco, menos embalagens e um destino útil para o adubo.' },
  { id: 'compostagem', nome: 'Compostagem', ic: '🪱', area: 'reciclagem', cat: 'residuos', nivel: 1, custo: 500,
    ef: { residuos: 12, natureza: 3 }, req: [],
    desc: 'Transforma restos orgânicos em adubo.',
    edu: 'Cascas e restos de alimentos viram composto rico em nutrientes, em vez de lixo.' },
  { id: 'coleta', nome: 'Estação de coleta seletiva', ic: '🗑️', area: 'reciclagem', cat: 'residuos', nivel: 1, custo: 600,
    ef: { residuos: 10 }, req: [],
    desc: 'Lixeiras separadas por tipo de material.',
    edu: 'Separar papel, plástico, metal e vidro permite que mais material volte à indústria.' },
  { id: 'bicicletario', nome: 'Bicicletário', ic: '🚲', area: 'garagem', cat: 'natureza', nivel: 1, custo: 800,
    ef: { natureza: 5, conforto: 2 }, req: [],
    desc: 'Espaço seguro para bicicletas.',
    edu: 'Facilitar a bicicleta em trajetos curtos reduz emissões e melhora a saúde.' }
];

/* Sinergias: bônus único quando todas as melhorias do combo estão instaladas */
const SINERGIAS = [
  { id: 'casa_inteligente', ic: '⚡', nome: 'Casa energeticamente inteligente', req: ['solar', 'led'], ef: { energia: 5 } },
  { id: 'ciclo_agua', ic: '💧', nome: 'Ciclo inteligente da água', req: ['chuva', 'nativas'], ef: { agua: 5, natureza: 5 } },
  { id: 'ciclo_nutrientes', ic: '🌱', nome: 'Ciclo de nutrientes', req: ['compostagem', 'horta'], ef: { residuos: 5, natureza: 5 } },
  { id: 'conforto_eficiente', ic: '😊', nome: 'Conforto eficiente', req: ['isolamento', 'ventilacao'], ef: { energia: 4, conforto: 5 } },
  { id: 'telhado_vivo', ic: '🌿', nome: 'Telhado vivo', req: ['telhado_verde', 'chuva'], ef: { agua: 4, natureza: 3 } },
  { id: 'rega_reuso', ic: '🔁', nome: 'Rega com água de reúso', req: ['reuso', 'nativas'], ef: { agua: 3, natureza: 3 } }
];

/* Eventos. bonus: { se:[ids obrigatórios], minUp:n, ef:{}, msg:'' }.
   dur = nº de rodadas em que o efeito se repete. */
const EVENTOS = [
  { id: 'onda_calor', ic: '🔥', t: 'ONDA DE CALOR', tom: 'ruim', dur: 2,
    txt: 'Dias seguidos de calor intenso. A casa esquenta e o consumo sobe.',
    base: { energia: -5, conforto: -8 },
    bonus: [
      { se: ['isolamento'], ef: { energia: 3, conforto: 4 }, msg: 'O isolamento térmico segura o calor lá fora: penalidade reduzida.' },
      { se: ['solar'], ef: { energia: 4 }, msg: 'Com tanto sol, seus painéis geram energia extra.' },
      { se: ['ventilacao'], ef: { conforto: 3 }, msg: 'A ventilação natural alivia o calor.' },
      { se: ['telhado_verde'], ef: { conforto: 3 }, msg: 'O telhado verde mantém a casa mais fresca.' }
    ], dica: 'Isolamento, ventilação e telhado verde ajudam a enfrentar o calor.' },
  { id: 'chuvas', ic: '🌧️', t: 'SEMANA DE CHUVAS', tom: 'neutro', dur: 1,
    txt: 'Chuva forte por vários dias seguidos.',
    base: {},
    bonus: [
      { se: ['chuva'], ef: { agua: 10 }, msg: 'Sua cisterna encheu: a água da chuva foi aproveitada.' },
      { se: ['nativas'], ef: { natureza: 3 }, msg: 'O jardim nativo agradece a chuva.' },
      { se: ['telhado_verde'], ef: { agua: 3 }, msg: 'O telhado verde reteve parte da água.' }
    ], dica: 'Sem captação, a água da chuva simplesmente escorre pelo ralo.' },
  { id: 'seca', ic: '🏜️', t: 'PERÍODO DE SECA', tom: 'ruim', dur: 2,
    txt: 'Semanas sem chuva. A água fica mais escassa.',
    base: { agua: -8 },
    bonus: [
      { se: ['reuso'], ef: { agua: 5 }, msg: 'O reúso de água cinza reduz o impacto da seca.' },
      { se: ['chuva'], ef: { agua: 3 }, msg: 'Sua cisterna ainda guarda uma reserva.' },
      { se: ['nativas'], ef: { natureza: 2 }, msg: 'Plantas nativas toleram melhor a estiagem.' }
    ], dica: 'Reúso e captação de chuva são seguros contra a seca.' },
  { id: 'tarifa', ic: '💡', t: 'AUMENTO DA TARIFA DE ENERGIA', tom: 'ruim', dur: 2,
    txt: 'A energia ficou mais cara e as contas pesam no orçamento.',
    base: { ecoCoins: -300 },
    bonus: [
      { se: ['solar'], ef: { ecoCoins: 250 }, msg: 'Energia solar protege parcialmente do aumento.' },
      { se: ['smart'], ef: { ecoCoins: 100 }, msg: 'O sistema inteligente evita picos de consumo.' },
      { se: ['led'], ef: { ecoCoins: 50 }, msg: 'LEDs gastam pouco: a conta sobe menos.' }
    ], dica: 'Gerar a própria energia protege do aumento de tarifas.' },
  { id: 'camp_reciclagem', ic: '♻️', t: 'CAMPANHA MUNICIPAL DE RECICLAGEM', tom: 'bom', dur: 1,
    txt: 'A prefeitura promove uma campanha de coleta seletiva no bairro.',
    base: { residuos: 4 },
    bonus: [
      { se: ['coleta'], ef: { residuos: 4 }, msg: 'Sua estação de coleta seletiva aproveita a campanha.' },
      { se: ['compostagem'], ef: { residuos: 3 }, msg: 'Sua composteira já trata os orgânicos.' }
    ], dica: 'Estrutura de coleta seletiva multiplica o efeito da campanha.' },
  { id: 'feira_mudas', ic: '🌱', t: 'FEIRA DE MUDAS', tom: 'bom', dur: 1,
    txt: 'Uma feira no bairro distribui mudas de espécies da região.',
    base: { natureza: 3 },
    bonus: [
      { se: ['nativas'], ef: { natureza: 4 }, msg: 'Seu jardim nativo ganha novas espécies.' },
      { se: ['horta'], ef: { natureza: 2, ecoCoins: 100 }, msg: 'Mudas para a horta, sem custo.' }
    ], dica: 'Quem já tem jardim aproveita melhor as mudas.' },
  { id: 'falha', ic: '🔧', t: 'FALHA EM UM EQUIPAMENTO', tom: 'ruim', dur: 1,
    txt: 'Um aparelho antigo queimou e o conserto saiu caro.',
    base: { energia: -6, ecoCoins: -400 },
    bonus: [
      { se: ['eletro'], ef: { ecoCoins: 250, energia: 3 }, msg: 'Equipamentos novos e eficientes dão menos problemas.' },
      { se: ['smart'], ef: { energia: 3 }, msg: 'O monitoramento detectou a falha cedo.' }
    ], dica: 'Equipamentos eficientes e monitorados falham menos.' },
  { id: 'desconto', ic: '💰', t: 'DESCONTO EM EQUIPAMENTOS', tom: 'bom', dur: 1,
    txt: 'Promoção relâmpago: a próxima melhoria que você instalar sai com 25% de desconto.',
    base: {}, extra: { desconto: 0.25 }, bonus: [], dica: 'Guarde EcoCoins para aproveitar a oferta.' },
  { id: 'mobilidade', ic: '🚲', t: 'SEMANA DA MOBILIDADE', tom: 'bom', dur: 1,
    txt: 'O bairro incentiva bicicletas e caronas.',
    base: { natureza: 3, conforto: 1 },
    bonus: [{ se: ['bicicletario'], ef: { natureza: 4, ecoCoins: 200 }, msg: 'Seu bicicletário rende economia de combustível.' }],
    dica: 'Um bicicletário transforma incentivo em hábito.' },
  { id: 'feira_prod', ic: '🍅', t: 'FEIRA DE PRODUTORES LOCAIS', tom: 'bom', dur: 1,
    txt: 'Produtores da região vendem alimentos frescos com pouca embalagem.',
    base: { residuos: 2 },
    bonus: [
      { se: ['horta'], ef: { residuos: 3, ecoCoins: 200 }, msg: 'Você troca o excedente da horta na feira.' },
      { se: ['compostagem'], ef: { natureza: 2 }, msg: 'Seus restos viram adubo para os produtores.' }
    ], dica: 'Horta e compostagem combinam com a feira.' },
  { id: 'frio', ic: '❄️', t: 'FRENTE FRIA INTENSA', tom: 'ruim', dur: 1,
    txt: 'Temperaturas despencam por alguns dias.',
    base: { conforto: -6, energia: -3 },
    bonus: [{ se: ['isolamento'], ef: { conforto: 4, energia: 2 }, msg: 'O isolamento também segura o calor dentro de casa.' }],
    dica: 'Isolamento térmico ajuda no frio também.' },
  { id: 'oficina_ef', ic: '🛠️', t: 'OFICINA DE EFICIÊNCIA NO BAIRRO', tom: 'bom', dur: 1,
    txt: 'Voluntários ensinam a achar desperdícios de energia e água.',
    base: { energia: 3, agua: 2 }, bonus: [], dica: '' },
  { id: 'mutirao', ic: '🧹', t: 'MUTIRÃO DE LIMPEZA DO BAIRRO', tom: 'bom', dur: 1,
    txt: 'A vizinhança se reúne para limpar e plantar.',
    base: { residuos: 3, natureza: 2 },
    bonus: [{ se: ['coleta'], ef: { residuos: 2 }, msg: 'Você já sabe separar bem os materiais.' }], dica: '' },
  { id: 'exemplo', ic: '🏘️', t: 'SUA CASA VIRA EXEMPLO', tom: 'bom', dur: 1,
    txt: 'Os vizinhos notaram as mudanças e querem aprender com você.',
    base: {},
    bonus: [{ minUp: 3, ef: { ecoCoins: 300, natureza: 2 }, msg: 'Com 3 ou mais melhorias, você ganha reconhecimento e apoio.' }],
    dica: 'Instale pelo menos 3 melhorias para virar exemplo.' },
  { id: 'praga', ic: '🐛', t: 'PRAGAS NO JARDIM', tom: 'ruim', dur: 1,
    txt: 'Insetos atacam as plantas.',
    base: { natureza: -4 },
    bonus: [{ se: ['nativas'], ef: { natureza: 3 }, msg: 'Um jardim diverso mantém predadores naturais das pragas.' }],
    dica: 'Diversidade de plantas deixa o jardim mais resistente.' },
  { id: 'agua_cara', ic: '🚰', t: 'ALTA NO PREÇO DA ÁGUA', tom: 'ruim', dur: 1,
    txt: 'A conta de água aumentou.',
    base: { ecoCoins: -250 },
    bonus: [
      { se: ['torneiras'], ef: { ecoCoins: 100 }, msg: 'Torneiras econômicas aliviam a conta.' },
      { se: ['reuso'], ef: { ecoCoins: 150 }, msg: 'O reúso reduz a água comprada.' },
      { se: ['chuva'], ef: { ecoCoins: 150 }, msg: 'A água da chuva reduz o consumo da rede.' }
    ], dica: 'Economizar água também economiza dinheiro.' },
  { id: 'combustivel', ic: '⛽', t: 'ALTA DO COMBUSTÍVEL', tom: 'ruim', dur: 1,
    txt: 'O custo de se deslocar de carro subiu.',
    base: { ecoCoins: -300 },
    bonus: [{ se: ['bicicletario'], ef: { ecoCoins: 250 }, msg: 'Pedalar em trajetos curtos compensa o gasto.' }],
    dica: 'Alternativas de mobilidade protegem o orçamento.' },
  { id: 'queimadas', ic: '🌫️', t: 'AR SECO E FUMAÇA NA REGIÃO', tom: 'ruim', dur: 2,
    txt: 'Queimadas distantes deixam o ar seco e pesado.',
    base: { conforto: -4 },
    bonus: [{ se: ['nativas'], ef: { conforto: 2 }, msg: 'Vegetação ajuda a amenizar o ar seco ao redor.' }],
    dica: '' },
  { id: 'sol_a_pino', ic: '☀️', t: 'SOL A PINO', tom: 'bom', dur: 1,
    txt: 'Uma semana de muito sol. Casas com energia solar recebem um bônus.',
    base: {},
    bonus: [{ se: ['solar'], ef: { energia: 8, ecoCoins: 300 }, msg: 'Seus painéis aproveitaram cada raio de sol.' }],
    dica: 'Sem painéis solares, toda essa energia passa batido.' },
  { id: 'oficina_bio', ic: '🏗️', t: 'OFICINA DE ARQUITETURA BIOCLIMÁTICA', tom: 'bom', dur: 1,
    txt: 'Você aprende a aproveitar sol, vento e sombra no projeto da casa.',
    base: { conforto: 3, energia: 2 }, bonus: [], dica: '' },
  { id: 'tempestade', ic: '⛈️', t: 'TEMPESTADE FORTE', tom: 'ruim', dur: 1,
    txt: 'Ventos e chuva forte causam pequenos estragos.',
    base: { ecoCoins: -200 },
    bonus: [
      { se: ['chuva'], ef: { agua: 6 }, msg: 'Sua cisterna aproveitou parte da tempestade.' },
      { se: ['telhado_verde'], ef: { ecoCoins: 150 }, msg: 'O telhado verde amorteceu o impacto da chuva.' }
    ], dica: '' },
  { id: 'doacao_minhocas', ic: '🪱', t: 'DOAÇÃO DE MINHOCAS', tom: 'bom', dur: 1,
    txt: 'Um vizinho doa minhocas para quem faz compostagem.',
    base: { residuos: 2 },
    bonus: [{ se: ['compostagem'], ef: { residuos: 5 }, msg: 'Sua composteira ganha minhocas e acelera o processo.' }],
    dica: 'Quem tem composteira aproveita melhor a doação.' }
];

/* Conquistas. check(G) roda após cada ação; final:true só ao encerrar. */
const CONQUISTAS = [
  { id: 'primeira_placa', ic: '☀️', nome: 'PRIMEIRA PLACA', desc: 'Instale energia solar.', check: G => G.melhorias.includes('solar') },
  { id: 'guardiao_agua', ic: '💧', nome: 'GUARDIÃO DA ÁGUA', desc: 'Alcance 80 pontos de eficiência hídrica.', check: G => G.agua >= 80 },
  { id: 'lixo_zero', ic: '♻️', nome: 'LIXO ZERO', desc: 'Atinja 80 pontos em resíduos.', check: G => G.residuos >= 80 },
  { id: 'casa_verde', ic: '🌱', nome: 'CASA VERDE', desc: 'Alcance 80 pontos de natureza.', check: G => G.natureza >= 80 },
  { id: 'energia_inteligente', ic: '⚡', nome: 'ENERGIA INTELIGENTE', desc: 'Alcance 90 pontos de eficiência energética.', check: G => G.energia >= 90 },
  { id: 'casa_futuro', ic: '🏠', nome: 'CASA DO FUTURO', desc: 'Alcance pelo menos 85 pontos gerais.', check: G => calcSust(G) >= 85 },
  { id: 'investidor', ic: '💰', nome: 'INVESTIDOR CONSCIENTE', desc: 'Termine com ótima sustentabilidade sem gastar excessivamente.', final: true,
    check: G => calcSust(G) >= 60 && G.gastoTotal <= 15000 },
  { id: 'sabio', ic: '🎓', nome: 'SÁBIO DA SUSTENTABILIDADE', desc: 'Acerte todas as perguntas de conhecimento.', final: true,
    check: G => G.tentativas >= 5 && G.acertos === G.tentativas },
  { id: 'ciclo', ic: '🔄', nome: 'CICLO FECHADO', desc: 'Ative o combo "Ciclo inteligente da água".', check: G => G.sinergias.includes('ciclo_agua') },
  { id: 'sinergista', ic: '🧩', nome: 'MESTRE DAS COMBINAÇÕES', desc: 'Ative 3 combos de melhorias.', check: G => G.sinergias.length >= 3 },
  { id: 'equilibrista', ic: '⚖️', nome: 'EQUILIBRISTA', desc: 'Deixe todos os indicadores em 60 ou mais ao mesmo tempo.', check: G => INDS.every(k => G[k] >= 60) },
  { id: 'colecionador', ic: '🛠️', nome: 'COLECIONADOR', desc: 'Instale 10 melhorias.', check: G => G.melhorias.length >= 10 },
  { id: 'resgate', ic: '🛟', nome: 'RESGATE', desc: 'Saia de uma crise e chegue a 30 pontos.', secreta: true,
    check: G => Object.keys(G.crisesHist).some(k => G[k] >= 30) },
  { id: 'fresquinho', ic: '🧊', nome: 'FRESQUINHO', desc: 'Enfrente uma onda de calor com a casa preparada.', secreta: true, check: G => !!G.flags.calorOk },
  { id: 'sem_atalhos', ic: '🧭', nome: 'SEM ATALHOS', desc: 'Termine sem nunca ignorar um problema.', secreta: true, final: true,
    check: G => Object.keys(G.ignorados).length === 0 && G.historicoDecisoes.length >= 5 },
  { id: 'jardineiro', ic: '🧑‍🌾', nome: 'JARDINEIRO COMPLETO', desc: 'Tenha jardim nativo, horta e compostagem.', secreta: true,
    check: G => ['nativas', 'horta', 'compostagem'].every(i => G.melhorias.includes(i)) },
  { id: 'cofrinho', ic: '🐷', nome: 'COFRINHO CHEIO', desc: 'Dinheiro parado não melhora a casa... mas vale uma risada.', secreta: true, final: true, semPontos: true,
    check: G => G.ecoCoins >= 9000 }
];

/* Opções da decisão final (alvo = indicador que a opção reforça) */
const FINAL_OPCOES = [
  { t: 'Ampliar a geração de energia com baterias', ic: '🔋', alvo: 'energia', c: 4500, ef: { energia: 14, natureza: 2 },
    txt: 'Armazenar energia solar aumenta o aproveitamento do que a casa gera.' },
  { t: 'Parque hídrico: cisterna ampliada e filtragem', ic: '🌊', alvo: 'agua', c: 3800, ef: { agua: 15, natureza: 3 },
    txt: 'Guardar, tratar e reaproveitar a água deixa a casa mais resiliente a secas.' },
  { t: 'Floresta de bolso: árvores e corredor de biodiversidade', ic: '🌳', alvo: 'natureza', c: 3000, ef: { natureza: 16, conforto: 3, agua: 3 },
    txt: 'Árvores e vegetação diversa trazem sombra, abrigo para a fauna e infiltração de água.' },
  { t: 'Centro de reciclagem e compostagem avançado', ic: '♻️', alvo: 'residuos', c: 4000, ef: { residuos: 16, natureza: 3 },
    txt: 'Tratar bem cada tipo de resíduo reduz o que chega ao aterro.' },
  { t: 'Reforma bioclimática: luz, sombra e ventilação', ic: '🏗️', alvo: 'conforto', c: 3500, ef: { conforto: 13, energia: 6 },
    txt: 'Projetar com sol, vento e sombra melhora o conforto gastando menos energia.' },
  { t: 'Bairro sustentável: dividir o que aprendeu', ic: '🤝', alvo: 'equilibrio', c: 2500, ef: { energia: 4, agua: 4, residuos: 4, natureza: 4 },
    txt: 'Compartilhar conhecimento melhora um pouco de tudo e fortalece a comunidade.' }
];

/* Plano das rodadas. "quiz:N" = pergunta de nível até N; "decisao:N" = decisão de nível N; "invest:N" = N obras */
const PLANO = {
  1: ['quiz:1', 'quiz:1'],
  2: ['invest:3'],
  3: ['decisao:1'],
  4: ['quiz:2', 'quiz:2'],
  5: ['decisao:2'],
  6: ['invest:3'],
  7: ['quiz:2', 'decisao:2'],
  8: ['quiz:3', 'decisao:3'],
  9: ['decisao:3', 'invest:2'],
  10: ['final']
};
const TEMAS = {
  1: ['Primeiros passos', 'Conhecimento vira economia: acerte e ganhe EcoCoins e pontos.'],
  2: ['Hora de investir', 'Você pode fazer até 3 obras. Pense no que a casa mais precisa.'],
  3: ['Primeira decisão', 'Cada escolha tem custo e consequência.'],
  4: ['Desafio de conhecimento', 'Duas perguntas um pouco mais difíceis.'],
  5: ['Decisão estratégica', 'Agora o orçamento começa a pesar.'],
  6: ['Novo ciclo de obras', 'Novas áreas liberadas. Procure combinações que se complementam.'],
  7: ['Teoria e prática', 'Uma pergunta e uma decisão na mesma rodada.'],
  8: ['Conflito de indicadores', 'Melhorar uma coisa pode custar outra.'],
  9: ['Reta final', 'Uma decisão difícil e as últimas obras.'],
  10: ['Decisão final', 'A última grande melhoria define o futuro da casa.']
};
