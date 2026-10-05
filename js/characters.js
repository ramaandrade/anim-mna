/**
 * characters.js
 * Os Agentes do Mercado Corporativo em AnimM&A:
 * 1. Tubarão Gordon (O Agressor / Takeover Hostil)
 * 2. Dra. Defesa (A Advogada Societária / Defesas Societárias)
 * 3. Inspetor CADE (O Regulador / Defesa da Concorrência)
 */

export const CHARACTERS = {
  gordon: {
    id: 'gordon',
    name: 'Tubarão Gordon',
    role: 'O Agressor Financeiro',
    title: 'Predador de Wall Street & B3',
    themeColor: '#ef4444',
    bgGradient: 'linear-gradient(135deg, #450a0a, #7f1d1d)',
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="char-avatar-svg" aria-label="Tubarão Gordon">
        <circle cx="50" cy="50" r="48" fill="#1e1b4b" stroke="#ef4444" stroke-width="3"/>
        <!-- Corpo do Tubarão -->
        <path d="M50 15 C30 25 22 50 25 78 C35 88 65 88 75 78 C78 50 70 25 50 15 Z" fill="#64748b"/>
        <!-- Guelras -->
        <path d="M30 52 C33 54 33 58 30 60 M27 50 C30 52 30 56 27 58" stroke="#334155" stroke-width="2" stroke-linecap="round"/>
        <path d="M70 52 C67 54 67 58 70 60 M73 50 C70 52 70 56 73 58" stroke="#334155" stroke-width="2" stroke-linecap="round"/>
        <!-- Barbatana dorsal/topo -->
        <path d="M48 10 L52 10 L56 22 L44 22 Z" fill="#475569"/>
        <!-- Olhos afiados -->
        <ellipse cx="38" cy="40" rx="6" ry="5" fill="#fef08a"/>
        <polygon points="37,37 41,40 37,43" fill="#0f172a"/>
        <ellipse cx="62" cy="40" rx="6" ry="5" fill="#fef08a"/>
        <polygon points="63,37 59,40 63,43" fill="#0f172a"/>
        <!-- Sobrancelhas franzidas -->
        <path d="M32 35 L44 38" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M68 35 L56 38" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Boca com dentes pontiagudos de predador -->
        <path d="M32 60 Q50 76 68 60 Q50 64 32 60 Z" fill="#991b1b"/>
        <!-- Dentes em zig-zag -->
        <polygon points="34,60 38,65 42,60 46,65 50,60 54,65 58,60 62,65 66,60" fill="#ffffff"/>
        <!-- Terno risca de giz & gravata vermelha -->
        <path d="M26 78 L38 88 L50 80 L62 88 L74 78 C70 94 30 94 26 78 Z" fill="#090d16"/>
        <polygon points="46,80 54,80 52,98 48,98" fill="#ef4444"/>
      </svg>
    `,
    badge: 'Takeover Hostil',
    description: 'Um predador corporativo que busca empresas ineficientes para fazer ofertas não solicitadas diretamente aos acionistas. Ele atua como um mecanismo externo de governança.',
    economicRole: 'Mecanismo Externo de Governança: Força gestores a serem produtivos sob o risco iminente de destituição do controle.',
    catchphrases: {
      onboarding: '“O mercado é uma selva, jovem CEO. Se o seu valuation estiver barato, eu compro seu Conselho de Administração antes do almoço!”',
      attackStart: '“Seus resultados do último trimestre foram decepcionantes. Protocolamos uma OPA hostil com 35% de prêmio direto na B3!”',
      poisonHit: '“Droga! Vocês ativaram uma Poison Pill e diluíram meu fundo! Essa vitória foi da sua assessoria jurídica, mas voltarei...”',
      gordonVictory: '“Mais de 51% das ações aceitaram minha oferta! Reúna seus pertences: a presidência agora pertence ao Fundo Gordon Predator.”'
    }
  },

  defesa: {
    id: 'defesa',
    name: 'Dra. Defesa',
    role: 'A Advogada Societária',
    title: 'Especialista em Blindagem de Governança',
    themeColor: '#a855f7',
    bgGradient: 'linear-gradient(135deg, #2e1065, #581c87)',
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="char-avatar-svg" aria-label="Dra. Defesa">
        <circle cx="50" cy="50" r="48" fill="#1e1b4b" stroke="#a855f7" stroke-width="3"/>
        <!-- Cabelo sofisticado -->
        <path d="M22 48 C20 20 80 20 78 48 C78 68 82 82 72 85 C62 88 38 88 28 85 C18 82 22 68 22 48 Z" fill="#312e81"/>
        <!-- Rosto -->
        <ellipse cx="50" cy="46" rx="20" ry="22" fill="#fed7aa"/>
        <!-- Franja elegante -->
        <path d="M30 32 Q50 38 68 30 Q54 44 30 32 Z" fill="#1e1b4b"/>
        <!-- Óculos inteligentes roxos -->
        <rect x="34" y="40" width="13" height="9" rx="3" fill="none" stroke="#a855f7" stroke-width="2.5"/>
        <rect x="53" y="40" width="13" height="9" rx="3" fill="none" stroke="#a855f7" stroke-width="2.5"/>
        <line x1="47" y1="44" x2="53" y2="44" stroke="#a855f7" stroke-width="2"/>
        <!-- Olhos expressivos -->
        <circle cx="40.5" cy="44.5" r="2.5" fill="#1e1b4b"/>
        <circle cx="59.5" cy="44.5" r="2.5" fill="#1e1b4b"/>
        <!-- Sorriso confiante -->
        <path d="M43 56 Q50 61 57 56" fill="none" stroke="#9a3412" stroke-width="2" stroke-linecap="round"/>
        <!-- Blazer corporativo com lapela índigo -->
        <path d="M25 80 L38 68 L50 78 L62 68 L75 80 L80 98 L20 98 Z" fill="#4338ca"/>
        <!-- Broche de ouro do estatuto societário -->
        <circle cx="36" cy="74" r="3" fill="#fbbf24"/>
        <!-- Camisa de seda -->
        <polygon points="46,68 54,68 50,78" fill="#f8fafc"/>
      </svg>
    `,
    badge: 'Táticas de Defesa',
    description: 'Estrategista societária de alto escalão com arsenal de poison pills, shark repellents e cavaleiros brancos para defender o controle da empresa.',
    economicRole: 'Direito Societário & Teoria da Agência: Oferece defesas indispensáveis, mas alerta sobre os riscos de entrincheiramento e conflito de interesse com os acionistas.',
    catchphrases: {
      onboarding: '“Como sua consultora societária, lembre-se: uma empresa sem cláusulas de proteção estatutária é uma presa fácil. Mas cuidado com o conflito de agência!”',
      sharkAlert: '“Alerta vermelho! O Tubarão Gordon iniciou uma investida hostil. Veja nosso arsenal no menu de Defesas: temos Poison Pills e White Knights à disposição!”',
      agencyWarning: '“Atenção: usar o Pára-quedas Dourado (Golden Parachute) protegerá seus rendimentos, mas acionistas e analistas de ESG vão punir sua nota de governança!”',
      defenseSuccess: '“Manobra jurídica executada com maestria! O estatuto social resistiu e a governança prevaleceu.”'
    }
  },

  cade: {
    id: 'cade',
    name: 'Inspetor CADE',
    role: 'O Regulador Antitruste',
    title: 'Fiscal da Concorrência & Mercado',
    themeColor: '#0284c7',
    bgGradient: 'linear-gradient(135deg, #082f49, #0369a1)',
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="char-avatar-svg" aria-label="Inspetor CADE">
        <circle cx="50" cy="50" r="48" fill="#082f49" stroke="#0284c7" stroke-width="3"/>
        <!-- Cabeça e Queixo sério -->
        <path d="M30 40 C30 22 70 22 70 40 L70 54 C70 68 50 74 50 74 C50 74 30 68 30 54 Z" fill="#ffedd5"/>
        <!-- Cabelo grisalho distinto -->
        <path d="M28 36 C28 18 72 18 72 36 C72 40 68 32 50 32 C32 32 28 40 28 36 Z" fill="#94a3b8"/>
        <!-- Olhos analíticos -->
        <circle cx="41" cy="42" r="3" fill="#0f172a"/>
        <circle cx="59" cy="42" r="3" fill="#0f172a"/>
        <!-- Sobrancelhas de fiscal exigente -->
        <path d="M36 37 L46 39" stroke="#334155" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M64 37 L54 39" stroke="#334155" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Bigode e boca firme -->
        <path d="M38 52 Q50 56 62 52" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
        <line x1="45" y1="58" x2="55" y2="58" stroke="#991b1b" stroke-width="2" stroke-linecap="round"/>
        <!-- Uniforme oficial com distintivo CADE / Balança -->
        <path d="M22 80 L36 68 L50 74 L64 68 L78 80 L84 98 L16 98 Z" fill="#1e293b"/>
        <!-- Distintivo dourado da concorrência -->
        <polygon points="50,78 55,84 53,90 47,90 45,84" fill="#38bdf8" stroke="#0284c7" stroke-width="1"/>
      </svg>
    `,
    badge: 'Defesa da Concorrência',
    description: 'Fiscal rigoroso do Conselho Administrativo de Defesa Econômica (CADE). Ele avalia o poder de mercado, barreiras à entrada e a variação do índice HHI.',
    economicRole: 'Lei Antitruste (Lei 12.529/2011): Garante a rivalidade do mercado, combate práticas anticompetitivas e preserva o bem-estar da sociedade e dos consumidores.',
    catchphrases: {
      onboarding: '“O CADE existe para assegurar que a livre concorrência prospere. Fusões verticais passam fácil; mas tente uma fusão horizontal que calcularei o HHI no detalhe!”',
      hhiWarning: '“Alerta de concentração! Seu HHI pós-operação ultrapassará 2.500 pontos com variação superior a 200. Sem remédios estruturais, esta fusão será VETADA!”',
      approvedSummary: '“Análise técnica concluída: mercado com ampla rivalidade. Operação aprovada pelo rito sumário.”',
      remedyEnforced: '“Aprovamos a transação mediante celebração de ACC (Acordo em Controle de Concentrações): você deverá desinvestir de marcas e ativos para um concorrente!”'
    }
  }
};
