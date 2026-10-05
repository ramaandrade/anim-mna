/**
 * mnaEngine.js
 * Mecânica de Expansão e Fusões & Aquisições (M&A)
 * Suporte aos tipos: Horizontal, Vertical e Conglomerado
 */

export const MNA_TYPES = {
  HORIZONTAL: {
    key: 'HORIZONTAL',
    label: 'Fusão Horizontal',
    icon: '⚔️',
    color: '#ef4444',
    badgeClass: 'badge-danger',
    description: 'Combinação entre concorrentes diretos no mesmo elo da cadeia produtiva.',
    benefits: 'Economia de escala, eliminação de duplicação de custos e maior poder de mercado.',
    risks: 'Forte escrutínio antitruste pelo CADE (cálculo de HHI e risco de cartelização/monopólio).',
    economicTheory: 'Teoria do Poder de Mercado vs. Eficiência Produtiva (Williamson Tradeoff).'
  },
  VERTICAL: {
    key: 'VERTICAL',
    label: 'Fusão Vertical',
    icon: '⛓️',
    color: '#3b82f6',
    badgeClass: 'badge-info',
    description: 'Aquisição de elos da cadeia de suprimentos (fornecedores a montante ou canais a jusante).',
    benefits: 'Eliminação da margem dupla (double marginalization), garantia de insumos críticos e redução de custos de transação.',
    risks: 'Rigidez operacional, obsolescência tecnológica interna e risco de foreclosure (fechamento de mercado aos rivais).',
    economicTheory: 'Teoria dos Custos de Transação (Ronald Coase & Oliver Williamson).'
  },
  CONGLOMERADO: {
    key: 'CONGLOMERADO',
    label: 'Fusão por Conglomerado',
    icon: '🌐',
    color: '#8b5cf6',
    badgeClass: 'badge-purple',
    description: 'União entre empresas de mercados distintos e não correlacionados.',
    benefits: 'Diversificação de receita, estabilidade de fluxo de caixa em ciclos de crise e sinergias financeiras.',
    risks: 'Desconto de conglomerado (mercado pune a falta de foco) e assimetria de know-how gerencial.',
    economicTheory: 'Teoria da Carteira Corporativa e Teoria da Agência na Alocação de Capital Interno.'
  }
};

export class MNAEngine {
  /**
   * Catálogo de oportunidades disponíveis para o jogador no mercado
   */
  static getAvailableTargets() {
    return [
      {
        id: 'target_vertical_cloud',
        name: 'CloudData Infra & Servidores',
        sector: 'Infraestrutura em Nuvem & Datacenters',
        type: 'VERTICAL',
        description: 'Principal fornecedora dos servidores e APIs da sua plataforma.',
        marketCap: 45,
        purchaseCost: 35,
        targetShare: 0, // Não concorre diretamente no produto final
        annualSynergies: 14,
        integrationCost: 8,
        governanceImpact: +5,
        requiresCADEApproval: false,
        summary: 'Elimina margem dupla de fornecedor e reduz custos operacionais em 22%.',
        conceptExplanation: 'Fusão Vertical a montante (upstream): ao internalizar a infraestrutura, a empresa corta despesas com margens de terceiros e garante uptime exclusivo.'
      },
      {
        id: 'target_horizontal_vanguard',
        name: 'Vanguard Tech Soluções',
        sector: 'SaaS Corporativo & CRM (Concorrente Direto)',
        type: 'HORIZONTAL',
        description: 'Sua rival mais agressiva no mercado de software corporativo no Brasil.',
        marketCap: 90,
        purchaseCost: 75,
        targetShare: 18,
        annualSynergies: 28,
        integrationCost: 18,
        governanceImpact: -2,
        requiresCADEApproval: true,
        summary: 'Domínio de mercado e sinergia agressiva, mas colocará o CADE em alerta máximo!',
        conceptExplanation: 'Fusão Horizontal: expande participação de mercado para patamar dominante, desencadeando teste obrigatório de HHI pelo CADE.'
      },
      {
        id: 'target_conglomerate_fintech',
        name: 'PayExpress Instituição de Pagamento',
        sector: 'Fintech de Crédito & Liquidação',
        type: 'CONGLOMERADO',
        description: 'Empresa do setor financeiro com licença regulada no Banco Central.',
        marketCap: 60,
        purchaseCost: 50,
        targetShare: 4,
        annualSynergies: 16,
        integrationCost: 12,
        governanceImpact: +2,
        requiresCADEApproval: false,
        summary: 'Diversifica receitas com serviços financeiros embutidos (embedded finance).',
        conceptExplanation: 'Fusão por Conglomerado: cruza bases de clientes entre software e pagamentos, gerando cross-selling sem gerar monopólio no setor de software.'
      },
      {
        id: 'target_vertical_logistics',
        name: 'LogiFast Distribuição & Entregas',
        sector: 'Logística de Última Milha',
        type: 'VERTICAL',
        description: 'Rede de entrega e fulfilment para o ecossistema.',
        marketCap: 38,
        purchaseCost: 30,
        targetShare: 0,
        annualSynergies: 10,
        integrationCost: 6,
        governanceImpact: +3,
        requiresCADEApproval: false,
        summary: 'Integração a jusante (downstream) para acelerar entregas físicas.',
        conceptExplanation: 'Verticalização para controlar o canal de entrega direta ao cliente, garantindo SLAs superiores.'
      },
      {
        id: 'target_horizontal_omni',
        name: 'OmniCode Enterprise',
        sector: 'Software de Gestão Empresarial (ERP Concorrente)',
        type: 'HORIZONTAL',
        description: 'Empresa tradicional de ERP com grande base de indústrias médias.',
        marketCap: 110,
        purchaseCost: 95,
        targetShare: 22,
        annualSynergies: 35,
        integrationCost: 24,
        governanceImpact: -5,
        requiresCADEApproval: true,
        summary: 'Mega-fusão no setor de ERP! Risco severo de veto se não houver desinvestimento.',
        conceptExplanation: 'Fusão Horizontal pesada: concentração de mercado ultrapassará 40%, gerando obrigação de submissão prévia (gun jumping proibido pela Lei 12.529/11).'
      }
    ];
  }

