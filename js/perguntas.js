/* =====================================================================
   ECOCASA — PERGUNTAS, DECISÕES E CRISES
   Q(nivel, indicador, pergunta, respostaCerta, [3 erradas], explicação)
   O(texto, custo, efeitos, qualidade0a100, explicação, extras)
   ===================================================================== */
'use strict';

const Q = (nivel, ind, txt, ok, erradas, expl) => ({ nivel, ind, txt, ok, erradas, expl });

const PERGUNTAS = [
  // ---- ENERGIA
  Q(1, 'energia', 'Você vai trocar as lâmpadas incandescentes da casa. Qual troca entrega luz equivalente gastando bem menos energia?',
    'Lâmpadas LED', ['Lâmpadas halógenas de maior potência', 'Lâmpadas incandescentes "coloridas"', 'Lâmpadas incandescentes de vidro fosco'],
    'LEDs produzem luz equivalente com muito menos energia e duram bem mais, o que também gera menos lixo.'),
  Q(1, 'energia', 'Num dia nublado, o que costuma acontecer com um painel solar fotovoltaico?',
    'Continua gerando energia, mas bem menos', ['Para totalmente de funcionar', 'Gera mais energia do que num dia de sol forte', 'Passa a gerar energia só durante a noite'],
    'Painéis aproveitam a luz do dia, inclusive a difusa. Com nuvens a geração cai, mas não zera.'),
  Q(1, 'energia', 'Aparelhos em stand-by (aquela luzinha acesa) fazem o quê com a conta de luz?',
    'Seguem consumindo uma pequena quantidade de energia o tempo todo', ['Não consomem nada', 'Consomem mais do que quando estão ligados', 'Só consomem se estiverem conectados à internet'],
    'Cada aparelho gasta pouco, mas a soma de vários, 24 horas por dia, pesa na conta. Réguas com interruptor ajudam.'),
  Q(2, 'energia', 'No Brasil, o selo Procel em um eletrodoméstico indica que ele...',
    'Está entre os mais eficientes da sua categoria', ['Foi fabricado só com material reciclado', 'Dispensa ligação na tomada', 'Tem garantia vitalícia'],
    'O Selo Procel destaca produtos com melhor desempenho energético dentro da sua categoria.'),
  Q(2, 'energia', 'Como um aerogerador (turbina eólica) produz eletricidade?',
    'O vento gira as pás, que acionam um gerador', ['Queima biomassa dentro da torre', 'As pás captam a luz do sol como um painel', 'Usa o calor do solo para girar'],
    'A energia do vento vira movimento nas pás e, no gerador, eletricidade.'),
  Q(2, 'energia', 'Em muitas casas brasileiras, o chuveiro elétrico está entre os maiores consumidores de energia. O que reduz esse consumo?',
    'Aquecimento solar da água', ['Lâmpadas mais potentes', 'Instalar mais tomadas no banheiro', 'Usar sempre a posição "inverno"'],
    'Aquecedores solares usam o sol para esquentar a água, diminuindo o uso de eletricidade para esse fim.'),
  Q(3, 'energia', 'Qual cuidado ajuda uma geladeira a gastar menos?',
    'Manter a borracha de vedação em bom estado e longe de fontes de calor', ['Encostá-la no fogão para a comida esfriar mais rápido', 'Forrar as prateleiras com plástico', 'Deixar a porta entreaberta para o motor descansar'],
    'Vedação ruim e calor externo obrigam o motor a trabalhar mais, e forrar prateleiras atrapalha a circulação do ar frio.'),
  Q(3, 'energia', 'Orçamento para uma só intervenção. A casa tem jardim e horta, mas lâmpadas antigas e geladeira velha. O que costuma dar retorno mais rápido?',
    'Trocar iluminação e geladeira por modelos eficientes', ['Ampliar o jardim', 'Comprar uma turbina eólica de grande porte', 'Cimentar a calçada'],
    'Atacar o maior desperdício primeiro costuma dar o retorno mais rápido. Sustentabilidade também é priorizar.'),
  Q(3, 'energia', 'Em áreas urbanas com pouco vento, o que costuma acontecer com pequenas turbinas eólicas residenciais?',
    'Rendem pouco por causa da turbulência e do vento fraco', ['Superam sempre os painéis solares', 'Funcionam melhor entre prédios altos', 'Geram energia apenas em dias sem vento'],
    'Por isso é importante medir o vento e planejar antes de investir.'),
  // ---- ÁGUA
  Q(1, 'agua', 'A água da chuva captada do telhado, sem tratamento adequado, é mais apropriada para...',
    'Regar plantas e lavar áreas externas', ['Beber', 'Preparar mamadeiras', 'Cozinhar alimentos'],
    'Sem tratamento específico, ela deve ser usada em fins não potáveis, como rega e limpeza.'),
  Q(1, 'agua', 'O que faz um arejador instalado na torneira?',
    'Mistura ar ao jato, reduzindo a vazão sem perder muito a sensação de pressão', ['Aquece a água sem gastar energia', 'Filtra a água para beber', 'Aumenta a vazão para encher baldes mais rápido'],
    'Com menos água por minuto e a mesma sensação de uso, a economia vem sem esforço.'),
  Q(1, 'agua', 'Na hora de lavar a louça, qual método tende a gastar menos água?',
    'Ensaboar tudo com a torneira fechada e enxaguar depois', ['Manter a torneira aberta o tempo todo', 'Enxaguar peça por peça em água corrente', 'Deixar a torneira correndo "só um fiozinho"'],
    'O desperdício vem do tempo com a torneira aberta, mesmo que seja um fio.'),
  Q(2, 'agua', 'Qual vaso sanitário costuma economizar mais água?',
    'O de caixa acoplada com duplo acionamento', ['O de válvula antiga sem regulagem', 'O que tem descarga contínua', 'Qualquer vaso, o consumo é igual'],
    'Dois botões permitem usar menos água para resíduos líquidos.'),
  Q(2, 'agua', 'Qual o melhor momento do dia para regar o jardim?',
    'Início da manhã ou fim da tarde', ['Ao meio-dia, com o sol a pino', 'Só à noite, com a mangueira aberta por horas', 'Tanto faz, a evaporação é a mesma'],
    'Com temperaturas mais amenas, evapora menos água e as plantas aproveitam mais.'),
  Q(2, 'agua', 'O que é "água cinza" em uma casa?',
    'Água de chuveiro, lavatório e máquina de lavar, sem o esgoto dos vasos', ['Água muito turva de enchente', 'Água de poço profundo', 'Água que sai do vaso sanitário'],
    'Depois de tratada, pode ser reaproveitada em descargas e rega, reduzindo o consumo de água potável.'),
  Q(3, 'agua', 'Como suspeitar de um vazamento oculto na casa?',
    'Fechar todos os pontos de uso e checar se o hidrômetro continua girando', ['Esperar a conta de água cair', 'Aumentar a pressão da rede', 'Conferir se as torneiras estão brilhando'],
    'Se tudo está fechado e o hidrômetro gira, há água escapando em algum lugar.'),
  Q(3, 'agua', 'Por que pisos permeáveis ou com frestas gramadas ajudam em tempestades?',
    'Deixam a água infiltrar no solo, reduzindo enxurradas e alagamentos', ['Evaporam a chuva instantaneamente', 'Esquentam a água para uso doméstico', 'Impedem que a chuva chegue ao terreno'],
    'Superfícies que absorvem água aliviam a drenagem urbana.'),
  Q(3, 'agua', 'Sua casa já tem painéis solares, mas a conta de água está alta. Qual investimento tende a complementar melhor o sistema?',
    'Captação de chuva e torneiras econômicas', ['Mais painéis solares', 'Lâmpadas de maior potência', 'Um segundo chuveiro elétrico'],
    'Sustentabilidade é um sistema: reforce o ponto mais fraco antes de ampliar o que já funciona.'),
  Q(3, 'agua', 'Numa estiagem longa, qual combinação ajuda a manter o jardim vivo gastando menos água?',
    'Plantas nativas, cobertura do solo (mulching) e rega eficiente', ['Grama exótica e rega diária ao meio-dia', 'Cimentar os canteiros', 'Regar apenas as folhas'],
    'Plantas adaptadas e solo coberto perdem menos água por evaporação.'),
  // ---- RESÍDUOS
  Q(1, 'residuos', 'O que pode ir para uma composteira doméstica?',
    'Cascas de frutas e legumes e borra de café', ['Pilhas usadas', 'Garrafas plásticas', 'Restos de tinta'],
    'Resíduos orgânicos viram adubo. Materiais como pilhas, plástico e tinta não.'),
  Q(2, 'residuos', 'Pilhas e baterias usadas devem ser...',
    'Levadas a pontos de coleta específicos', ['Jogadas no lixo comum', 'Queimadas no quintal', 'Enterradas no jardim'],
    'Contêm metais que podem contaminar solo e água se descartados incorretamente.'),
  Q(2, 'residuos', 'O que fazer com óleo de cozinha usado?',
    'Guardar em garrafa fechada e levar a um ponto de coleta', ['Jogar na pia com água quente', 'Descartar no vaso sanitário', 'Despejar no quintal para "alimentar a terra"'],
    'Mesmo pouco óleo pode poluir muita água e entupir encanamentos.'),
  Q(2, 'residuos', 'Na lógica dos "Rs" da sustentabilidade, qual atitude costuma ter prioridade sobre reciclar?',
    'Reduzir o consumo', ['Comprar mais embalagens recicláveis', 'Trocar produtos com frequência', 'Descartar tudo no lixo comum'],
    'Reciclar é importante, mas o melhor resíduo é aquele que nem chega a ser gerado.'),
  Q(2, 'residuos', 'Antes de ir para a reciclagem, embalagens devem estar...',
    'Sem restos de comida e escorridas', ['Dentro de sacos de lixo orgânico', 'Molhadas com detergente', 'Misturadas com lixo de banheiro'],
    'Restos de comida e líquidos contaminam materiais recicláveis e podem inutilizá-los.'),
  Q(2, 'residuos', 'Qual item de vidro costuma ser aceito na reciclagem de embalagens?',
    'Garrafas e potes de vidro', ['Espelhos', 'Louças e porcelanas', 'Lâmpadas'],
    'Espelhos, cerâmicas e lâmpadas têm composição diferente e atrapalham o processo.'),
  Q(2, 'residuos', 'Por que alimentos locais e da estação costumam ter menor impacto?',
    'Costumam percorrer menos distância e exigir menos armazenamento', ['Porque nunca usam água', 'Porque dispensam embalagem sempre', 'Porque não precisam de solo'],
    'Não é regra absoluta, mas é uma boa tendência.'),
  Q(3, 'residuos', 'Qual hábito mais reduz o desperdício de alimentos em casa?',
    'Planejar as compras e aproveitar sobras em novas refeições', ['Comprar em grande quantidade sem lista', 'Descartar alimentos assim que perdem a aparência', 'Jogar fora cascas e talos sempre'],
    'Planejar evita sobras, e cascas e talos muitas vezes podem ser aproveitados.'),
  Q(3, 'residuos', 'Sua cozinha gera muito resíduo orgânico e há pouco espaço livre. Que solução é viável?',
    'Composteira doméstica fechada, como um minhocário', ['Enterrar o lixo orgânico em sacolas plásticas', 'Queimar os resíduos no quintal', 'Deixar acumular em um balde aberto'],
    'Minhocários e composteiras fechadas, bem manejados, cabem em pouco espaço e geram adubo.'),
  // ---- NATUREZA
  Q(1, 'natureza', 'Qual é uma vantagem de usar plantas nativas no jardim?',
    'Costumam ser adaptadas ao clima local e atraem a fauna da região', ['Nunca precisam de nenhum cuidado', 'Só crescem se regadas todo dia', 'Substituem a necessidade de sol'],
    'Adaptadas, tendem a precisar de menos água e oferecem abrigo e alimento à fauna local.'),
  Q(1, 'natureza', 'Para trajetos curtos, por que a bicicleta é uma escolha sustentável?',
    'Não emite gases durante o uso e ocupa pouco espaço', ['Porque usa gasolina de baixo consumo', 'Porque exige estacionamento amplo', 'Porque só funciona em cidades planas'],
    'Pedalar evita emissões e ainda faz bem à saúde.'),
  Q(2, 'natureza', 'O que um telhado verde pode oferecer a uma casa?',
    'Ajuda no conforto térmico e retém parte da água da chuva', ['Elimina qualquer manutenção', 'Gera energia elétrica sozinho', 'Impede totalmente que chova na casa'],
    'A camada vegetal reduz a troca de calor e segura parte da água, mas exige projeto e manutenção.'),
  Q(2, 'natureza', 'O que ajuda a atrair polinizadores como abelhas e borboletas?',
    'Flores variadas e pouco ou nenhum agrotóxico', ['Um jardim só de grama', 'Iluminação forte a noite toda', 'Pavimentar o quintal'],
    'Polinizadores dependem de flores e sofrem com agrotóxicos. Eles são essenciais para muitas plantas.'),
  Q(2, 'natureza', 'Qual é uma vantagem de manter uma pequena horta em casa?',
    'Alimentos frescos, menos embalagens e uso do adubo da compostagem', ['Elimina qualquer ida ao mercado', 'Dispensa água e sol', 'Atrai apenas pragas'],
    'Uma horta aproxima o alimento de quem o consome e conversa bem com a compostagem.'),
  Q(2, 'natureza', 'Cimentar todo o quintal pode causar qual efeito?',
    'Menos infiltração de água e mais risco de enxurradas', ['Mais biodiversidade', 'Solo mais fértil', 'Mais abelhas visitando o jardim'],
    'Superfícies impermeáveis impedem a água de entrar no solo.'),
  Q(2, 'natureza', 'Quais gases estão entre os principais gases de efeito estufa emitidos por atividades humanas?',
    'Dióxido de carbono e metano', ['Oxigênio e nitrogênio', 'Hélio e neônio', 'Argônio e hidrogênio'],
    'Eles retêm calor na atmosfera. Oxigênio e nitrogênio compõem a maior parte do ar, mas não têm esse papel.'),
  Q(3, 'natureza', 'Por que espécies exóticas invasoras podem ser um problema em jardins?',
    'Podem se espalhar e competir com espécies nativas', ['Sempre morrem em poucos dias', 'Atraem somente espécies raras', 'Não precisam de solo'],
    'Quando fogem do controle, tomam o espaço das plantas locais e afetam a fauna.'),
  Q(3, 'natureza', 'Qual prática ajuda aves a visitarem seu jardim com segurança?',
    'Plantas nativas que dão frutos e uma fonte de água limpa', ['Gaiolas para atrair as aves', 'Uso frequente de pesticidas', 'Luz forte acesa a noite inteira'],
    'Comida, água e abrigo atraem as aves. Pesticidas e luz excessiva atrapalham.'),
  Q(3, 'natureza', 'Por que um ônibus lotado costuma emitir menos por pessoa do que carros individuais?',
    'Divide as emissões do veículo entre muitos passageiros', ['Porque ônibus não consomem combustível', 'Porque a poluição some em grupos', 'Porque carros não emitem gases'],
    'O que importa é a emissão por passageiro transportado.'),
  // ---- CONFORTO
  Q(1, 'conforto', 'O que o isolamento térmico faz por uma casa?',
    'Reduz a troca de calor com o exterior, ajudando no calor e no frio', ['Aumenta o ruído interno', 'Gera calor sozinho', 'Substitui a ventilação'],
    'Com menos troca de calor, a casa mantém a temperatura por mais tempo.'),
  Q(2, 'conforto', 'Qual disposição de janelas ajuda mais a ventilação natural de um cômodo?',
    'Janelas em paredes diferentes, permitindo entrada e saída de ar', ['Uma única janela pequena no alto', 'Janelas fechadas com cortinas pesadas', 'Janelas só na parede que recebe mais sol'],
    'Com entrada e saída, o ar circula e renova o ambiente.'),
  Q(2, 'conforto', 'Pintar telhados e paredes externas com cores claras ou refletivas tende a...',
    'Refletir mais radiação solar e aquecer menos a construção', ['Absorver mais calor', 'Impedir qualquer troca de ar', 'Dobrar o consumo de energia'],
    'Cores claras refletem mais a radiação do sol.'),
  Q(2, 'conforto', 'Por que janelas bem posicionadas ajudam a economizar energia?',
    'Entra mais luz natural durante o dia, então há menos lâmpadas acesas', ['Porque janelas geram eletricidade', 'Porque dispensam portas', 'Porque bloqueiam todo o calor'],
    'Aproveitar a luz do dia é a iluminação mais barata que existe.'),
  Q(2, 'conforto', 'Plantar uma árvore de copa ampla diante da fachada que recebe sol forte à tarde pode...',
    'Reduzir o calor interno ao fazer sombra', ['Aumentar o calor da casa', 'Eliminar a necessidade de janelas', 'Bloquear a luz o dia inteiro em todos os cômodos'],
    'O sombreamento natural diminui a radiação que chega às paredes e janelas.'),
  Q(3, 'conforto', 'O que é um projeto "bioclimático"?',
    'Um projeto que aproveita sol, vento e vegetação para dar conforto com menos energia', ['Um projeto que usa apenas materiais importados', 'Um projeto sem janelas para economizar', 'Um projeto que depende de ar-condicionado em todos os cômodos'],
    'A casa é desenhada para o clima do lugar, reduzindo a dependência de máquinas.')
];

