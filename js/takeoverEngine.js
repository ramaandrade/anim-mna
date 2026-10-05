/**
 * takeoverEngine.js
 * Mecânica de Takeovers Hostis e Táticas de Defesa Corporativa
 * Tubarão Gordon vs Dra. Defesa
 */

export const DEFENSE_CARDS = [
  {
    id: 'poison_pill',
    name: 'Flip-in Poison Pill',
    subtitle: 'Pílula de Veneno Societária',
    icon: '💊',
    costCash: 12,
    governanceDelta: -5,
    effectiveness: 90,
    shortDesc: 'Permite a todos os acionistas (menos ao invasor) comprar ações com 50% de desconto.',
    description: 'A clássica pílula de veneno dilui drasticamente a participação do agressor se ele ultrapassar o gatilho societário (ex: 20% do capital). Gordon terá sua fatia pulverizada!',
    economicConcept: 'Criada nos anos 1980 pelo jurista Martin Lipton em Wall Street, a poison pill encarece artificialmente o custo da aquisição forçando o agressor a negociar com o Conselho.',
    quoteDraDefesa: 'Se Gordon passar de 20%, inundamos o mercado com novas ações a preço de banana para nossos aliados. A fatia dele vai derreter!'
  },
  {
    id: 'golden_parachute',
    name: 'Golden Parachute',
    subtitle: 'Pára-quedas Dourado dos Executivos',
    icon: '🪂',
    costCash: 8,
    governanceDelta: -20,
    effectiveness: 60,
    shortDesc: 'Cláusula de rescisão milionária caso a atual diretoria seja destituída.',
    description: 'Estipula indenizações astronômicas para a diretoria executiva se houver mudança de controle acionário. Aumenta o custo para o invasor assumir a operação.',
    economicConcept: 'Conflito de Agência (Teoria da Agência): os gestores (agentes) utilizam recursos da empresa para se protegerem à custa dos interesses dos acionistas (principais). O mercado penaliza a governança.',
    quoteDraDefesa: 'Se Gordon assumir, terá que desembolsar R$ 25M apenas em rescisões para o nosso time. Ele vai pensar duas vezes, mas prepare-se para críticas na imprensa!'
  },
  {
    id: 'crown_jewel',
    name: 'Crown Jewel Defense',
    subtitle: 'Venda da Joia da Coroa',
    icon: '💎',
    costCash: 5,
    governanceDelta: -10,
    effectiveness: 80,
    shortDesc: 'Venda temporária do ativo ou patente mais cobiçada para um parceiro amigo.',
    description: 'Desfaz-se do ativo central que motiva a investida de Gordon (como o algoritmo de IA proprietário), eliminando o atrativo da companhia para o invasor.',
    economicConcept: 'Tática de terra arrasada (scorched-earth): ao alienar a divisão mais lucrativa ou estratégica, o agressor desiste da compra não solicitada.',
    quoteDraDefesa: 'Gordon só quer nossa infraestrutura de IA. Se transferirmos o ativo para um parceiro estratégico, ele perde o apetite pelo nosso controle!'
  },
  {
    id: 'white_knight',
    name: 'White Knight (Cavaleiro Branco)',
    subtitle: 'Comprador Estratégico Amigável',
    icon: '🛡️',
    costCash: 15,
    governanceDelta: +10,
    effectiveness: 95,
    shortDesc: 'Busca por um investidor institucional amigável que compra um bloco de bloqueio.',
    description: 'Encontra um fundo parceiro ou empresa aliada disposta a adquirir uma fatia de 25% com compromisso de manter a gestão e barrar o Tubarão Gordon no Conselho.',
    economicConcept: 'Aliança estratégica de bloqueio acionário: o Cavaleiro Branco resgata a empresa de um predador hostil, garantindo continuidade e estabilidade estratégica.',
    quoteDraDefesa: 'O fundo soberano Futuro Tech topa comprar 25% das ações em circulação e assinar um acordo de acionistas com voto vinculado a nós. Xeque-mate no Gordon!'
  },
  {
    id: 'people_pill',
    name: 'People Pill (Pílula das Pessoas)',
    subtitle: 'Pacto de Renúncia Coletiva',
    icon: '👥',
    costCash: 4,
    governanceDelta: -5,
    effectiveness: 70,
    shortDesc: 'Pacto formal em que todo o time chave de tecnologia pedirá demissão se Gordon vencer.',
    description: 'A empresa é o seu capital humano. Se Gordon assumir o controle, o time de engenharia e fundadores saem juntos, deixando para trás apenas uma casca vazia.',
    economicConcept: 'Capital Intelectual e Ativos Intangíveis: em empresas de base tecnológica, o valor reside nos talentos. Essa ameaça reduz o valuation para o invasor.',
    quoteDraDefesa: 'Em tech, o código sem os desenvolvedores não vale nada. Gordon sabe que se nós sairmos, o valor das ações despenca 60% no dia seguinte.'
  },
  {
    id: 'pacman_defense',
    name: 'Pac-Man Defense',
    subtitle: 'Contra-Ataque Hostil',
    icon: '👾',
    costCash: 40,
    governanceDelta: +5,
    effectiveness: 90,
    shortDesc: 'Lança uma contra-oferta para comprar a holding controlada pelo Tubarão Gordon!',
    description: 'Inspirada no jogo arcade, a presa se vira e tenta devorar o caçador! Requer muito caixa, mas neutraliza totalmente a agressão hostil.',
    economicConcept: 'Contra-OPA (Counter Tender Offer): manobra audaciosa do direito societário em que a companhia-alvo vira o jogo e tenta o controle do próprio agressor.',
    quoteDraDefesa: 'Se tivermos liquidez suficiente, viramos a mesa: lançamos uma oferta pública para comprar o veículo de investimento do Gordon!'
  }
];

