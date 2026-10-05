/**
 * ui.js
 * Controlador de Interface de Usuário Mobile-First para AnimM&A
 */

import { StateManager } from './gameState.js';
import { CHARACTERS } from './characters.js';
import { HHIEngine } from './hhiEngine.js';
import { MNAEngine, MNA_TYPES } from './mnaEngine.js';
import { TakeoverEngine, DEFENSE_CARDS } from './takeoverEngine.js';
import { CrisisEngine } from './crisisEngine.js';
import { HISTORICAL_SCENARIOS } from './historicalScenarios.js';
import { ChartRenderer } from './chartRenderer.js';
import { Sound } from './audioEffects.js';

export class UIManager {
  constructor() {
    this.container = document.getElementById('main-flow-content');
    this.topStrip = document.getElementById('mobile-top-strip');
    this.stepperNav = document.getElementById('journey-stepper');
    this.modalContainer = document.getElementById('modal-container');

    // Estado local para simulador HHI interativo
    this.hhiSimData = {
      acquirerId: 'player_nextech',
      targetId: 'target_horizontal_vanguard',
      remedy: 0
    };

    // Estado local para ataque de Gordon
    this.gordonAttackState = null;

    this.initEvents();
    this.render();
  }

  initEvents() {
    StateManager.subscribe(() => {
      this.renderTopStrip();
      this.render();
    });

    // Mute button
    const muteBtn = document.getElementById('mute-btn');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        const isMuted = Sound.toggleMute();
        muteBtn.textContent = isMuted ? '🔇' : '🔊';
        muteBtn.classList.toggle('muted', isMuted);
      });
      muteBtn.textContent = Sound.isMuted ? '🔇' : '🔊';
    }

    // Brand click -> vai para Jornada
    const brandBtn = document.getElementById('brand-home-btn');
    if (brandBtn) {
      brandBtn.addEventListener('click', () => {
        Sound.playClick();
        StateManager.setActiveTab('journey');
      });
    }

    // Bottom Navigation Tabs
    const tabs = document.querySelectorAll('.nav-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        Sound.playClick();
        const tabKey = tab.dataset.tab;
        if (tabKey) {
          StateManager.setActiveTab(tabKey);
          this.updateActiveTabButton(tabKey);
        }
      });
    });

    // Botão de Glossário no Header
    const glossaryBtn = document.getElementById('glossary-btn');
    if (glossaryBtn) {
      glossaryBtn.addEventListener('click', () => {
        Sound.playClick();
        this.showGlossaryModal();
      });
    }
  }

  updateActiveTabButton(tabKey) {
    const tabs = document.querySelectorAll('.nav-tab-btn');
    tabs.forEach(t => {
      if (t.dataset.tab === tabKey) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });
  }

  render() {
    const state = StateManager.state;
    this.renderTopStrip();
    this.updateActiveTabButton(state.activeTab);

    // Se estiver na aba jornada, renderiza o stepper
    if (state.activeTab === 'journey') {
      if (this.stepperNav) {
        this.stepperNav.style.display = 'flex';
        this.renderStepper(state.currentChapter);
      }
      this.renderJourneyChapter(state.currentChapter);
    } else {
      if (this.stepperNav) {
        this.stepperNav.style.display = 'none';
      }

      switch (state.activeTab) {
        case 'mna':
          this.renderMNALab();
          break;
        case 'cade':
          this.renderCADESimulator();
          break;
        case 'defense':
          this.renderDefenseWarRoom();
          break;
        case 'crisis':
          this.renderCrisisModule();
          break;
        case 'history':
          this.renderHistoricalCases();
          break;
        case 'report':
          this.renderEfficiencyReport();
          break;
        default:
          this.renderJourneyChapter(state.currentChapter);
      }
    }
  }

  renderTopStrip() {
    const s = StateManager.state;
    if (!this.topStrip) return;

    // Calcula HHI atual
    const shares = s.competitors.map(c => c.share);
    const currentHHI = HHIEngine.calculateHHI(shares);

    let hhiClass = 'pill-green';
    if (currentHHI >= 1500 && currentHHI <= 2500) hhiClass = 'pill-yellow';
    if (currentHHI > 2500) hhiClass = 'pill-red';

    this.topStrip.innerHTML = `
      <div class="m-strip-pill blue" title="Caixa Disponível para Aquisições">
        <span class="strip-lbl">Caixa</span>
        <span class="strip-val">R$ ${s.cash}M</span>
      </div>
      <div class="m-strip-pill green" title="Valor de Mercado da Empresa (Market Cap)">
        <span class="strip-lbl">Market Cap</span>
        <span class="strip-val">R$ ${s.marketCap}M</span>
      </div>
      <div class="m-strip-pill cyan" title="Participação no Setor B2B">
        <span class="strip-lbl">Share</span>
        <span class="strip-val">${s.marketShare}%</span>
      </div>
      <div class="m-strip-pill purple" title="Índice de Governança Corporativa e Alinhamento">
        <span class="strip-lbl">Governança</span>
        <span class="strip-val">${s.governanceScore}%</span>
      </div>
      <div class="m-strip-pill ${hhiClass}" title="Concentração Antitruste do CADE">
        <span class="strip-lbl">HHI Mercado</span>
        <span class="strip-val">${currentHHI} pts</span>
      </div>
    `;
  }

  renderStepper(currentChapter) {
    const chapters = [
      { num: 1, label: 'Início', icon: '🚀' },
      { num: 2, label: 'Vertical', icon: '⛓️' },
      { num: 3, label: 'Ataque', icon: '🦈' },
      { num: 4, label: 'Defesa', icon: '🛡️' },
      { num: 5, label: 'Horizontal & CADE', icon: '⚖️' },
      { num: 6, label: 'Crise & Selic', icon: '🚨' },
      { num: 7, label: 'Laudo', icon: '📋' }
    ];

    this.stepperNav.innerHTML = chapters.map(ch => {
      const isCurrent = ch.num === currentChapter;
      const isPast = ch.num < currentChapter;
      const statusClass = isCurrent ? 'active' : isPast ? 'completed' : '';

      return `
        <button class="step-dot-btn ${statusClass}" data-step="${ch.num}" title="Capítulo ${ch.num}: ${ch.label}">
          <span class="step-num">${isPast ? '✓' : ch.num}</span>
          <span class="step-label">${ch.label}</span>
        </button>
      `;
    }).join('');

    this.stepperNav.querySelectorAll('.step-dot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        Sound.playClick();
        const step = Number(btn.dataset.step);
        StateManager.setChapter(step);
      });
    });
  }

  /* ========================================================
   * CAPÍTULOS DA JORNADA GUIADA
   * ======================================================== */

  renderJourneyChapter(chapter) {
    switch (chapter) {
      case 1:
        this.renderChapter1();
        break;
      case 2:
        this.renderChapter2();
        break;
      case 3:
        this.renderChapter3();
        break;
      case 4:
        this.renderChapter4();
        break;
      case 5:
        this.renderChapter5();
        break;
      case 6:
        this.renderChapter6();
        break;
      case 7:
        this.renderChapter7();
        break;
      default:
        this.renderChapter1();
    }
  }

  // CAPÍTULO 1: ONBOARDING
  renderChapter1() {
    const s = StateManager.state;
    this.container.innerHTML = `
      <div class="chapter-card fade-in">
        <div class="chapter-header-badge">
          <span>Capítulo 1 de 7 • Onboarding</span>
          <span class="badge-sub">Ano 2025 • B3</span>
        </div>

        <h2 class="chapter-title">O Mandato do CEO: A Era da Consolidação</h2>

        <div class="context-banner">
          <span class="ctx-icon">🇧🇷</span>
          <p>
            Você assumiu a presidência da <strong>${s.companyName} (${s.ticker})</strong>, uma das principais empresas de tecnologia corporativa listadas na B3.
            Com a taxa Selic acima de 11%, o financiamento bancário está caro e a janela de novos IPOs está fechada. A principal alavanca para crescer e gerar valor para os acionistas é a estratégia de <strong>M&A (Fusões e Aquisições)</strong>!
          </p>
        </div>

        <div class="character-dialogue-card" style="border-left-color: ${CHARACTERS.defesa.themeColor}">
          <div class="char-header">
            <div class="char-avatar-mini">${CHARACTERS.defesa.avatarSvg}</div>
            <div>
              <strong style="color: ${CHARACTERS.defesa.themeColor}">${CHARACTERS.defesa.name}</strong>
              <small>${CHARACTERS.defesa.role}</small>
            </div>
          </div>
          <p class="dialogue-bubble">
            ${CHARACTERS.defesa.catchphrases.onboarding}
          </p>
        </div>

        <div class="character-dialogue-card" style="border-left-color: ${CHARACTERS.gordon.themeColor}">
          <div class="char-header">
            <div class="char-avatar-mini">${CHARACTERS.gordon.avatarSvg}</div>
            <div>
              <strong style="color: ${CHARACTERS.gordon.themeColor}">${CHARACTERS.gordon.name}</strong>
              <small>${CHARACTERS.gordon.role}</small>
            </div>
          </div>
          <p class="dialogue-bubble">
            ${CHARACTERS.gordon.catchphrases.onboarding}
          </p>
        </div>

        <div class="character-dialogue-card" style="border-left-color: ${CHARACTERS.cade.themeColor}">
          <div class="char-header">
            <div class="char-avatar-mini">${CHARACTERS.cade.avatarSvg}</div>
            <div>
              <strong style="color: ${CHARACTERS.cade.themeColor}">${CHARACTERS.cade.name}</strong>
              <small>${CHARACTERS.cade.role}</small>
            </div>
          </div>
          <p class="dialogue-bubble">
            ${CHARACTERS.cade.catchphrases.onboarding}
          </p>
        </div>

        <div class="mission-box">
          <h4>🎯 Seus Primeiros Objetivos:</h4>
          <ul>
            <li>Realizar uma <strong>Fusão Vertical</strong> para reduzir custos operacionais em servidores.</li>
            <li>Proteger seu Conselho de um <strong>Ataque Hostil (Takeover)</strong> do Tubarão Gordon.</li>
            <li>Avaliar uma grande <strong>Fusão Horizontal</strong> e aprovar o índice HHI no CADE.</li>
            <li>Equilibrar a governança corporativa e evitar a insolvência em tempos de Selic alta.</li>
          </ul>
        </div>

        <button class="btn btn-primary btn-block btn-lg" id="btn-start-journey">
          Iniciar Primeiro Movimento: Fusão Vertical ➔
        </button>
      </div>
    `;

    document.getElementById('btn-start-journey').addEventListener('click', () => {
      Sound.playClick();
      StateManager.setChapter(2);
    });
  }

  // CAPÍTULO 2: PRIMEIRA FUSÃO (VERTICAL)
  renderChapter2() {
    const s = StateManager.state;
    const target = MNAEngine.getAvailableTargets().find(t => t.id === 'target_vertical_cloud');

    const alreadyAcquired = s.acquisitions.some(a => a.id === target.id);

    this.container.innerHTML = `
      <div class="chapter-card fade-in">
        <div class="chapter-header-badge">
          <span>Capítulo 2 de 7 • Expansão</span>
          <span class="badge-sub">M&A Vertical</span>
        </div>

        <h2 class="chapter-title">A Primeira Fusão: Otimizando a Cadeia</h2>

        <p class="narrative-text">
          A NexTech gasta mais de R$ 25 milhões por ano pagando fornecedores externos de nuvem e datacenter.
          Sua assessoria identificou a <strong>${target.name}</strong> para uma aquisição vertical.
        </p>

        <!-- Card de Tipo de M&A Educativo -->
        <div class="concept-pill-banner vertical">
          <span class="c-icon">⛓️</span>
          <div>
            <strong>O que é uma Fusão Vertical?</strong>
            <p>É a união entre empresas em diferentes etapas da mesma cadeia produtiva (ex: uma fábrica comprando seu fornecedor de matéria-prima ou seu distribuidor).</p>
          </div>
        </div>

        <div class="target-card-spotlight">
          <div class="target-top">
            <span class="badge badge-info">Fusão Vertical (Upstream)</span>
            <span class="target-price">Custo: R$ ${target.purchaseCost + target.integrationCost}M</span>
          </div>
          <h3>${target.name}</h3>
          <p class="target-desc">${target.description}</p>
          
          <div class="target-metrics-grid">
            <div class="tm-item">
              <span class="tm-lbl">Sinergias Anuais</span>
              <span class="tm-val text-green">+R$ ${target.annualSynergies}M/ano</span>
            </div>
            <div class="tm-item">
              <span class="tm-lbl">Impacto Governança</span>
              <span class="tm-val text-blue">+${target.governanceImpact}%</span>
            </div>
            <div class="tm-item">
              <span class="tm-lbl">Risco Antitruste</span>
              <span class="tm-val text-green">Inexistente (Sem sobreposição)</span>
            </div>
            <div class="tm-item">
              <span class="tm-lbl">Margem Dupla</span>
              <span class="tm-val text-green">Eliminada 100%</span>
            </div>
          </div>

          <div class="theory-note">
            💡 <strong>Teoria Econômica:</strong> Eliminação da <em>Margem Dupla</em> (Double Marginalization). Quando duas empresas com poder de mercado se unem verticalmente, o preço final cai e a eficiência aumenta!
          </div>

          ${alreadyAcquired ? `
            <div class="already-done-alert">
              ✅ Você já adquiriu a CloudData! Os custos foram reduzidos e as sinergias foram incorporadas ao balanço.
            </div>
            <button class="btn btn-primary btn-block btn-lg" id="btn-goto-ch3">
              Avançar para o Capítulo 3 (O Ataque de Gordon) ➔
            </button>
          ` : `
            <div class="action-buttons-row">
              <button class="btn btn-success btn-lg" id="btn-acquire-cloud">
                🚀 Aprovar Aquisição da CloudData (R$ ${target.purchaseCost + target.integrationCost}M)
              </button>
            </div>
          `}
        </div>

        <div class="character-dialogue-card" style="border-left-color: ${CHARACTERS.cade.themeColor}">
          <div class="char-header">
            <div class="char-avatar-mini">${CHARACTERS.cade.avatarSvg}</div>
            <div>
              <strong style="color: ${CHARACTERS.cade.themeColor}">${CHARACTERS.cade.name}</strong>
              <small>Fiscal Antitruste</small>
            </div>
          </div>
          <p class="dialogue-bubble">
            “Como não há sobreposição horizontal (vocês não vendem o mesmo produto ao consumidor final), o CADE não vê risco de concentração. Operação de rito simples!”
          </p>
        </div>
      </div>
    `;

    if (!alreadyAcquired) {
      document.getElementById('btn-acquire-cloud').addEventListener('click', () => {
        Sound.playMoney();
        const exec = MNAEngine.executeMerger(s, target, 'CASH');
        StateManager.update({
          cash: s.cash + exec.cashChange,
          marketCap: s.marketCap + exec.marketCapChange,
          governanceScore: Math.min(100, s.governanceScore + exec.governanceChange),
          acquisitions: [...s.acquisitions, target]
        });
        StateManager.addLog(`Fusão Vertical concluída: Aquisição da ${target.name} por R$ ${target.purchaseCost + target.integrationCost}M.`);
        StateManager.unlockBadge({
          id: 'badge_vertical_done',
          title: 'Mestre da Cadeia',
          icon: '⛓️',
          desc: 'Executou sua primeira Fusão Vertical com ganho de eficiência.'
        });

        this.showEducationalModal({
          title: 'Eficiência Vertical & Margem Dupla',
          badge: 'Conceito Econômico',
          icon: '⛓️',
          content: `
            <p>Parabéns! Ao adquirir seu fornecedor de infraestrutura, a NexTech eliminou a <strong>Margem Dupla (Double Marginalization)</strong>.</p>
            <p>Quando duas empresas monopolistas ou oligopolistas atuam em cadeia, cada uma adiciona sua margem de lucro sobre o custo, encarecendo excessivamente o produto final. A fusão vertical alinha incentivos, corta custos de transação (Teoria de Ronald Coase) e aumenta a margem operacional líquida!</p>
          `,
          onClose: () => {
            StateManager.setChapter(3);
          }
        });
      });
    } else {
      document.getElementById('btn-goto-ch3').addEventListener('click', () => {
        Sound.playClick();
        StateManager.setChapter(3);
      });
    }
  }

  // CAPÍTULO 3: O ATAQUE DO TUBARÃO GORDON
  renderChapter3() {
    const s = StateManager.state;
    if (!this.gordonAttackState) {
      this.gordonAttackState = TakeoverEngine.createAttackScenario(s);
    }
    const attack = this.gordonAttackState;

    this.container.innerHTML = `
      <div class="chapter-card fade-in warning-border">
        <div class="chapter-header-badge">
          <span>Capítulo 3 de 7 • Conflito de Controle</span>
          <span class="badge-sub badge-danger">OPA Hostil Detectada!</span>
        </div>

        <h2 class="chapter-title text-danger">⚠️ O Ataque do Tubarão Gordon!</h2>

        <p class="narrative-text">
          Aproveitando que você gastou caixa na aquisição e a margem trimestral oscilou, o predador financeiro 
          <strong>Tubarão Gordon</strong> protocolou uma <strong>Oferta Pública de Aquisição (OPA) Hostil</strong> diretamente na B3!
        </p>

        <div class="character-dialogue-card shark-alert-card" style="border-left-color: ${CHARACTERS.gordon.themeColor}">
          <div class="char-header">
            <div class="char-avatar-mini">${CHARACTERS.gordon.avatarSvg}</div>
            <div>
              <strong style="color: ${CHARACTERS.gordon.themeColor}">${CHARACTERS.gordon.name}</strong>
              <small>Fundo Gordon Predator</small>
            </div>
          </div>
          <p class="dialogue-bubble">
            ${attack.gordonQuotes[0]}
          </p>
        </div>

        <!-- Widget de Estrutura de Votos -->
        <div class="ownership-box-wrapper">
          ${ChartRenderer.renderOwnershipBar(attack.friendlyStake, attack.gordonInitialStake, attack.freeFloat)}
        </div>

        <div class="tender-offer-card">
          <div class="to-header">
            <span>📑 Termos da OPA Hostil na B3</span>
            <span class="badge badge-danger">+${attack.premiumPercent}% de Prêmio</span>
          </div>
          <p>
            Gordon está oferecendo comprar as ações do Free Float por <strong>R$ ${Math.round(s.marketCap * 1.35)}M</strong>.
            Se os investidores aceitarem, Gordon atingirá <strong>mais de 50% dos votos</strong>, destituirá você na próxima Assembleia Geral e venderá ativos!
          </p>
        </div>

        <div class="character-dialogue-card" style="border-left-color: ${CHARACTERS.defesa.themeColor}">
          <div class="char-header">
            <div class="char-avatar-mini">${CHARACTERS.defesa.avatarSvg}</div>
            <div>
              <strong style="color: ${CHARACTERS.defesa.themeColor}">${CHARACTERS.defesa.name}</strong>
              <small>Advogada Societária</small>
            </div>
          </div>
          <p class="dialogue-bubble">
            ${CHARACTERS.defesa.catchphrases.sharkAlert}
          </p>
        </div>

        <button class="btn btn-danger btn-block btn-lg" id="btn-goto-defense">
          Acessar Sala de Defesa Societária ➔
        </button>
      </div>
    `;

    Sound.playSharkAlert();

    document.getElementById('btn-goto-defense').addEventListener('click', () => {
      Sound.playClick();
      StateManager.setChapter(4);
    });
  }

  // CAPÍTULO 4: O DILEMA DA DEFESA SOCIETÁRIA
  renderChapter4() {
    const s = StateManager.state;
    if (!this.gordonAttackState) {
      this.gordonAttackState = TakeoverEngine.createAttackScenario(s);
    }
    const attack = this.gordonAttackState;

    this.container.innerHTML = `
      <div class="chapter-card fade-in">
        <div class="chapter-header-badge">
          <span>Capítulo 4 de 7 • Táticas de Defesa</span>
          <span class="badge-sub">Sala de Guerra Societária</span>
        </div>

        <h2 class="chapter-title">O Dilema da Dra. Defesa</h2>

        <p class="narrative-text">
          Escolha uma carta tática para defender seu controle. Cada mecanismo tem prós e contras no caixa e na governança:
        </p>

        <!-- Widget de Estrutura de Votos Atual -->
        <div class="ownership-box-wrapper">
          ${ChartRenderer.renderOwnershipBar(attack.friendlyStake, attack.gordonInitialStake, attack.freeFloat)}
        </div>

        <div class="defense-cards-deck">
          ${DEFENSE_CARDS.map(card => {
            const canAfford = s.cash >= card.costCash;
            return `
              <div class="defense-card-item ${!canAfford ? 'disabled' : ''}">
                <div class="dc-top">
                  <span class="dc-icon">${card.icon}</span>
                  <div class="dc-title-wrap">
                    <h4>${card.name}</h4>
                    <small>${card.subtitle}</small>
                  </div>
                </div>

                <p class="dc-desc">${card.shortDesc}</p>

                <div class="dc-stats-row">
                  <span class="dc-cost ${canAfford ? 'text-green' : 'text-danger'}">
                    Custo: R$ ${card.costCash}M
                  </span>
                  <span class="dc-gov ${card.governanceDelta >= 0 ? 'text-green' : 'text-danger'}">
                    Gov: ${card.governanceDelta >= 0 ? '+' : ''}${card.governanceDelta}%
                  </span>
                </div>

                <div class="dc-theory-bubble">
                  📖 <strong>Conceito:</strong> ${card.economicConcept}
                </div>

                <button class="btn btn-sm btn-primary btn-block btn-play-card" 
                        data-card="${card.id}" 
                        ${!canAfford ? 'disabled' : ''}>
                  ${canAfford ? `Ativar ${card.name}` : 'Caixa Insuficiente'}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    this.container.querySelectorAll('.btn-play-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const cardId = btn.dataset.card;
        this.executeDefenseCard(cardId);
      });
    });
  }

  executeDefenseCard(cardId) {
    const s = StateManager.state;
    const res = TakeoverEngine.playDefenseCard(cardId, this.gordonAttackState, s);

    if (!res.success) {
      alert(res.reason);
      return;
    }

    Sound.playCardPlay();

    // Atualiza estado
    this.gordonAttackState.gordonInitialStake = res.updatedGordonStake;
    this.gordonAttackState.friendlyStake = res.updatedFriendlyStake;
    this.gordonAttackState.freeFloat = res.freeFloat;

    const newCash = s.cash - res.cashSpent;
    const newGov = Math.max(10, Math.min(100, s.governanceScore + res.governanceChange));

    StateManager.update({
      cash: newCash,
      governanceScore: newGov,
      defensesUsed: [...s.defensesUsed, res.card.id]
    });

    StateManager.addLog(`Defesa societária: Ativou ${res.card.name}. Stake de Gordon caiu para ${res.updatedGordonStake}%.`);

    if (res.gordonDefeated) {
      Sound.playVictory();
      StateManager.unlockBadge({
        id: 'badge_shark_repelled',
        title: 'Caçador de Tubarões',
        icon: '🦈',
        desc: 'Derrotou a OPA hostil do Tubarão Gordon com manobra societária.'
      });

      this.showEducationalModal({
        title: 'Ataque Hostil Repelido!',
        badge: 'Vitória Societária',
        icon: '🛡️',
        content: `
          <div class="char-header mb-3">
            <div class="char-avatar-mini">${CHARACTERS.defesa.avatarSvg}</div>
            <div>
              <strong>${CHARACTERS.defesa.name}</strong>
              <small>Advogada Societária</small>
            </div>
          </div>
          <p>${res.outcomeMessage}</p>
          <hr class="divider"/>
          <h4>🎓 Lição de Governança & Teoria da Agência:</h4>
          <p>
            Mecanismos como <strong>Poison Pills</strong> e <strong>Shark Repellents</strong> protegem o mandato dos executivos, mas se forem usados de forma desproporcional, geram o problema de <em>entrincheiramento gerencial</em> (quando executivos incompetentes usam o estatuto social para se blindarem de cobranças de mercado).
          </p>
        `,
        onClose: () => {
          StateManager.setChapter(5);
        }
      });
    } else {
      this.renderChapter4();
    }
  }

  // CAPÍTULO 5: CRESCIMENTO & O CADE (HORIZONTAL)
  renderChapter5() {
    const s = StateManager.state;
    const target = MNAEngine.getAvailableTargets().find(t => t.id === 'target_horizontal_vanguard');

    // Simula fusão com remédio configurado no estado local
    const sim = HHIEngine.simulateMerger(
      s.competitors,
      'player_nextech',
      'target_horizontal_vanguard',
      this.hhiSimData.remedy
    );

    const alreadyAcquired = s.acquisitions.some(a => a.id === target.id);

    this.container.innerHTML = `
      <div class="chapter-card fade-in">
        <div class="chapter-header-badge">
          <span>Capítulo 5 de 7 • Fusão Horizontal</span>
          <span class="badge-sub badge-info">O Tribunal do CADE</span>
        </div>

        <h2 class="chapter-title">A Grande Fusão e o Teste do CADE</h2>

        <p class="narrative-text">
          Com a vitória societária, surge a chance de ouro: adquirir a <strong>${target.name}</strong>, sua principal concorrente direta!
          Porém, por ser uma <strong>Fusão Horizontal</strong>, a operação cai imediatamente no radar antitruste do Inspetor CADE.
        </p>

        <!-- Widget de Donut e HHI Bar -->
        <div class="hhi-interactive-panel">
          <h3>📊 Concentração de Mercado Pós-Fusão</h3>
          ${ChartRenderer.renderMarketDonut(sim.postCompanies, 220, 'Share Pós-M&A')}
          
          <div class="mt-3">
            ${ChartRenderer.renderHHIBar(sim.preHHI, sim.postHHI, sim.deltaHHI)}
          </div>
        </div>

        <!-- Parecer do CADE -->
        <div class="cade-verdict-card" style="border-color: ${sim.analysis.color}">
          <div class="verdict-header">
            <div class="char-avatar-mini">${CHARACTERS.cade.avatarSvg}</div>
            <div>
              <span class="badge ${sim.analysis.badgeClass}">${sim.analysis.badge}</span>
              <h4 style="color: ${sim.analysis.color}">${sim.analysis.title}</h4>
            </div>
          </div>
          <p class="inspector-quote">“${sim.analysis.inspectorQuote}”</p>
          <p class="verdict-desc">${sim.analysis.explanation}</p>
        </div>

        <!-- Slider de Remédio Estrutural (Desinvestimento) -->
        <div class="remedy-slider-box">
          <div class="rs-header">
            <span>💊 Remédio Estrutural (Desinvestimento ao CADE)</span>
            <strong class="text-cyan">${this.hhiSimData.remedy}% de share cedido</strong>
          </div>
          <p class="rs-sub">
            Concordar em vender divisões secundárias ou marcas para concorrentes reduz a concentração e viabiliza a aprovação!
          </p>
          <input type="range" min="0" max="10" step="1" value="${this.hhiSimData.remedy}" id="remedy-slider" class="range-slider">
          <div class="range-labels">
            <span>0% (Sem concessões)</span>
            <span>5% (Remédio Médio)</span>
            <span>10% (Desinvestimento Severo)</span>
          </div>
        </div>

        ${alreadyAcquired ? `
          <div class="already-done-alert">
            ✅ Fusão Horizontal aprovada e concluída com o CADE! Seu market share consolidado expandiu para patamares históricos!
          </div>
          <button class="btn btn-primary btn-block btn-lg" id="btn-goto-ch6">
            Avançar para o Capítulo 6 (Crise & Desafio Histórico) ➔
          </button>
        ` : `
          <div class="action-buttons-row mt-4">
            <button class="btn ${sim.analysis.canPass ? 'btn-success' : 'btn-secondary'} btn-block btn-lg" 
                    id="btn-submit-cade" 
                    ${!sim.analysis.canPass ? 'disabled' : ''}>
              ${sim.analysis.canPass ? '🏛️ Protocolar e Concluir Fusão com Aval do CADE' : '⛔ Operação Travada pelo CADE (Ajuste o Remédio)'}
            </button>
          </div>
        `}
      </div>
    `;

    const slider = document.getElementById('remedy-slider');
    if (slider) {
      slider.addEventListener('input', (e) => {
        this.hhiSimData.remedy = Number(e.target.value);
        this.renderChapter5();
      });
    }

    const submitBtn = document.getElementById('btn-submit-cade');
    if (submitBtn && sim.analysis.canPass) {
      submitBtn.addEventListener('click', () => {
        Sound.playCadeApproved();
        const exec = MNAEngine.executeMerger(s, target, 'CASH', this.hhiSimData.remedy);
        
        StateManager.update({
          cash: s.cash + exec.cashChange,
          marketCap: s.marketCap + exec.marketCapChange,
          marketShare: s.marketShare + exec.marketShareChange,
          competitors: sim.postCompanies,
          acquisitions: [...s.acquisitions, target],
          cadeHistory: [...s.cadeHistory, { target: target.name, verdict: sim.analysis }]
        });

        StateManager.addLog(`Fusão Horizontal aprovada no CADE: ${target.name}. HHI Final: ${sim.postHHI} pts.`);
        StateManager.unlockBadge({
          id: 'badge_cade_cleared',
          title: 'Aprovado pelo CADE',
          icon: '⚖️',
          desc: 'Aprovou uma grande fusão horizontal equilibrando remédios e eficiência.'
        });

        this.showEducationalModal({
          title: 'Julgamento Concluído no CADE!',
          badge: 'Defesa da Concorrência',
          icon: '⚖️',
          content: `
            <p>O Tribunal do CADE publicou no Diário Oficial da União a homologação do <strong>Acordo em Controle de Concentrações (ACC)</strong>.</p>
            <hr class="divider"/>
            <h4>🎓 O Que Você Aprendeu sobre o HHI:</h4>
            <ul>
              <li><strong>HHI > 2.500:</strong> Mercado altamente concentrado com presunção de risco oligopolista.</li>
              <li><strong>Delta HHI > 200:</strong> Variação crítica que aciona investigação detalhada ou veto sumário.</li>
              <li><strong>Remédios Estruturais:</strong> Venda de fábricas, marcas ou concessão de licenças a concorrentes para restaurar a rivalidade de mercado (como no caso real Sadia x Perdigão e Chocolates Garoto x Nestlé!).</li>
            </ul>
          `,
          onClose: () => {
            StateManager.setChapter(6);
          }
        });
      });
    }

    const gotoCh6Btn = document.getElementById('btn-goto-ch6');
    if (gotoCh6Btn) {
      gotoCh6Btn.addEventListener('click', () => {
        Sound.playClick();
        StateManager.setChapter(6);
      });
    }
  }

  // CAPÍTULO 6: CRISE, RECUPERAÇÃO JUDICIAL & CASO SADIA X PERDIGÃO
  renderChapter6() {
    const s = StateManager.state;
    const historicalSadia = HISTORICAL_SCENARIOS.find(h => h.id === 'sadia_perdigao_2006');
    const macroTech = HISTORICAL_SCENARIOS.find(h => h.id === 'macro_tech_2025_2026');

    this.container.innerHTML = `
      <div class="chapter-card fade-in">
        <div class="chapter-header-badge">
          <span>Capítulo 6 de 7 • Cenários Reais</span>
          <span class="badge-sub badge-warning">Crise, Selic & História</span>
        </div>

        <h2 class="chapter-title">O Teste de Fogo: Selic Alta & Lições da Sadia</h2>

        <div class="context-banner">
          <span class="ctx-icon">📉</span>
          <p>
            Em 2025/2026, a taxa básica de juros (Selic a 11,25% a.a.) encareceu os custos financeiros.
            Um dos seus fornecedores de tecnologia entrou em recuperação judicial, e você precisa decidir se usa as ferramentas da <strong>Lei 11.101/2005 (Recuperação Judicial & Distressed M&A)</strong> ou aplica as lições históricas da fusão <strong>Sadia vs. Perdigão</strong>.
          </p>
        </div>

        <!-- Módulo Distressed M&A / UPI -->
        <div class="distressed-panel">
          <div class="dp-header">
            <span>🏭 Oportunidade em Distressed M&A (UPI)</span>
            <span class="badge badge-success">Lei de Falências 11.101/05</span>
          </div>
          <h4>Adquirir UPI (Unidade Produtiva Isolada) de Empresa em Crise</h4>
          <p>
            Uma rival em dificuldades está em Recuperação Judicial vendendo sua divisão de software em leilão.
            Pelo Art. 60 da Lei 11.101/2005, você pode arrematar essa divisão <strong>totalmente livre de dívidas trabalhistas ou tributárias</strong> da falida!
          </p>
          <div class="action-buttons-row">
            <button class="btn btn-outline-primary btn-block" id="btn-buy-upi">
              💎 Arrematar UPI por R$ 25M (Injeta +R$ 15M de Sinergias)
            </button>
          </div>
        </div>

        <!-- Comparativo Histórico Sadia vs Perdigão -->
        <div class="historical-showcase-box">
          <div class="hs-badge">${historicalSadia.badge}</div>
          <h3>${historicalSadia.title}</h3>
          <p>${historicalSadia.summary}</p>
          
          <div class="mini-timeline">
            ${historicalSadia.timeline.map(t => `
              <div class="tl-item">
                <span class="tl-year">${t.year}</span>
                <div class="tl-body">
                  <strong>${t.phase}</strong>
                  <p>${t.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Tendências 2025/2026 -->
        <div class="macro-showcase-box">
          <div class="hs-badge badge-info">${macroTech.badge}</div>
          <h3>${macroTech.title}</h3>
          <div class="macro-pills">
            <div class="mp-item">
              <span>Selic Básica:</span>
              <strong>${macroTech.macroEffects.selicRate}% a.a.</strong>
            </div>
            <div class="mp-item">
              <span>Setor Líder:</span>
              <strong>${macroTech.macroEffects.techTransactionDominance}</strong>
            </div>
          </div>
          <p class="mt-2 text-muted">${macroTech.macroEffects.strategicRecommendation}</p>
        </div>

        <button class="btn btn-primary btn-block btn-lg mt-4" id="btn-finish-to-report">
          Avançar para o Desfecho: Relatório de Eficiência Alocativa ➔
        </button>
      </div>
    `;

    document.getElementById('btn-buy-upi').addEventListener('click', () => {
      Sound.playMoney();
      StateManager.update({
        cash: s.cash - 25,
        marketCap: s.marketCap + 40,
        marketShare: s.marketShare + 3
      });
      StateManager.addLog('Distressed M&A: Arrematou UPI blindada de passivos pelo Art. 60 da Lei 11.101/05.');
      StateManager.unlockBadge({
        id: 'badge_distressed_pro',
        title: 'Mestre em Distressed M&A',
        icon: '🏭',
        desc: 'Utilizou a venda judicial de UPI para expandir sem herdar dívidas fiscais.'
      });
      alert('✅ UPI adquirida com sucesso! Você obteve ativos estratégicos sem herdar os passivos ocultos da devedora.');
    });

    document.getElementById('btn-finish-to-report').addEventListener('click', () => {
      Sound.playClick();
      StateManager.setChapter(7);
    });
  }

  // CAPÍTULO 7: DESFECHO & RELATÓRIO DE EFICIÊNCIA ALOCATIVA
  renderChapter7() {
    this.renderEfficiencyReport();
  }

  /* ========================================================
   * ABA DE RELATÓRIO DE EFICIÊNCIA ALOCATIVA & GOVERNANÇA
   * ======================================================== */
  renderEfficiencyReport() {
    const s = StateManager.state;

    // Calcula nota de governança e eficiência
    let efficiencyScore = 50;
    if (s.marketShare >= 30) efficiencyScore += 15;
    if (s.governanceScore >= 75) efficiencyScore += 15;
    if (s.cash > 40) efficiencyScore += 10;
    if (s.acquisitions.length >= 2) efficiencyScore += 10;

    let profileTitle = 'CEO Titã do Mercado';
    let profileColor = '#10b981';
    let profileDesc = 'Sua gestão combinou agressividade estratégica em M&A, respeito rigoroso às diretrizes antitruste do CADE e governança equilibrada contra predadores hostis.';

    if (s.governanceScore < 60) {
      profileTitle = 'Defensor Entrincheirado';
      profileColor = '#f59e0b';
      profileDesc = 'Você preservou o controle da companhia a qualquer custo, mas o uso excessivo de Golden Parachutes gerou forte conflito de agência com os acionistas minoritários.';
    } else if (s.marketShare > 45 && s.acquisitions.length >= 2) {
      profileTitle = 'Barão do Monopólio';
      profileColor = '#ef4444';
      profileDesc = 'Você criou um gigante corporativo quase imbatível, porém o CADE precisou intervir pesadamente com remédios para evitar abuso de poder econômico.';
    }

    this.container.innerHTML = `
      <div class="chapter-card fade-in">
        <div class="chapter-header-badge">
          <span>Desfecho • Laudo Executivo</span>
          <span class="badge-sub">Governança & Antitruste</span>
        </div>

        <div class="score-spotlight" style="border-color: ${profileColor}">
          <div class="score-circle" style="background: radial-gradient(circle, ${profileColor}22, transparent)">
            <span class="score-number">${efficiencyScore}</span>
            <span class="score-total">/ 100</span>
          </div>
          <h2 style="color: ${profileColor}">${profileTitle}</h2>
          <p class="score-desc">${profileDesc}</p>
        </div>

        <!-- Indicadores Finais -->
        <div class="final-stats-grid">
          <div class="f-stat-card">
            <span class="fs-lbl">Market Cap Final</span>
            <strong class="fs-val text-green">R$ ${s.marketCap}M</strong>
          </div>
          <div class="f-stat-card">
            <span class="fs-lbl">Market Share Final</span>
            <strong class="fs-val text-cyan">${s.marketShare}%</strong>
          </div>
          <div class="f-stat-card">
            <span class="fs-lbl">Governança B3</span>
            <strong class="fs-val text-purple">${s.governanceScore}%</strong>
          </div>
          <div class="f-stat-card">
            <span class="fs-lbl">Caixa Preservado</span>
            <strong class="fs-val text-yellow">R$ ${s.cash}M</strong>
          </div>
        </div>

        <!-- Avaliação dos 3 Personagens -->
        <h3 class="mt-4 mb-2">⚖️ Pareceres Finais dos Agentes de Mercado:</h3>

        <div class="agent-review-card" style="border-left-color: ${CHARACTERS.cade.themeColor}">
          <div class="ar-head">
            <div class="char-avatar-mini">${CHARACTERS.cade.avatarSvg}</div>
            <div>
              <strong>${CHARACTERS.cade.name}</strong>
              <small>Julgamento Antitruste</small>
            </div>
          </div>
          <p>
            ${s.marketShare > 40 
              ? '“A expansão horizontal colocou o HHI no limite. O remédio negociado garantiu a rivalidade do setor e protegeu o bem-estar dos consumidores.”' 
              : '“Excelente conformidade regulatória. Não houve tentativa de cartelização nem criação de monopólios abusivos.”'}
          </p>
        </div>

        <div class="agent-review-card" style="border-left-color: ${CHARACTERS.gordon.themeColor}">
          <div class="ar-head">
            <div class="char-avatar-mini">${CHARACTERS.gordon.avatarSvg}</div>
            <div>
              <strong>${CHARACTERS.gordon.name}</strong>
              <small>O Agressor Hostil</small>
            </div>
          </div>
          <p>
            “Admito que sua resposta societária foi rápida. Meu fundo perdeu esta rodada, mas continue vigiando suas margens: se a ineficiência voltar, nós atacaremos novamente!”
          </p>
        </div>

        <div class="agent-review-card" style="border-left-color: ${CHARACTERS.defesa.themeColor}">
          <div class="ar-head">
            <div class="char-avatar-mini">${CHARACTERS.defesa.avatarSvg}</div>
            <div>
              <strong>${CHARACTERS.defesa.name}</strong>
              <small>Advogada Societária</small>
            </div>
          </div>
          <p>
            “O estatuto social da NexTech foi blindado com maestria. Conseguimos repelir investidas predatórias sem comprometer o relacionamento de longo prazo com o mercado.”
          </p>
        </div>

        <!-- Conquistas Desbloqueadas -->
        <h3 class="mt-4 mb-2">🏆 Conquistas Societárias Obtidas:</h3>
        <div class="badges-list">
          ${s.unlockedBadges.map(b => `
            <div class="badge-item">
              <span class="bi-icon">${b.icon}</span>
              <div>
                <strong>${b.title}</strong>
                <p>${b.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="action-buttons-row mt-4">
          <button class="btn btn-outline-primary btn-block" id="btn-replay-game">
            🔄 Reiniciar Partida (Nova Simulação)
          </button>
          <button class="btn btn-primary btn-block mt-2" id="btn-explore-sandbox">
            🧪 Abrir Modo Sandbox Livre (Simulador HHI & M&A)
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-replay-game').addEventListener('click', () => {
      if (confirm('Deseja reiniciar a jornada e começar um novo mandato como CEO?')) {
        Sound.playClick();
        StateManager.reset();
        StateManager.setActiveTab('journey');
      }
    });

    document.getElementById('btn-explore-sandbox').addEventListener('click', () => {
      Sound.playClick();
      StateManager.setActiveTab('cade');
    });
  }

  /* ========================================================
   * ABA DE M&A LAB (TABULEIRO DE FUSÕES)
   * ======================================================== */
  renderMNALab() {
    const s = StateManager.state;
    const targets = MNAEngine.getAvailableTargets();

    this.container.innerHTML = `
      <div class="chapter-card fade-in">
        <div class="chapter-header-badge">
          <span>M&A Lab • Tabuleiro Corporativo</span>
          <span class="badge-sub">Mapeamento de Oportunidades</span>
        </div>

        <h2 class="chapter-title">Laboratório de Fusões & Aquisições</h2>
        <p class="narrative-text">
          Selecione alvos para expandir a NexTech. O sistema identifica instantaneamente se a transação é <strong>Horizontal</strong>, <strong>Vertical</strong> ou por <strong>Conglomerado</strong>.
        </p>

        <!-- Filtros Rápidos de Tipos de M&A -->
        <div class="mna-types-overview">
          <div class="mna-type-box horizontal">
            <span class="mt-icon">⚔️</span>
            <strong>Horizontal</strong>
            <small>Concorrente direto</small>
          </div>
          <div class="mna-type-box vertical">
            <span class="mt-icon">⛓️</span>
            <strong>Vertical</strong>
            <small>Cadeia de valor</small>
          </div>
          <div class="mna-type-box conglomerate">
            <span class="mt-icon">🌐</span>
            <strong>Conglomerado</strong>
            <small>Outro mercado</small>
          </div>
        </div>

        <div class="targets-catalog mt-4">
          ${targets.map(target => {
            const isAcquired = s.acquisitions.some(a => a.id === target.id);
            const typeConfig = MNA_TYPES[target.type];
            const canAfford = s.cash >= (target.purchaseCost + target.integrationCost);

            return `
              <div class="catalog-target-card ${isAcquired ? 'acquired' : ''}">
                <div class="ct-header">
                  <span class="badge ${typeConfig.badgeClass}">${typeConfig.icon} ${typeConfig.label}</span>
                  <strong class="ct-price">R$ ${target.purchaseCost + target.integrationCost}M</strong>
                </div>

                <h3>${target.name}</h3>
                <small class="text-muted">${target.sector}</small>
                <p class="ct-desc">${target.description}</p>

                <div class="ct-metrics">
                  <span>Sinergias: <strong>+R$ ${target.annualSynergies}M/ano</strong></span>
                  <span>Share Adicional: <strong>+${target.targetShare}%</strong></span>
                  <span>CADE: <strong>${target.requiresCADEApproval ? 'Escrutínio' : 'Livre'}</strong></span>
                </div>

                <div class="ct-theory">
                  💡 ${target.conceptExplanation}
                </div>

                ${isAcquired ? `
                  <button class="btn btn-secondary btn-block" disabled>✅ Empresa já Adquirida</button>
                ` : `
                  <button class="btn btn-primary btn-block btn-buy-target" 
                          data-id="${target.id}" 
                          ${!canAfford ? 'disabled' : ''}>
                    ${canAfford ? `Adquirir por R$ ${target.purchaseCost + target.integrationCost}M` : 'Caixa Insuficiente'}
                  </button>
                `}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    this.container.querySelectorAll('.btn-buy-target').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.id;
        const target = targets.find(t => t.id === targetId);
        if (!target) return;

        if (target.requiresCADEApproval) {
          Sound.playClick();
          StateManager.setActiveTab('cade');
          return;
        }

        Sound.playMoney();
        const exec = MNAEngine.executeMerger(s, target, 'CASH');
        StateManager.update({
          cash: s.cash + exec.cashChange,
          marketCap: s.marketCap + exec.marketCapChange,
          marketShare: s.marketShare + exec.marketShareChange,
          acquisitions: [...s.acquisitions, target]
        });
        StateManager.addLog(`M&A Concluído: Aquisição de ${target.name}.`);
        this.renderMNALab();
      });
    });
  }

  /* ========================================================
   * ABA DE CADE & HHI (SIMULADOR ANTITRUSTE INTERATIVO)
   * ======================================================== */
  renderCADESimulator() {
    const s = StateManager.state;
    const sim = HHIEngine.simulateMerger(
      s.competitors,
      'player_nextech',
      'target_horizontal_vanguard',
      this.hhiSimData.remedy
    );

    this.container.innerHTML = `
      <div class="chapter-card fade-in">
        <div class="chapter-header-badge">
          <span>Simulador Antitruste • CADE</span>
          <span class="badge-sub badge-info">Cálculo de HHI em Tempo Real</span>
        </div>

        <h2 class="chapter-title">Índice Herfindahl-Hirschman (HHI)</h2>

        <p class="narrative-text">
          O CADE utiliza a fórmula matemática <strong>HHI = Σ (Share %)²</strong> para mensurar se uma fusão horizontal cria concentração excessiva ou riscos de abuso de preço contra os consumidores.
        </p>

        <!-- Gráfico Donut Interativo -->
        <div class="hhi-interactive-panel">
          <h3>Fatias de Mercado (Market Share %)</h3>
          ${ChartRenderer.renderMarketDonut(sim.postCompanies, 240, 'Share do Setor')}
          
          <div class="mt-3">
            ${ChartRenderer.renderHHIBar(sim.preHHI, sim.postHHI, sim.deltaHHI)}
          </div>
        </div>

        <!-- Parecer do CADE -->
        <div class="cade-verdict-card mt-3" style="border-color: ${sim.analysis.color}">
          <div class="verdict-header">
            <div class="char-avatar-mini">${CHARACTERS.cade.avatarSvg}</div>
            <div>
              <span class="badge ${sim.analysis.badgeClass}">${sim.analysis.badge}</span>
              <h4 style="color: ${sim.analysis.color}">${sim.analysis.title}</h4>
            </div>
          </div>
          <p class="inspector-quote">“${sim.analysis.inspectorQuote}”</p>
          <p class="verdict-desc">${sim.analysis.explanation}</p>
        </div>

        <!-- Sliders Dinâmicos para Teste de Cenários -->
        <div class="remedy-slider-box mt-3">
          <div class="rs-header">
            <span>⚙️ Remédio Estrutural de Desinvestimento</span>
            <strong class="text-cyan">${this.hhiSimData.remedy}% de Market Share Cedido</strong>
          </div>
          <p class="rs-sub">Mova o slider para simular o efeito da venda de divisões sobre o HHI final:</p>
          <input type="range" min="0" max="12" step="1" value="${this.hhiSimData.remedy}" id="cade-sandbox-remedy" class="range-slider">
        </div>

        <!-- Tabela Didática de Critérios CADE -->
        <div class="cade-criteria-table mt-4">
          <h4>🏛️ Critérios Oficiais de Concentração (Guia CADE):</h4>
          <table>
            <thead>
              <tr>
                <th>Faixa HHI</th>
                <th>Classificação</th>
                <th>Veredito Padrão</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>&lt; 1.500</td>
                <td>Desconcentrado</td>
                <td>Aprovação rápida (Rito Sumário)</td>
              </tr>
              <tr>
                <td>1.500 a 2.500</td>
                <td>Moderado</td>
                <td>Atenção se ΔHHI &gt; 100</td>
              </tr>
              <tr>
                <td>&gt; 2.500</td>
                <td>Altamente Concentrado</td>
                <td>Exige Remédios ou Veto se ΔHHI &gt; 200</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    const slider = document.getElementById('cade-sandbox-remedy');
    if (slider) {
      slider.addEventListener('input', (e) => {
        this.hhiSimData.remedy = Number(e.target.value);
        this.renderCADESimulator();
      });
    }
  }

  /* ========================================================
   * ABA DE SALA DE DEFESA CONTRA TAKEVER (GUERRA SOCIETÁRIA)
   * ======================================================== */
  renderDefenseWarRoom() {
    const s = StateManager.state;
    if (!this.gordonAttackState) {
      this.gordonAttackState = TakeoverEngine.createAttackScenario(s);
    }
    const attack = this.gordonAttackState;

    this.container.innerHTML = `
      <div class="chapter-card fade-in">
        <div class="chapter-header-badge">
          <span>Sala de Defesa • Governança Societária</span>
          <span class="badge-sub badge-danger">Guerra de Procurações</span>
        </div>

        <h2 class="chapter-title">Defesas contra Takeovers Hostis</h2>
        <p class="narrative-text">
          O Tubarão Gordon atua como o carrasco externo da B3. Use seu arsenal estatutário da Dra. Defesa para repelir ofertas predatórias!
        </p>

        <!-- Termômetro Acionário -->
        <div class="ownership-box-wrapper mb-3">
          ${ChartRenderer.renderOwnershipBar(attack.friendlyStake, attack.gordonInitialStake, attack.freeFloat)}
        </div>

        <div class="character-dialogue-card" style="border-left-color: ${CHARACTERS.defesa.themeColor}">
          <div class="char-header">
            <div class="char-avatar-mini">${CHARACTERS.defesa.avatarSvg}</div>
            <div>
              <strong style="color: ${CHARACTERS.defesa.themeColor}">${CHARACTERS.defesa.name}</strong>
              <small>Advogada Societária</small>
            </div>
          </div>
          <p class="dialogue-bubble">
            “Selecione uma tática abaixo. Lembre-se: Poison Pills diluem o agressor, Golden Parachutes encarecem as demissões e White Knights trazem parceiros de longo prazo.”
          </p>
        </div>

        <div class="defense-cards-deck mt-3">
          ${DEFENSE_CARDS.map(card => {
            const canAfford = s.cash >= card.costCash;
            return `
              <div class="defense-card-item ${!canAfford ? 'disabled' : ''}">
                <div class="dc-top">
                  <span class="dc-icon">${card.icon}</span>
                  <div>
                    <h4>${card.name}</h4>
                    <small>${card.subtitle}</small>
                  </div>
                </div>
                <p class="dc-desc">${card.shortDesc}</p>
                <div class="dc-stats-row">
                  <span class="${canAfford ? 'text-green' : 'text-danger'}">Custo: R$ ${card.costCash}M</span>
                  <span class="${card.governanceDelta >= 0 ? 'text-green' : 'text-danger'}">Gov: ${card.governanceDelta}%</span>
                </div>
                <button class="btn btn-sm btn-primary btn-block btn-war-play" 
                        data-card="${card.id}" 
                        ${!canAfford ? 'disabled' : ''}>
                  Ativar Tática
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    this.container.querySelectorAll('.btn-war-play').forEach(btn => {
      btn.addEventListener('click', () => {
        const cardId = btn.dataset.card;
        this.executeDefenseCard(cardId);
        this.renderDefenseWarRoom();
      });
    });
  }

  /* ========================================================
   * ABA DE CRISE & RECUPERAÇÃO JUDICIAL
   * ======================================================== */
  renderCrisisModule() {
    const s = StateManager.state;
    const rjTools = CrisisEngine.getRJRestructuringTools();

    this.container.innerHTML = `
      <div class="chapter-card fade-in">
        <div class="chapter-header-badge">
          <span>Gestão de Crise • Distressed Assets</span>
          <span class="badge-sub badge-warning">Lei 11.101/2005</span>
        </div>

        <h2 class="chapter-title">Módulo de Crise & Turnaround</h2>
        <p class="narrative-text">
          Quando a Selic sobe ou a liquidez seca, empresas enfrentam o risco de insolvência. 
          Aprenda a diferença crucial entre a <strong>Falência (Liquidação)</strong> e a <strong>Recuperação Judicial (Preservação)</strong>.
        </p>

        <!-- Comparativo Didático: Falência vs RJ -->
        <div class="crisis-comparison-grid">
          <div class="cc-box bankruptcy">
            <span class="cc-icon">🛑</span>
            <h4>Falência (Art. 75)</h4>
            <p>Liquidação forçada de bens em hasta pública. O CEO perde o cargo, funcionários são demitidos e o intangível da empresa é destruído.</p>
          </div>
          <div class="cc-box recovery">
            <span class="cc-icon">⚖️</span>
            <h4>Recuperação Judicial</h4>
            <p>Proteção com Stay Period de 180 dias. Permite renegociar deságios e vender UPIs para injetar liquidez sem sucessão de dívidas.</p>
          </div>
        </div>

        <h3 class="mt-4 mb-2">🛠️ Instrumentos de Reestruturação em RJ:</h3>
        <div class="rj-tools-list">
          ${rjTools.map(tool => `
            <div class="rj-tool-card">
              <div class="rt-head">
                <span class="rt-icon">${tool.icon}</span>
                <div>
                  <strong>${tool.name}</strong>
                  <small class="text-muted d-block">${tool.subtitle}</small>
                </div>
              </div>
              <p class="rt-desc">${tool.description}</p>
              <div class="rt-footer">
                <span class="text-green">+R$ ${tool.cashInflow}M Caixa</span>
                <span class="text-blue">-R$ ${tool.debtReduction}M Dívida</span>
                <button class="btn btn-sm btn-outline-primary btn-apply-rj" data-tool="${tool.id}">
                  Executar Instrumento
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.container.querySelectorAll('.btn-apply-rj').forEach(btn => {
      btn.addEventListener('click', () => {
        const toolId = btn.dataset.tool;
        const res = CrisisEngine.applyRJTool(toolId, s);
        if (res.success) {
          Sound.playMoney();
          StateManager.update({
            cash: res.updatedCash,
            debt: res.updatedDebt,
            marketCap: res.updatedMarketCap
          });
          StateManager.addLog(res.message);
          alert(res.message);
          this.renderCrisisModule();
        }
      });
    });
  }

  /* ========================================================
   * ABA DE CASOS HISTÓRICOS & MACRO
   * ======================================================== */
  renderHistoricalCases() {
    const historicalSadia = HISTORICAL_SCENARIOS.find(h => h.id === 'sadia_perdigao_2006');
    const macroTech = HISTORICAL_SCENARIOS.find(h => h.id === 'macro_tech_2025_2026');

    this.container.innerHTML = `
      <div class="chapter-card fade-in">
        <div class="chapter-header-badge">
          <span>Casos Reais do Mercado • Brasil</span>
          <span class="badge-sub badge-purple">História & Tendências</span>
        </div>

        <h2 class="chapter-title">Sadia x Perdigão & O Boom de M&A Tech</h2>

        <div class="historical-showcase-box mb-4">
          <div class="hs-badge">${historicalSadia.badge}</div>
          <h3>${historicalSadia.title}</h3>
          <p class="mb-3">${historicalSadia.summary}</p>

          <div class="mini-timeline">
            ${historicalSadia.timeline.map(t => `
              <div class="tl-item">
                <span class="tl-year">${t.year}</span>
                <div class="tl-body">
                  <strong>${t.phase}</strong>
                  <p>${t.desc}</p>
                  <span class="badge badge-sub mt-1">Conceito: ${t.concept}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="macro-showcase-box">
          <div class="hs-badge badge-info">${macroTech.badge}</div>
          <h3>${macroTech.title}</h3>
          <p class="mb-3">${macroTech.summary}</p>

          <div class="insights-stack">
            ${macroTech.keyInsights.map(ki => `
              <div class="insight-row">
                <strong>📌 ${ki.topic}:</strong>
                <p>${ki.detail}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  /* ========================================================
   * MODAIS EDUCATIVOS & GLOSSÁRIO
   * ======================================================== */
  showEducationalModal({ title, badge, icon, content, onClose }) {
    if (!this.modalContainer) return;

    this.modalContainer.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-sheet-dialog fade-up">
          <div class="modal-pill-handle"></div>
          <div class="modal-header">
            <span class="badge badge-info">${badge || 'Pílula de Conhecimento'}</span>
            <button class="modal-close-x" id="modal-close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <div class="modal-icon-title">
              <span class="m-icon">${icon || '💡'}</span>
              <h3>${title}</h3>
            </div>
            <div class="modal-content-text">
              ${content}
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary btn-block btn-lg" id="modal-action-btn">Entendido! Continuar ➔</button>
          </div>
        </div>
      </div>
    `;

    const close = () => {
      Sound.playClick();
      this.modalContainer.innerHTML = '';
      if (onClose) onClose();
    };

    document.getElementById('modal-close-btn').addEventListener('click', close);
    document.getElementById('modal-action-btn').addEventListener('click', close);
  }

  showGlossaryModal() {
    this.showEducationalModal({
      title: 'Glossário Executivo de M&A & Governança',
      badge: 'Dicionário C-Level',
      icon: '📚',
      content: `
        <div class="glossary-items-list">
          <div class="gi-item">
            <strong>HHI (Índice Herfindahl-Hirschman):</strong>
            <p>Métrica que calcula a concentração somando os quadrados dos market shares (Σ s²). Se passar de 2.500 com delta &gt; 200, o CADE presume risco de cartel ou quase-monopólio.</p>
          </div>
          <div class="gi-item">
            <strong>Poison Pill (Pílula de Veneno):</strong>
            <p>Cláusula societária criada por Martin Lipton que dá aos acionistas existentes o direito de comprar ações com grande desconto se um invasor ultrapassar um limite, diluindo-o.</p>
          </div>
          <div class="gi-item">
            <strong>Golden Parachute (Pára-quedas Dourado):</strong>
            <p>Pacotes indenizatórios milionários para a diretoria caso a empresa seja adquirida, encarecendo a compra para o agressor, mas gerando conflito de agência.</p>
          </div>
          <div class="gi-item">
            <strong>White Knight (Cavaleiro Branco):</strong>
            <p>Investidor amigo que entra em cena para comprar ações e impedir a aquisição hostil por um invasor indesejado.</p>
          </div>
          <div class="gi-item">
            <strong>Venda de UPI (Unidade Produtiva Isolada):</strong>
            <p>Instrumento da Lei 11.101/2005 onde filiais de empresas em RJ são leiloadas totalmente livres de passivos fiscais ou trabalhistas para o comprador.</p>
          </div>
          <div class="gi-item">
            <strong>Margem Dupla (Double Marginalization):</strong>
            <p>Ineficiência que ocorre quando fornecedor e cliente adicionam margens de lucro separadas, encarecendo o produto final. É eliminada na fusão vertical.</p>
          </div>
        </div>
      `
    });
  }
}
