/**
 * hhiEngine.js
 * Motor de Cálculo do Índice Herfindahl-Hirschman (HHI) e Análise Antitruste (CADE)
 * Baseado nas diretrizes do Conselho Administrativo de Defesa Econômica (CADE)
 */

export const CADE_THRESHOLDS = {
  UNCONCENTRATED_MAX: 1500, // < 1500: Pouco concentrado
  MODERATE_MAX: 2500,       // 1500 a 2500: Moderadamente concentrado
  DELTA_LOW: 100,           // Delta < 100: Baixa preocupação
  DELTA_HIGH: 200           // Delta > 200: Preocupação concorrencial relevante se HHI > 2500
};

export class HHIEngine {
  /**
   * Calcula o HHI dado um array de fatias de mercado (shares percentuais entre 0 e 100).
   * HHI = sum(s_i ^ 2)
   * @param {number[]} marketShares - Ex: [30, 25, 20, 15, 10]
   * @returns {number} HHI arredondado
   */
  static calculateHHI(marketShares) {
    if (!marketShares || !Array.isArray(marketShares)) return 0;
    const hhi = marketShares.reduce((acc, share) => {
      const s = Number(share) || 0;
      return acc + (s * s);
    }, 0);
    return Math.round(hhi);
  }

  /**
   * Calcula a variação de HHI resultante da fusão entre duas empresas A e B:
   * Delta HHI = (s_A + s_B)^2 - (s_A^2 + s_B^2) = 2 * s_A * s_B
   * @param {number} shareA 
   * @param {number} shareB 
   * @returns {number}
   */
  static calculateDeltaHHI(shareA, shareB) {
    const sA = Number(shareA) || 0;
    const sB = Number(shareB) || 0;
    return Math.round(2 * sA * sB);
  }

  /**
   * Simula a fusão horizontal no mercado e retorna o novo HHI e a variação
   * @param {Array<{id: string, name: string, share: number}>} companies 
   * @param {string} acquirerId 
   * @param {string} targetId 
   * @param {number} remedyDisinvestment - % de market share cedido/desinvestido como remédio antitruste
   */
  static simulateMerger(companies, acquirerId, targetId, remedyDisinvestment = 0) {
    const preShares = companies.map(c => c.share);
    const preHHI = this.calculateHHI(preShares);

    const acquirer = companies.find(c => c.id === acquirerId);
    const target = companies.find(c => c.id === targetId);

    if (!acquirer || !target) {
      return {
        preHHI,
        postHHI: preHHI,
        deltaHHI: 0,
        combinedShare: acquirer ? acquirer.share : 0,
        analysis: this.evaluateCADEVerdict(preHHI, 0, acquirer ? acquirer.share : 0)
      };
    }

    const netTargetShare = Math.max(0, target.share - remedyDisinvestment);
    const combinedShare = acquirer.share + netTargetShare;

    // Constrói nova distribuição de mercado
    const postCompanies = companies
      .filter(c => c.id !== acquirerId && c.id !== targetId)
      .map(c => ({ ...c }));

    postCompanies.push({
      id: acquirer.id,
      name: `${acquirer.name} + ${target.name}`,
      share: combinedShare
    });

    if (remedyDisinvestment > 0) {
      postCompanies.push({
        id: 'competitor_remedy',
        name: 'Novos Concorrentes (Remédio CADE)',
        share: remedyDisinvestment
      });
    }

    const postShares = postCompanies.map(c => c.share);
    const postHHI = this.calculateHHI(postShares);
    const deltaHHI = postHHI - preHHI;

    const verdict = this.evaluateCADEVerdict(postHHI, deltaHHI, combinedShare, remedyDisinvestment);

    return {
      preHHI,
      postHHI,
      deltaHHI,
      combinedShare,
      postCompanies,
      remedyApplied: remedyDisinvestment > 0,
      remedyDisinvestment,
      analysis: verdict
    };
  }