export class TakeoverEngine {
  /**
   * Inicializa o cenário de ataque de Gordon
   */
  static createAttackScenario(playerState) {
    const marketCap = playerState.marketCap || 300;
    const premiumPercent = 35; // 35% de prêmio oferecido aos acionistas
    const offerValue = Math.round(marketCap * (1 + premiumPercent / 100));

    return {
      active: true,
      stage: 'TENDER_OFFER_FILED',
      gordonInitialStake: 18, // Gordon já acumulou 18% no mercado secundário em segredo
      friendlyStake: playerState.friendlyControl || 45,
      freeFloat: 100 - 18 - (playerState.friendlyControl || 45),
      premiumPercent,
      offerValue,
      turnTimeRemaining: 3,
      gordonQuotes: [
        '“Esta empresa tem margens medíocres e executivos confortáveis demais. Minha oferta pública (OPA) pagará 35% de prêmio aos acionistas minoritários!”',
        '“O mercado não perdoa ineficiência. Ou vocês entregam resultados, ou eu assumo a presidência deste Conselho de Administração!”'
      ]
    };
  }

  /**
   * Avalia a ativação de uma carta de defesa
   */
  static playDefenseCard(cardId, attackScenario, playerState) {
    const card = DEFENSE_CARDS.find(c => c.id === cardId);
    if (!card) {
      return { success: false, reason: 'Carta de defesa inválida.' };
    }

    if (playerState.cash < card.costCash) {
      return {
        success: false,
        reason: `Caixa insuficiente para custear a manobra jurídica (Custo: R$ ${card.costCash}M | Disponível: R$ ${playerState.cash}M).`
      };
    }

    let updatedGordonStake = attackScenario.gordonInitialStake;
    let updatedFriendlyStake = attackScenario.friendlyStake;
    let outcomeMessage = '';

    switch (card.id) {
      case 'poison_pill':
        // Dilui a participação de Gordon de 18% para 8% e eleva a fatia dos aliados
        updatedGordonStake = Math.round(updatedGordonStake * 0.45);
        updatedFriendlyStake += 15;
        outcomeMessage = 'A Flip-in Poison Pill foi ativada! A emissão maciça de ações a preço reduzido diluiu o Tubarão Gordon para 8%. O ataque hostil foi neutralizado!';
        break;

      case 'golden_parachute':
        // Aumenta o custo, mas Gordon ainda tenta se tiver margem
        updatedGordonStake = Math.max(0, updatedGordonStake - 4);
        outcomeMessage = 'O Pára-quedas Dourado encareceu a aquisição em R$ 25M. Gordon recuou temporariamente, mas analistas da B3 criticaram duramente o conflito de agência dos executivos!';
        break;

      case 'crown_jewel':
        // Desfaz-se do atrativo
        updatedGordonStake = Math.round(updatedGordonStake * 0.5);
        outcomeMessage = 'A Joia da Coroa foi transferida para nosso parceiro estratégico. Sem o ativo chave de IA, Gordon abortou a maior parte das ordens de compra!';
        break;

      case 'white_knight':
        // Cavaleiro Branco compra 25%
        updatedFriendlyStake += 25;
        updatedGordonStake = Math.min(15, updatedGordonStake);
        outcomeMessage = 'O Cavaleiro Branco (White Knight) entrou na disputa e comprou 25% das ações em circulação! Juntos, o bloco de controle tem mais de 65% dos votos!';
        break;

      case 'people_pill':
        updatedGordonStake = Math.round(updatedGordonStake * 0.6);
        outcomeMessage = 'Pacto de renúncia assinado por 100% dos líderes de tecnologia. Gordon hesitou diante do risco de colapso operacional da plataforma!';
        break;

      case 'pacman_defense':
        updatedGordonStake = 0;
        updatedFriendlyStake += 10;
        outcomeMessage = 'Pac-Man Defense implacável! Lançamos uma contra-oferta fulminante e forçamos Gordon a capitular e vender suas ações com prejuízo!';
        break;
    }

    const freeFloat = Math.max(0, 100 - updatedGordonStake - updatedFriendlyStake);
    const gordonDefeated = updatedGordonStake < 12 || updatedFriendlyStake >= 55;

    return {
      success: true,
      card,
      cashSpent: card.costCash,
      governanceChange: card.governanceDelta,
      updatedGordonStake,
      updatedFriendlyStake,
      freeFloat,
      gordonDefeated,
      outcomeMessage
    };
  }
}