/* Decisões. Cada opção: t, c (custo), ef, pts (qualidade), fb, e extras:
   inst (instala melhoria), req (ids), tag, ign:{k,ind} (consequência cumulativa) */
const O = (t, c, ef, pts, fb, extra) => Object.assign({ t, c, ef, pts, fb }, extra || {});

const DECISOES = [
  { id: 'luz', nivel: 1, ic: '⚡', t: 'A conta de luz disparou', txt: 'O consumo de energia aumentou bastante neste mês. Onde agir primeiro?', opcoes: [
    O('Trocar a iluminação por LED', 600, { energia: 9, conforto: 3 }, 75, 'LEDs usam bem menos energia para a mesma luz e duram mais. É barato e dá retorno rápido.', { inst: 'led', tag: 'Rápido e barato' }),
    O('Instalar painéis solares', 4000, { energia: 22, natureza: 5 }, 80, 'Painéis geram energia limpa e reduzem a conta no longo prazo, mas o investimento é alto e rende mais numa casa já eficiente.', { inst: 'solar', tag: 'Longo prazo' }),
    O('Melhorar o isolamento térmico', 2000, { energia: 6, conforto: 10 }, 65, 'Isolar reduz a necessidade de climatização e melhora o conforto. O efeito na conta é mais lento, porém duradouro.', { inst: 'isolamento', tag: 'Conforto + energia' }),
    O('Não mudar nada por enquanto', 0, { energia: -5 }, 0, 'Sem ação, o desperdício continua e a conta segue alta.', { ign: { k: 'luz', ind: 'energia' } })
  ] },
  { id: 'vazamento', nivel: 1, ic: '💧', t: 'Torneira pingando', txt: 'Você notou uma torneira pingando e a conta de água subiu.', opcoes: [
    O('Consertar a vedação', 150, { agua: 6 }, 80, 'Reparos pequenos evitam grandes desperdícios: um gotejamento constante soma muita água ao longo do mês.', { tag: 'Barato' }),
    O('Trocar por torneiras econômicas', 700, { agua: 10, conforto: 1 }, 75, 'Torneiras com arejador reduzem a vazão mantendo o conforto.', { inst: 'torneiras', tag: 'Resolve e melhora' }),
    O('Deixar para depois', 0, { agua: -5 }, 0, 'Pequenos vazamentos ignorados crescem. Se isso se repetir, a casa entra em crise hídrica.', { ign: { k: 'vazamento', ind: 'agua' } })
  ] },
  { id: 'sobras', nivel: 1, ic: '🍳', t: 'Cozinha cheia de sobras', txt: 'O lixo da cozinha enche rápido, e boa parte são cascas e restos de comida.', opcoes: [
    O('Montar uma composteira', 500, { residuos: 12, natureza: 3 }, 80, 'Compostagem transforma restos orgânicos em adubo e reduz muito o volume do lixo.', { inst: 'compostagem', tag: 'Ataca a causa' }),
    O('Organizar a coleta seletiva', 600, { residuos: 10 }, 75, 'Separar os recicláveis desvia material do aterro, mas os orgânicos continuam no lixo comum.', { inst: 'coleta' }),
    O('Comprar lixeiras maiores', 200, { residuos: 2, conforto: 1 }, 25, 'Lixeira maior só adia o problema: o volume de resíduos continua o mesmo.', { tag: 'Só disfarça' }),
    O('Ignorar o problema', 0, { residuos: -5 }, 0, 'Resíduos que se acumulam sem destino viram um problema de higiene e de meio ambiente.', { ign: { k: 'lixo', ind: 'residuos' } })
  ] },
  { id: 'calor_sala', nivel: 2, ic: '🛋️', t: 'A sala virou um forno', txt: 'O verão chegou e a sala fica quente à tarde. Como melhorar o conforto?', opcoes: [
    O('Comprar um ar-condicionado potente', 1200, { conforto: 14, energia: -10 }, 25, 'O alívio é imediato, mas o consumo de energia sobe bastante e o calor continua entrando.', { tag: 'Alívio rápido' }),
    O('Abrir a casa para ventilação natural', 900, { conforto: 8, energia: 5 }, 85, 'Ventilação cruzada renova o ar sem gastar energia.', { inst: 'ventilacao', tag: 'Equilíbrio' }),
    O('Investir em isolamento térmico', 2000, { conforto: 10, energia: 6 }, 80, 'Isolar reduz o calor que entra e o frio que sai. Custa mais, mas dura muito.', { inst: 'isolamento', tag: 'Longo prazo' }),
    O('Aguentar o calor', 0, { conforto: -8 }, 5, 'Economizar não precisa significar sofrer. Conforto também faz parte da casa sustentável.')
  ] },
  { id: 'jardim_novo', nivel: 2, ic: '🌱', t: 'O jardim precisa de rega', txt: 'Você quer um jardim bonito, mas a conta de água preocupa. Qual caminho seguir?', opcoes: [
    O('Gramado e mangueira todo dia', 0, { natureza: 6, agua: -10 }, 15, 'Grama exótica e rega diária consomem muita água para pouco ganho ambiental.'),
    O('Plantar espécies nativas', 1000, { natureza: 14, agua: 3 }, 90, 'Plantas nativas se adaptam ao clima, pedem menos água e abrigam a fauna local.', { inst: 'nativas', tag: 'Longo prazo' }),
    O('Irrigação automática no gramado', 1500, { natureza: 6, agua: -4 }, 35, 'Automatizar ajuda a regar nos horários certos, mas o gramado continua sendo sedento.'),
    O('Cimentar o quintal', 800, { conforto: 2, natureza: -8, agua: -3 }, 5, 'Fácil de manter, porém impermeabiliza o solo e piora as enxurradas.', { tag: 'Cuidado' })
  ] },
  { id: 'geladeira', nivel: 2, ic: '🧊', t: 'A geladeira quebrou', txt: 'A geladeira antiga parou de vez. O que fazer?', opcoes: [
    O('Comprar modelo eficiente', 1500, { energia: 8, agua: 3 }, 85, 'Um aparelho eficiente gasta menos todos os meses e compensa o preço ao longo do tempo.', { inst: 'eletro', tag: 'Longo prazo' }),
    O('Consertar a antiga', 300, { energia: 1 }, 40, 'Mais barato agora, porém ela continua gastando muita energia.', { tag: 'Curto prazo' }),
    O('Comprar uma usada barata', 500, { energia: -2 }, 20, 'Modelos antigos costumam gastar bem mais energia e a economia some na conta de luz.'),
    O('Adiar a decisão', 0, { energia: -5 }, 0, 'Sem geladeira, perde-se comida e o desperdício aumenta.', { ign: { k: 'luz', ind: 'energia' } })
  ] },
  { id: 'transporte', nivel: 2, ic: '🚲', t: 'Gastos com transporte', txt: 'Os deslocamentos curtos de carro estão pesando no bolso e no ar.', opcoes: [
    O('Criar um bicicletário e incentivar a bike', 800, { natureza: 5, conforto: 2 }, 80, 'Pedalar em trajetos curtos reduz emissões e melhora a saúde.', { inst: 'bicicletario' }),
    O('Trocar o carro por um mais novo', 2500, { conforto: 6, natureza: -2 }, 25, 'Troca cara que pouco muda o hábito. Evitar viagens desnecessárias vale mais.'),
    O('Combinar caronas e transporte coletivo', 0, { natureza: 3, conforto: -2 }, 60, 'Não custa nada, mas exige mudar a rotina.', { tag: 'Grátis' }),
    O('Manter tudo como está', 0, {}, 10, 'Nada muda, nem para melhor nem para pior.')
  ] },
  { id: 'oleo', nivel: 2, ic: '🍟', t: 'O que fazer com o óleo usado?', txt: 'Sobrou uma garrafa de óleo de fritura. Para onde ela vai?', opcoes: [
    O('Despejar na pia', 0, { agua: -5, natureza: -3 }, 0, 'O óleo polui muita água e entope encanamentos. Nunca na pia.'),
    O('Guardar e levar a um ponto de coleta', 0, { residuos: 5, agua: 3, natureza: 2 }, 90, 'O óleo coletado pode virar sabão e biodiesel em vez de poluição.', { tag: 'Grátis' }),
    O('Misturar ao lixo comum', 0, { residuos: -1 }, 30, 'Vai para o aterro e pode vazar. Não é o pior, mas há um destino melhor.'),
    O('Fazer sabão caseiro com a receita certa', 100, { residuos: 6 }, 85, 'Reaproveitar o óleo evita descarte e dá utilidade ao que seria lixo.')
  ] },
  { id: 'umidade', nivel: 3, ic: '🧱', t: 'Mancha de umidade na parede', txt: 'Uma mancha apareceu na parede do banheiro e a conta de água subiu.', opcoes: [
    O('Investigar e consertar o vazamento', 400, { agua: 6 }, 85, 'Achar a origem evita desperdício e danos maiores à estrutura.', { tag: 'Curto prazo' }),
    O('Pintar por cima', 100, { conforto: 1 }, 5, 'A mancha some, mas o vazamento continua escondido.', { ign: { k: 'vazamento', ind: 'agua' } }),
    O('Refazer o encanamento', 1800, { agua: 12, conforto: 3 }, 80, 'Caro, mas resolve de vez e previne novos vazamentos.', { tag: 'Longo prazo' }),
    O('Não fazer nada', 0, { agua: -5 }, 0, 'Vazamentos ocultos crescem em silêncio.', { ign: { k: 'vazamento', ind: 'agua' } })
  ] },
  { id: 'complementar_agua', nivel: 3, ic: '🧩', t: 'Falta equilíbrio', txt: 'Sua casa já gera boa parte da energia, mas a conta de água continua alta. Orçamento limitado: qual investimento complementa melhor o sistema?',
    cond: G => G.energia >= 55 && G.agua < 55, opcoes: [
    O('Captação de água da chuva', 2500, { agua: 18, natureza: 3 }, 90, 'Reforçar o ponto fraco equilibra a casa. Sustentabilidade é um sistema.', { inst: 'chuva' }),
    O('Mais painéis solares', 3000, { energia: 8 }, 25, 'Você ampliaria o que já está bom, com ganho pequeno.'),
    O('Telhado verde', 3000, { natureza: 10, agua: 4, energia: 3 }, 45, 'Traz benefícios variados, mas ajuda pouco no consumo de água.', { req: ['nativas'] }),
    O('Guardar o dinheiro', 0, {}, 30, 'Reserva é útil, mas o problema continua.')
  ] },
  { id: 'complementar_energia', nivel: 3, ic: '🧩', t: 'Falta equilíbrio', txt: 'A casa já usa bem a água, mas a energia está fraca. Qual investimento complementa melhor?',
    cond: G => G.agua >= 55 && G.energia < 55, opcoes: [
    O('Iluminação LED', 600, { energia: 9, conforto: 3 }, 85, 'Barata e rápida: o melhor primeiro passo.', { inst: 'led', tag: 'Rápido' }),
    O('Painéis solares', 4000, { energia: 22, natureza: 5 }, 80, 'Gera energia limpa, mas é caro. Faz mais sentido com consumo já reduzido.', { inst: 'solar', tag: 'Longo prazo' }),
    O('Mais captação de água', 2500, { agua: 6 }, 20, 'A água já está bem. O ponto fraco é outro.'),
    O('Guardar o dinheiro', 0, {}, 30, 'Reserva é útil, mas o problema continua.')
  ] },
  { id: 'terreno', nivel: 3, ic: '🌿', t: 'Terreno baldio ao lado', txt: 'O terreno vizinho acumula entulho. Você quer ajudar a mudar isso.', cond: G => G.natureza < 50, opcoes: [
    O('Organizar uma horta comunitária', 600, { natureza: 7, residuos: 2, conforto: 2 }, 85, 'Espaços verdes ajudam a vizinhança e melhoram o ambiente.'),
    O('Cimentar para virar estacionamento', 1500, { natureza: -6, conforto: 2 }, 5, 'Impermeabilizar o solo reduz a natureza do entorno.'),
    O('Mutirão de limpeza e plantio de mudas', 0, { natureza: 5, conforto: -1 }, 75, 'Grátis, exige tempo e boa vontade.', { tag: 'Grátis' }),
    O('Ignorar', 0, { natureza: -3 }, 0, 'O abandono atrai lixo e pragas.', { ign: { k: 'lixo', ind: 'natureza' } })
  ] },
  { id: 'eolica', nivel: 3, ic: '🌬️', t: 'Turbina no telhado?', txt: 'Um vendedor oferece uma pequena turbina eólica residencial. Sua casa fica numa área urbana, entre prédios.', opcoes: [
    O('Comprar a turbina', 3000, { energia: 6, conforto: -3 }, 30, 'Em áreas urbanas o vento costuma ser fraco e turbulento: o retorno é baixo e pode haver ruído.'),
    O('Instalar painéis solares', 3500, { energia: 20, natureza: 5 }, 85, 'Em cidade, a luz do sol costuma ser a fonte mais previsível.', { inst: 'solar' }),
    O('Medir o vento por um mês antes de decidir', 100, { energia: 1 }, 70, 'Planejar com dados evita investimento mal aplicado.', { tag: 'Planejamento' }),
    O('Recusar e seguir como está', 0, {}, 20, 'Nenhum custo, mas também nenhum ganho.')
  ] },
  { id: 'luz_conflito', nivel: 3, ic: '💡', t: 'Economia extrema?', txt: 'Você quer reduzir o consumo de energia. Até onde ir sem prejudicar o conforto?', opcoes: [
    O('Viver quase no escuro e desligar tudo', 0, { energia: 10, conforto: -15 }, 15, 'Economizar não deve piorar muito a qualidade de vida. É um ganho que dificilmente se mantém.'),
    O('Sensores de presença', 500, { energia: 5, conforto: 1 }, 85, 'Luz só quando alguém está no ambiente: economia sem sacrifício.', { req: ['led'], inst: 'sensores' }),
    O('Mais janelas e iluminação natural', 900, { energia: 7, conforto: 6 }, 80, 'Luz natural economiza energia e deixa a casa mais agradável.'),
    O('Não mexer em nada', 0, { energia: -3 }, 0, 'O consumo segue como está.', { ign: { k: 'luz', ind: 'energia' } })
  ] },
  { id: 'compras', nivel: 3, ic: '🛒', t: 'Alimentos caros e embalagens demais', txt: 'O mercado enche a casa de embalagens, e muita comida estraga.', opcoes: [
    O('Montar uma horta', 800, { natureza: 6, residuos: 4 }, 75, 'Produzir parte do alimento reduz embalagens e distância.', { inst: 'horta' }),
    O('Comprar a granel e reutilizar potes', 700, { residuos: 10, natureza: 2 }, 85, 'Menos embalagem e menos desperdício por compra.', { inst: 'granel' }),
    O('Comprar industrializados de marca "eco"', 300, { residuos: -2 }, 20, 'O rótulo não muda o volume de embalagem.'),
    O('Ir a uma feira local uma vez por semana', 200, { residuos: 4, natureza: 2 }, 70, 'Alimentos frescos e menos embalagem.', { tag: 'Hábito' })
  ] },
  { id: 'telhado_quente', nivel: 2, ic: '🏠', t: 'O telhado esquenta o andar de cima', txt: 'O quarto do segundo andar vira uma estufa no meio da tarde.', opcoes: [
    O('Pintar o telhado com cor clara refletiva', 500, { energia: 3, conforto: 6 }, 75, 'Cores claras refletem mais radiação solar e esquentam menos a casa.', { tag: 'Barato' }),
    O('Instalar telhado verde', 3000, { natureza: 14, conforto: 6, agua: 4, energia: 4 }, 85, 'Um telhado vivo isola, retém água e cria habitat.', { req: ['nativas'], inst: 'telhado_verde', tag: 'Longo prazo' }),
    O('Comprar um ventilador extra', 200, { conforto: 3, energia: -2 }, 40, 'Ajuda um pouco, mas não ataca a origem do calor.'),
    O('Esperar o frio chegar', 0, { conforto: -5 }, 0, 'O calor volta no próximo verão.')
  ] },
  { id: 'vendedor', nivel: 3, ic: '🧾', t: 'Proposta de um vendedor', txt: 'Um vendedor oferece um "kit solar com bateria" por um preço fechado e promete zerar sua conta.', opcoes: [
    O('Aceitar na hora', 5500, { energia: 18, conforto: 2 }, 40, 'Sem estudar seu consumo, o kit pode ser grande demais e caro demais.'),
    O('Pedir orçamentos e dimensionar pelo consumo', 4000, { energia: 22, natureza: 5 }, 90, 'Dimensionar pelo consumo real evita pagar por capacidade que você não usa.', { inst: 'solar', tag: 'Planejamento' }),
    O('Começar só pelo LED', 600, { energia: 9, conforto: 3 }, 70, 'Reduzir o consumo antes de gerar energia diminui o tamanho do sistema.', { inst: 'led' }),
    O('Recusar e não pesquisar', 0, {}, 15, 'Dispensou o golpe, mas também a oportunidade.')
  ] },
  { id: 'banho', nivel: 2, ic: '🚿', t: 'Banheiro gastando demais', txt: 'O banheiro é o campeão de consumo de água da casa.', opcoes: [
    O('Instalar vaso com duplo acionamento', 600, { agua: 8 }, 80, 'Dois botões permitem usar menos água quando for possível.'),
    O('Adotar banhos mais curtos', 0, { agua: 5, conforto: -2 }, 65, 'Grátis, mas exige mudança de hábito.', { tag: 'Grátis' }),
    O('Trocar o chuveiro por um mais potente', 400, { conforto: 3, energia: -4, agua: -2 }, 20, 'Mais potência pode significar mais energia e mais água.'),
    O('Não mudar nada', 0, { agua: -3 }, 0, 'O desperdício continua.', { ign: { k: 'vazamento', ind: 'agua' } })
  ] },
  { id: 'entulho', nivel: 3, ic: '🧰', t: 'A reforma gerou entulho', txt: 'Uma pequena reforma deixou entulho e sobras de material.', opcoes: [
    O('Contratar caçamba e descartar corretamente', 400, { residuos: 3, natureza: 1 }, 75, 'Descarte correto evita poluição, mas ainda gera resíduo.'),
    O('Reaproveitar o que for possível na própria casa', 0, { residuos: 6, conforto: -1 }, 85, 'O melhor resíduo é o que é reaproveitado.', { tag: 'Grátis' }),
    O('Despejar em um terreno vazio', 0, { residuos: -8, natureza: -6 }, 0, 'Descarte irregular gera contaminação e atrai pragas.'),
    O('Levar o que for reciclável a uma cooperativa', 100, { residuos: 7, natureza: 1 }, 85, 'Cooperativas dão destino adequado e geram renda.')
  ] },
  { id: 'reserva', nivel: 3, ic: '🏦', t: 'Dinheiro em caixa', txt: 'Sobrou dinheiro no orçamento. Guardar ou aplicar na casa?', opcoes: [
    O('Guardar tudo', 0, {}, 10, 'Reserva é prudência, mas dinheiro parado não melhora a casa.'),
    O('Auditoria de consumo da casa', 300, { energia: 4, agua: 4, residuos: 4 }, 85, 'Medir é o primeiro passo para acertar os investimentos seguintes.', { tag: 'Planejamento' }),
    O('Decoração "verde" de última moda', 1500, { conforto: 6, natureza: 2 }, 35, 'Agrada, mas pouco muda o desempenho ambiental.'),
    O('Pequenas melhorias de manutenção', 600, { energia: 3, agua: 3, conforto: 2 }, 70, 'Vedações, filtros e regulagens evitam desperdícios silenciosos.')
  ] }
];