  /**
   * Avalia a transação de M&A frente ao estado financeiro do jogador
   */
  static evaluateTransaction(playerState, targetId, fundingMethod = 'CASH') {
    const target = this.getAvailableTargets().find(t => t.id === targetId);
    if (!target) {
      return { success: false, reason: 'Alvo não encontrado no mercado.' };
    }

    const typeConfig = MNA_TYPES[target.type];
    const totalRequired = target.purchaseCost + target.integrationCost;

    if (fundingMethod === 'CASH') {
      if (playerState.cash < totalRequired) {
        return {
          success: false,
          target,
          typeConfig,
          canAfford: false,
          deficit: totalRequired - playerState.cash,
          reason: `Caixa insuficiente (R$ ${playerState.cash}M disponível vs R$ ${totalRequired}M necessário). Considere emitir ações ou obter financiamento.`
        };
      }
    }

    // Calcula valor criado esperado
    // Valor pós = Valor pré + Valor do Alvo + VPL Sinergias (Sinergias / Taxa de Desconto de ~12%) - Custo
    const discountRate = 0.12;
    const synergyNPV = Math.round(target.annualSynergies / discountRate);
    const netValueCreated = synergyNPV - (target.purchaseCost + target.integrationCost);

    return {
      success: true,
      target,
      typeConfig,
      canAfford: true,
      totalRequired,
      synergyNPV,
      netValueCreated,
      newShare: playerState.marketShare + target.targetShare,
      isHorizontal: target.type === 'HORIZONTAL',
      requiresCADE: target.requiresCADEApproval
    };
  }

  /**
   * Executa a transação no estado do jogador
   */
  static executeMerger(playerState, target, fundingMethod = 'CASH', remedyShareGiven = 0) {
    const totalCost = target.purchaseCost + target.integrationCost;
    const discountRate = 0.12;
    const synergyNPV = Math.round(target.annualSynergies / discountRate);

    // Ajusta caixa ou alavancagem
    let cashChange = -totalCost;
    let debtChange = 0;
    let dilution = 0;

    if (fundingMethod === 'STOCK') {
      cashChange = -target.integrationCost;
      dilution = Math.round((target.purchaseCost / (playerState.marketCap + target.purchaseCost)) * 100);
    } else if (fundingMethod === 'DEBT') {
      cashChange = -target.integrationCost;
      debtChange = target.purchaseCost;
    }

    const netShareGain = Math.max(0, target.targetShare - remedyShareGiven);

    // Novo Market Cap estimado
    const marketCapGain = Math.round(target.marketCap * 0.8 + (synergyNPV * 0.5));

    return {
      cashChange,
      debtChange,
      dilution,
      marketShareChange: netShareGain,
      marketCapChange: marketCapGain,
      governanceChange: target.governanceImpact - (remedyShareGiven > 0 ? 0 : 0),
      annualProfitBoost: target.annualSynergies,
      targetAcquired: target
    };
  }
}
