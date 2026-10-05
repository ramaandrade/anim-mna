/**
 * gameState.js
 * Gerenciador de Estado Reativo e Persistência de AnimM&A
 */

const STORAGE_KEY = 'anim_mna_saved_state_v1';

const INITIAL_COMPETITORS = [
  { id: 'player_nextech', name: 'NexTech Brasil (Você)', share: 22, color: '#38bdf8' },
  { id: 'target_horizontal_vanguard', name: 'Vanguard Tech', share: 18, color: '#ef4444' },
  { id: 'alpha_saas', name: 'Alpha SaaS Solutions', share: 16, color: '#a855f7' },
  { id: 'beta_cloud', name: 'Beta Cloud Systems', share: 14, color: '#10b981' },
  { id: 'omni_code', name: 'OmniCode Enterprise', share: 12, color: '#f59e0b' },
  { id: 'others', name: 'Outros Menores', share: 18, color: '#64748b' }
];

export class GameState {
  constructor() {
    this.listeners = [];
    this.loadState();
  }

  getDefaultState() {
    return {
      companyName: 'NexTech Brasil S.A.',
      ticker: 'NXTK3',
      sector: 'Tecnologia Corporativa & SaaS B2B',
      year: 2025,
      cash: 120,             // R$ 120 Milhões
      debt: 35,              // R$ 35 Milhões
      marketCap: 340,        // R$ 340 Milhões
      marketShare: 22,       // 22% de market share
      governanceScore: 82,   // 82/100
      friendlyControl: 58,   // 58% das ações ordinárias
      gordonStake: 0,        // 0%
      currentChapter: 1,     // 1 a 7
      activeTab: 'journey',  // 'journey' | 'mna' | 'cade' | 'defense' | 'crisis' | 'history' | 'report'
      completedChapters: [],
      acquisitions: [],
      defensesUsed: [],
      cadeHistory: [],
      inCrisis: false,
      rjApproved: false,
      competitors: JSON.parse(JSON.stringify(INITIAL_COMPETITORS)),
      unlockedBadges: [
        { id: 'badge_ceo_start', title: 'Novo CEO B3', icon: '👔', desc: 'Assumiu o comando da NexTech em 2025.' }
      ],
      logs: [
        { time: 'Início', text: 'Você foi nomeado CEO da NexTech Brasil S.A. Bem-vindo à bolsa!' }
      ]
    };
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.state = JSON.parse(saved);
      } else {
        this.state = this.getDefaultState();
      }
    } catch (e) {
      this.state = this.getDefaultState();
    }
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {}
    this.notify();
  }

  reset() {
    this.state = this.getDefaultState();
    this.saveState();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => cb(this.state));
  }

  update(patch) {
    this.state = { ...this.state, ...patch };
    this.saveState();
  }

  addLog(text) {
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    this.state.logs.unshift({ time, text });
    if (this.state.logs.length > 30) this.state.logs.pop();
    this.saveState();
  }

  unlockBadge(badge) {
    if (!this.state.unlockedBadges.some(b => b.id === badge.id)) {
      this.state.unlockedBadges.push(badge);
      this.addLog(`🏆 Conquista desbloqueada: ${badge.title}`);
      this.saveState();
    }
  }

  setChapter(chapterNum) {
    this.state.currentChapter = Math.max(1, Math.min(7, chapterNum));
    if (!this.state.completedChapters.includes(chapterNum - 1) && chapterNum > 1) {
      this.state.completedChapters.push(chapterNum - 1);
    }
    this.saveState();
  }

  setActiveTab(tabName) {
    this.state.activeTab = tabName;
    this.saveState();
  }
}

export const StateManager = new GameState();
