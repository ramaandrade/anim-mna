/**
 * crisisEngine.js
 * Módulo de Crise Financeira, Choque Macroeconômico (Selic 2025/2026),
 * Falência vs Recuperação Judicial (Lei 11.101/2005) e Distressed M&A
 */

export class CrisisEngine {
  /**
   * Avalia a saúde financeira e risco de insolvência
   */
  static assessInsolvency(playerState) {
    const isNegativeCash = playerState.cash < 0;
    const isOverleveraged = (playerState.debt || 0) > (playerState.marketCap * 0.8);
    const inCrisis = isNegativeCash || isOverleveraged;

    return {
      inCrisis,
      isNegativeCash,
      isOverleveraged,
      cashDeficit: isNegativeCash ? Math.abs(playerState.cash) : 0,
      debtRatio: Math.round(((playerState.debt || 0) / Math.max(1, playerState.marketCap)) * 100)
    };
  }

  /**
   * Opções disponíveis quando a empresa entra em crise aguda de liquidez
   */
  static getCrisisChoices() {
    return [
      {
        id: 'bankruptcy',
        name: 'Decretar Autoevenção / Falência',
        subtitle: 'Liquidação Judicial de Ativos (Art. 75 da Lei 11.101/05)',
        icon: '🛑',
        badge: 'Encerramento Definitivo',
        badgeClass: 'badge-danger',
        description: 'Encerra as atividades da companhia. O juiz nomeia um Administrador Judicial para leiloar bens a preço de liquidação forçada.',
        consequences: 'Perda total do controle da companhia e fim do mandato do CEO. Credores recebem com deságio severo na ordem legal de preferência.',
        educationalTakeaway: 'A falência destrói valor intangível (marca, clientes, capital humano) e gera liquidação a preço vil. Deve ser o último recurso quando a empresa é economicamente inviável.'
      },
      {
        id: 'judicial_recovery',
        name: 'Pedir Recuperação Judicial (RJ)',
        subtitle: 'Reestruturação Supervisionada (Lei 11.101/05 e Lei 14.112/20)',
        icon: '⚖️',
        badge: 'Turnaround & Preservação',
        badgeClass: 'badge-success',
        description: 'Solicita proteção legal contra execuções (Stay Period de 180 dias) e apresenta um Plano de Reestruturação para aprovação dos credores.',
        consequences: 'Protege o caixa imediato, permite renegociar dívidas com deságio (haircut de 40% a 60%) e abre caminho para Distressed M&A através de UPIs.',
        educationalTakeaway: 'O objetivo da Recuperação Judicial é a preservação da empresa economicamente viável, garantindo empregos, circulação de riquezas e arrecadação de tributos.'
      }
    ];
  }

  /**
   * Instrumentos de Distressed M&A disponíveis durante a Recuperação Judicial
   */
  static getRJRestructuringTools() {
    return [
      {
        id: 'sell_upi',
        name: 'Venda de UPI (Unidade Produtiva Isolada)',
        subtitle: 'Alienação de Ativos sem Sucessão de Dívidas',
        icon: '🏭',
        cashInflow: 45,
        debtReduction: 20,
        shareImpact: -3,
        description: 'Vende uma divisão secundária em leilão judicial. Pelo art. 60 da Lei de Falências, o comprador NÃO herda dívidas trabalhistas ou tributárias da vendedora!',
        educationalNote: 'A blindagem da UPI atrai investidores estratégicos de M&A que não comprariam uma empresa endividada com passivos ocultos.'
      },
      {
        id: 'debt_haircut',
        name: 'Plano com Deságio (Haircut) de 50%',
        subtitle: 'Aprovação na Assembleia Geral de Credores (AGC)',
        icon: '✂️',
        cashInflow: 10,
        debtReduction: 60,
        shareImpact: 0,
        description: 'Negociação com bancos e fornecedores quirografários para alongar o pagamento em 10 anos com 2 anos de carência e 50% de desconto na dívida.',
        educationalNote: 'Para os credores, receber 50% em 10 anos é melhor do que receber quase zero no processo falimentar.'
      },
      {
        id: 'dip_financing',
        name: 'DIP Financing (Debtor-in-Possession)',
        subtitle: 'Crédito Novo com Super-Privilégio Legal',
        icon: '💉',
        cashInflow: 35,
        debtReduction: -35,
        shareImpact: +2,
        description: 'Injeção de novo capital por fundos de Special Situations. Esse empréstimo tem prioridade máxima de recebimento caso ocorra falência futura.',
        educationalNote: 'A Lei 14.112/20 fortaleceu o DIP Financing no Brasil, incentivando fundos a financiarem o capital de giro de empresas em recuperação.'
      }
    ];
  }

  /**
   * Executa a escolha de Recuperação Judicial
   */
  static applyRJTool(toolId, playerState) {
    const tool = this.getRJRestructuringTools().find(t => t.id === toolId);
    if (!tool) {
      return { success: false, reason: 'Ferramenta de RJ não encontrada.' };
    }

    const updatedCash = playerState.cash + tool.cashInflow;
    const updatedDebt = Math.max(0, (playerState.debt || 0) - tool.debtReduction);
    const updatedMarketCap = Math.round(playerState.marketCap * 1.15); // Mercado reage positivamente ao plano viável

    return {
      success: true,
      tool,
      cashChange: tool.cashInflow,
      debtReduction: tool.debtReduction,
      updatedCash,
      updatedDebt,
      updatedMarketCap,
      message: `Plano executado com sucesso: ${tool.name}. O caixa recebeu R$ ${tool.cashInflow}M e a dívida foi aliviada!`
    };
  }
}