  /**
   * Avalia o parecer do CADE com base nos critérios oficiais da Lei 12.529/2011 e Guia HHI
   */
  static evaluateCADEVerdict(postHHI, deltaHHI, combinedShare, remedyDisinvestment = 0) {
    // 1. Mercado Desconcentrado (HHI < 1500)
    if (postHHI < CADE_THRESHOLDS.UNCONCENTRATED_MAX) {
      return {
        status: 'APROVADO_SUMARIO',
        badge: 'Aprovado (Rito Sumário)',
        badgeClass: 'badge-success',
        color: '#10b981',
        title: 'Operação Aprovada sem Restrições pelo CADE',
        inspectorQuote: 'Mercado com ampla concorrência. Rito sumário aprovado em prazo recorde!',
        explanation: 'Com HHI inferior a 1.500 pontos, o mercado é considerado desconcentrado. Não há presunção de poder de mercado nem risco de fechamento.',
        riskLevel: 'Baixo',
        canPass: true,
        remedyNeeded: false
      };
    }

    // 2. Mercado Moderadamente Concentrado (1500 <= HHI <= 2500)
    if (postHHI <= CADE_THRESHOLDS.MODERATE_MAX) {
      if (deltaHHI < CADE_THRESHOLDS.DELTA_LOW) {
        return {
          status: 'APROVADO_NORMAL',
          badge: 'Aprovado sem Restrições',
          badgeClass: 'badge-success',
          color: '#10b981',
          title: 'Operação Aprovada pelo Tribunal do CADE',
          inspectorQuote: 'A variação de concentração é inferior a 100 pontos. Baixa preocupação concorrencial.',
          explanation: 'O mercado é moderadamente concentrado, mas o acréscimo de concentração (Delta HHI < 100) não altera substancialmente a rivalidade do setor.',
          riskLevel: 'Baixo a Moderado',
          canPass: true,
          remedyNeeded: false
        };
      } else {
        return {
          status: 'ALERTA_MONITORAMENTO',
          badge: 'Aprovado sob Monitoramento',
          badgeClass: 'badge-warning',
          color: '#f59e0b',
          title: 'Operação Aprovada sob Observação',
          inspectorQuote: 'A variação superou 100 pontos em mercado moderado. Exigiremos monitoramento de preços.',
          explanation: 'Delta HHI superior a 100 pontos acende luz amarela no CADE. Embora não haja bloqueio imediato, a empresa combinada será acompanhada.',
          riskLevel: 'Moderado',
          canPass: true,
          remedyNeeded: false
        };
      }
    }

    // 3. Mercado Altamente Concentrado (HHI > 2500)
    if (deltaHHI < CADE_THRESHOLDS.DELTA_LOW) {
      return {
        status: 'APROVADO_RESSALVA',
        badge: 'Aprovado com Ressalvas',
        badgeClass: 'badge-warning',
        color: '#f59e0b',
        title: 'Mercado Concentrado, mas Impacto Marginal',
        inspectorQuote: 'Mercado já era concentrado, mas a fatia adquirida foi muito reduzida (Delta < 100).',
        explanation: 'O setor possui alta barreira à entrada, porém a aquisição é de porte insignificante no índice.',
        riskLevel: 'Moderado',
        canPass: true,
        remedyNeeded: false
      };
    }

    if (deltaHHI <= CADE_THRESHOLDS.DELTA_HIGH) {
      if (remedyDisinvestment >= 4) {
        return {
          status: 'APROVADO_COM_REMEDIOS',
          badge: 'Aprovado com Remédios (ACC)',
          badgeClass: 'badge-info',
          color: '#3b82f6',
          title: 'Acordo em Controle de Concentrações (ACC)',
          inspectorQuote: 'O desinvestimento negociado preservou a rivalidade setorial. Operação autorizada.',
          explanation: 'A empresa aceitou vender unidades produtivas e licenciar tecnologia para novos entrantes, mitigando o risco de colusão.',
          riskLevel: 'Controlado via Remédios',
          canPass: true,
          remedyNeeded: true
        };
      }

      return {
        status: 'EXIGE_REMEDIOS',
        badge: 'Impugnação / Exige Remédios',
        badgeClass: 'badge-danger',
        color: '#f97316',
        title: 'CADE Requer Desinvestimento Estrutural',
        inspectorQuote: 'Delta HHI entre 100 e 200 em mercado concentrado gera sérias dúvidas. É necessário ceder ativos!',
        explanation: 'Sem remédios estruturais (venda de divisões, marcas ou capacidade instalada), a operação corre risco iminente de reprovação.',
        riskLevel: 'Alto',
        canPass: false,
        remedyNeeded: true
      };
    }

    // Delta HHI > 200 em mercado > 2500 -> Presunção fortíssima de poder de mercado
    if (remedyDisinvestment >= 8) {
      return {
        status: 'APROVADO_REMEDIO_PESADO',
        badge: 'Aprovado com Desinvestimento Severo',
        badgeClass: 'badge-warning',
        color: '#f59e0b',
        title: 'Aprovado com Venda Ampla de Marcas e Plantas',
        inspectorQuote: 'Mesmo com concentração crítica, o expressivo remédio estrutural viabilizou um terceiro competidor forte.',
        explanation: 'Caso clássico de Remédio Estrutural: a empresa combinada teve que vender linhas de produto inteiras para concorrentes (como no caso Sadia/Perdigão e Chocolates Garoto/Nestlé).',
        riskLevel: 'Alto mitigado',
        canPass: true,
        remedyNeeded: true
      };
    }

    return {
      status: 'REPROVADO_VETO',
      badge: 'Operação Vetada / Bloqueada',
      badgeClass: 'badge-danger',
      color: '#ef4444',
      title: 'Bloqueio Definitivo pelo Tribunal do CADE',
      inspectorQuote: 'Veto sumário! HHI acima de 2.500 com Delta > 200 cria quase-monopólio e elimina a rivalidade de mercado.',
      explanation: 'A operação geraria capacidade abusiva de fixação de preços, redução de incentivos à inovação e barreira insuperável para novas startups no Brasil.',
      riskLevel: 'Crítico / Monopólio Ilegal',
      canPass: false,
      remedyNeeded: true
    };
  }

  /**
   * Explicação didática passo a passo para o estudante
   */
  static getEducationalSummary(preHHI, postHHI, deltaHHI) {
    return {
      formula: 'HHI = Σ (Market Share %)² | ΔHHI = 2 × Share_A × Share_B',
      preHHI,
      postHHI,
      deltaHHI,
      isConcentrated: postHHI > CADE_THRESHOLDS.MODERATE_MAX,
      marketClass: postHHI < 1500 ? 'Pouco Concentrado' : postHHI <= 2500 ? 'Moderadamente Concentrado' : 'Altamente Concentrado',
      mainTakeaway: 'O CADE não proíbe o crescimento empresarial em si, mas veta operações que destroem a rivalidade concorrencial sem repassar ganhos de eficiência aos consumidores.'
    };
  }
}
