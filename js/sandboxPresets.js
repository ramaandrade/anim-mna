/**
 * sandboxPresets.js
 * Cenários Pré-Configurados e Casos Reais para o Modo Sandbox Livre
 * Baseado em jurisprudência do CADE e conjuntura de mercado 2025/2026
 */

export const SANDBOX_PRESETS = {
  tech_2025: {
    id: 'tech_2025',
    title: '💻 Tech B3 (NexTech 2025)',
    tag: 'Tecnologia Corporativa',
    description: 'Cenário base da NexTech com juros elevados e forte consolidação no setor de software SaaS.',
    historicalFact: 'Em ciclos de juros altos (Selic > 11%), o M&A substitui dívidas bancárias e acelera ganhos de escala.',
    defaultAcquirerId: 'c1',
    defaultTargetId: 'c2',
    companies: [
      { id: 'c1', name: 'NexTech Brasil', share: 22, color: '#38bdf8' },
      { id: 'c2', name: 'Vanguard Tech', share: 18, color: '#ef4444' },
      { id: 'c3', name: 'Alpha SaaS', share: 16, color: '#a855f7' },
      { id: 'c4', name: 'Beta Cloud', share: 14, color: '#10b981' },
      { id: 'c5', name: 'OmniCode Enterprise', share: 12, color: '#f59e0b' },
      { id: 'c6', name: 'Outros Menores', share: 18, color: '#64748b' }
    ]
  },

  sadia_perdigao: {
    id: 'sadia_perdigao',
    title: '🍗 Sadia vs Perdigão (BRF)',
    tag: 'Alimentos / Proteína Animal',
    description: 'Fusão histórica entre as duas maiores concorrentes brasileiras de alimentos processados e avicultura.',
    historicalFact: 'O CADE aprovou a BRF sob rígidos remédios estruturais: suspensão temporária de marcas líderes e venda de fábricas para rivais.',
    defaultAcquirerId: 'c1',
    defaultTargetId: 'c2',
    companies: [
      { id: 'c1', name: 'Sadia S.A.', share: 38, color: '#f59e0b' },
      { id: 'c2', name: 'Perdigão S.A.', share: 30, color: '#ef4444' },
      { id: 'c3', name: 'Seara Alimentos', share: 12, color: '#10b981' },
      { id: 'c4', name: 'Aurora Coop', share: 10, color: '#a855f7' },
      { id: 'c5', name: 'Outros Frigoríficos', share: 10, color: '#64748b' }
    ]
  },

  ambev: {
    id: 'ambev',
    title: '🍺 Brahma + Antarctica (Ambev)',
    tag: 'Cervejarias / Bebidas',
    description: 'Criação da primeira grande "campeã nacional" cervejeira, reunindo mais de 70% do consumo no país.',
    historicalFact: 'Para evitar duopólio com a Kaiser, o CADE impôs a venda obrigatória da marca Bavária e de 5 complexos industriais.',
    defaultAcquirerId: 'c1',
    defaultTargetId: 'c2',
    companies: [
      { id: 'c1', name: 'Cia. Cervejaria Brahma', share: 50, color: '#f59e0b' },
      { id: 'c2', name: 'Cia. Antarctica Paulista', share: 22, color: '#38bdf8' },
      { id: 'c3', name: 'Cervejaria Kaiser', share: 14, color: '#10b981' },
      { id: 'c4', name: 'Schincariol', share: 9, color: '#ef4444' },
      { id: 'c5', name: 'Cervejas Artesanais', share: 5, color: '#64748b' }
    ]
  },

  oi_movel: {
    id: 'oi_movel',
    title: '📱 Fatiamento da Oi Móvel',
    tag: 'Telecomunicações',
    description: 'Aquisição conjunta dos ativos móveis da Oi por TIM, Vivo e Claro em plano de Recuperação Judicial.',
    historicalFact: 'O CADE aprovou com remédios comportamentais de atacado: oferta compulsória de roaming e acesso a torres para novos concorrentes.',
    defaultAcquirerId: 'c1',
    defaultTargetId: 'c2',
    companies: [
      { id: 'c1', name: 'Telefônica (Vivo)', share: 33, color: '#a855f7' },
      { id: 'c2', name: 'Oi Móvel (Alvo RJ)', share: 15, color: '#f59e0b' },
      { id: 'c3', name: 'Claro Brasil', share: 28, color: '#ef4444' },
      { id: 'c4', name: 'TIM Brasil', share: 24, color: '#38bdf8' }
    ]
  },

  competitive: {
    id: 'competitive',
    title: '⚖️ Concorrência Fragmentada',
    tag: 'Mercado Desconcentrado',
    description: 'Mercado com múltiplos concorrentes de porte similar e livre entrada de novos agentes.',
    historicalFact: 'Com HHI < 1.500 pontos, fusões são avaliadas pelo Rito Sumário (Lei 12.529/2011) sem necessidade de termo de compromisso.',
    defaultAcquirerId: 'c1',
    defaultTargetId: 'c2',
    companies: [
      { id: 'c1', name: 'Empresa Alfa', share: 15, color: '#38bdf8' },
      { id: 'c2', name: 'Empresa Beta', share: 14, color: '#ef4444' },
      { id: 'c3', name: 'Empresa Gama', share: 13, color: '#10b981' },
      { id: 'c4', name: 'Empresa Delta', share: 12, color: '#f59e0b' },
      { id: 'c5', name: 'Empresa Épsilon', share: 12, color: '#a855f7' },
      { id: 'c6', name: 'Empresa Zeta', share: 11, color: '#06b6d4' },
      { id: 'c7', name: 'Outros Players', share: 23, color: '#64748b' }
    ]
  }
};