/* Crises: criadas quando um indicador cai abaixo de 20 */
const CRISES_DEC = {
  energia: { ic: '⚡', t: 'CRISE ENERGÉTICA', txt: 'A casa desperdiça energia demais. É hora de agir.', opcoes: [
    O('Mutirão de economia: stand-by e lâmpadas', 200, { energia: 7, conforto: -2 }, 70, 'Hábitos simples cortam desperdícios imediatos.'),
    O('Chamar um técnico para revisar a instalação', 800, { energia: 14, conforto: 2 }, 85, 'Um diagnóstico profissional acha os maiores vilões do consumo.'),
    O('Esperar a poeira baixar', 0, { energia: -3 }, 0, 'A crise não se resolve sozinha.', { ign: { k: 'crise_energia', ind: 'energia' } })
  ] },
  agua: { ic: '💧', t: 'CRISE HÍDRICA', txt: 'A casa desperdiça água demais. Hora de agir.', opcoes: [
    O('Campanha de redução de consumo na família', 0, { agua: 5, conforto: -2 }, 65, 'Grátis, mas pede disciplina.', { tag: 'Grátis' }),
    O('Caçar vazamentos e trocar vedações', 500, { agua: 12 }, 85, 'Consertos pontuais costumam render muito.'),
    O('Esperar a poeira baixar', 0, { agua: -3 }, 0, 'A crise não se resolve sozinha.', { ign: { k: 'crise_agua', ind: 'agua' } })
  ] },
  residuos: { ic: '♻️', t: 'CRISE DE RESÍDUOS', txt: 'O lixo está fora de controle.', opcoes: [
    O('Separar recicláveis e orgânicos já', 200, { residuos: 8 }, 75, 'Separação correta é o primeiro passo para reduzir o que vai ao aterro.'),
    O('Organizar uma composteira e uma estação de coleta', 600, { residuos: 14, natureza: 2 }, 85, 'Estrutura certa mantém o hábito.'),
    O('Esperar a poeira baixar', 0, { residuos: -3 }, 0, 'A crise não se resolve sozinha.', { ign: { k: 'crise_residuos', ind: 'residuos' } })
  ] },
  natureza: { ic: '🌱', t: 'DEGRADAÇÃO AMBIENTAL', txt: 'O entorno da casa está degradado.', opcoes: [
    O('Plantar mudas nativas com a vizinhança', 100, { natureza: 8 }, 80, 'Pequenas ações coletivas recuperam o entorno.'),
    O('Contratar paisagismo com espécies nativas', 800, { natureza: 14, agua: 2 }, 85, 'Projeto bem feito resolve de vez.'),
    O('Esperar a poeira baixar', 0, { natureza: -3 }, 0, 'A crise não se resolve sozinha.', { ign: { k: 'crise_natureza', ind: 'natureza' } })
  ] },
  conforto: { ic: '😊', t: 'QUALIDADE DE VIDA BAIXA', txt: 'A casa está desconfortável demais para morar.', opcoes: [
    O('Melhorar iluminação e ventilação com ajustes simples', 200, { conforto: 8 }, 75, 'Ajustes simples já mudam muito a sensação.'),
    O('Reforma de conforto térmico', 1000, { conforto: 14, energia: 3 }, 85, 'Investir no ambiente também é sustentabilidade.'),
    O('Esperar a poeira baixar', 0, { conforto: -3 }, 0, 'A crise não se resolve sozinha.', { ign: { k: 'crise_conforto', ind: 'conforto' } })
  ] }
};
