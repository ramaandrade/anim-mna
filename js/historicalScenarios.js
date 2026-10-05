/**
 * historicalScenarios.js
 * Cenários Históricos Reais e Tendências Macroeconômicas (2025/2026)
 * Caso Sadia vs Perdigão (2006-2011) & A Era dos Juros Altos e Tech M&A no Brasil
 */

export const HISTORICAL_SCENARIOS = [
  {
    id: 'sadia_perdigao_2006',
    title: 'Caso Histórico: Sadia vs. Perdigão (2006-2011)',
    badge: 'História do Mercado Brasileiro',
    badgeClass: 'badge-purple',
    icon: '🍗',
    summary: 'A lendária tentativa de OPA hostil que virou um caso clássico de takeover, crise de derivativos cambiais e remédios antitruste do CADE!',
    timeline: [
      {
        year: '2006',
        phase: '1. O Ataque Hostil da Sadia',
        desc: 'A Sadia surpreendeu o mercado ao lançar a primeira grande Oferta Pública de Aquisição (OPA) hostil do Brasil para comprar a Perdigão por cerca de R$ 3,7 bilhões com prêmio tentador aos acionistas da Bovespa.',
        concept: 'Takeover Hostil & Tender Offer'
      },
      {
        year: '2006',
        phase: '2. A Resistência da Perdigão',
        desc: 'O Conselho da Perdigão e os grandes fundos de pensão (Previ, Petros) articularam uma defesa feroz, alegando que a oferta subavaliava a empresa. A Sadia foi forçada a recuar.',
        concept: 'Shark Repellents & Alianças de Governança'
      },
      {
        year: '2008',
        phase: '3. A Crise dos Derivativos Cambiais',
        desc: 'Com a quebra do Lehman Brothers e disparada do dólar, a Sadia amargou perdas de R$ 2,5 bilhões em operações arriscadas com derivativos cambiais, entrando em séria crise de liquidez.',
        concept: 'Risco de Liquidez & Insolvência'
      },
      {
        year: '2009',
        phase: '4. A Fusão que Criou a BRF',
        desc: 'Em posição invertida, Perdigão e Sadia selaram um acordo amigável de união, unificando operações para criar a gigante global Brasil Foods (BRF).',
        concept: 'Fusão Horizontal em Grande Escala'
      },
      {
        year: '2011',
        phase: '5. O Escrutínio e Remédios do CADE',
        desc: 'Como o HHI disparou para níveis quase monopolistas em vários segmentos (presuntos, lasanhas, linguiças), o CADE exigiu a venda de marcas históricas (Rezende, Wilson) e desinvestimento de fábricas para concorrentes (Marfrig).',
        concept: 'Remédios Estruturais Antitruste (CADE)'
      }
    ],
    interactiveChoices: [
      {
        id: 'choice_hostile_push',
        label: 'Agressividade Máxima (Sadia 2006)',
        description: 'Tentar comprar as ações na marra mesmo com a oposição do Conselho da concorrente.',
        outcome: 'A hostilidade mobiliza acionistas minoritários contra a oferta e desgasta a imagem institucional na CVM.'
      },
      {
        id: 'choice_friendly_merger',
        label: 'Acordo Amigável com Remédios (BRF 2009/2011)',
        description: 'Construir uma fusão negociada e aceitar previamente vender marcas secundárias ao CADE.',
        outcome: 'Cria a maior companhia de alimentos com aval regulatório e sinergias anuais superiores a R$ 1 bilhão!'
      }
    ]
  },
  {
    id: 'macro_tech_2025_2026',
    title: 'Tendência Atual: M&A Tech sob Selic Alta (2025/2026)',
    badge: 'Cenário Macroeconômico Atual',
    badgeClass: 'badge-info',
    icon: '⚡',
    summary: 'Com a taxa básica de juros em patamares elevados (Selic 10,75% a 12%+), a captação de dívida é cara e a janela de IPOs está restrita. M&A torna-se o motor número 1 de crescimento e consolidação no Brasil.',
    keyInsights: [
      {
        topic: 'Liderança do Setor Tech',
        detail: 'Segundo dados da PwC e KPMG de 2024 a 2026, empresas de tecnologia lideram com folga as transações de M&A no Brasil, especialmente softwares B2B, automação e inteligência artificial.'
      },
      {
        topic: 'Estratégia de Consolidação (Roll-up)',
        detail: 'Startups capitalizadas estão comprando concorrentes menores com "discount to fair value", gerando poder de barganha e eliminando custos fixos duplicados de servidores e equipe.'
      },
      {
        topic: 'M&A como Financiamento Alternativo',
        detail: 'Para empresas em estágio de crescimento, ser adquirida ou fundir-se com um player listado em bolsa tornou-se a melhor alternativa à falta de liquidez no mercado de venture capital.'
      }
    ],
    macroEffects: {
      selicRate: 11.25,
      creditCost: 'Alto (+15.5% a.a.)',
      techTransactionDominance: '42% do volume de M&A nacional',
      strategicRecommendation: 'Priorize fusões verticais que reduzem despesas imediatas ou fusões horizontais com forte ganho de margem operacional.'
    }
  }
];
