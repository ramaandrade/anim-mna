/**
 * tests/mnaAndTakeover.test.js
 * Testes unitários para MNAEngine e TakeoverEngine
 */
import { MNAEngine, MNA_TYPES } from '../js/mnaEngine.js';
import { TakeoverEngine, DEFENSE_CARDS } from '../js/takeoverEngine.js';

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FALHA: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ SUCESSO: ${message}`);
  }
}

console.log('--- Testando MNAEngine ---');
const targets = MNAEngine.getAvailableTargets();
assert(targets.length >= 3, `Deve haver pelo menos 3 alvos de M&A disponíveis (encontrados: ${targets.length})`);

const horizontal = targets.find(t => t.type === 'HORIZONTAL');
const vertical = targets.find(t => t.type === 'VERTICAL');
const conglomerate = targets.find(t => t.type === 'CONGLOMERADO');

assert(!!horizontal, 'Deve existir alvo Horizontal');
assert(!!vertical, 'Deve existir alvo Vertical');
assert(!!conglomerate, 'Deve existir alvo Conglomerado');

const mockPlayer = { cash: 100, marketCap: 300, marketShare: 20, friendlyControl: 38 };

// Avaliação de compra viável
const evalSuccess = MNAEngine.evaluateTransaction(mockPlayer, vertical.id, 'CASH');
assert(evalSuccess.canAfford === true, 'Jogador com R$ 100M deve ter caixa para alvo vertical');

// Avaliação de compra inviável por falta de caixa
const mockBrokePlayer = { cash: -24, marketCap: 100, marketShare: 10, friendlyControl: 38 };
const evalFail = MNAEngine.evaluateTransaction(mockBrokePlayer, horizontal.id, 'CASH');
assert(evalFail.canAfford === false, 'Jogador com R$ -24M não deve poder comprar alvo de R$ 75M à vista');

console.log('--- Testando TakeoverEngine ---');
const scenario = TakeoverEngine.createAttackScenario(mockPlayer);
assert(scenario.gordonInitialStake === 18, 'Gordon inicia com 18% das ações no ataque');

// Teste da Poison Pill com caixa suficiente
const resultPoisonPill = TakeoverEngine.playDefenseCard('poison_pill', scenario, mockPlayer, 'CASH');
assert(resultPoisonPill.success === true, 'Poison pill deve ser ativada com sucesso');
assert(resultPoisonPill.updatedGordonStake < scenario.gordonInitialStake, 'Poison pill deve diluir participação de Gordon');
assert(resultPoisonPill.gordonDefeated === true, 'Poison pill deve derrotar o ataque hostil');

// Teste do Golden Parachute
const resultParachute = TakeoverEngine.playDefenseCard('golden_parachute', scenario, mockPlayer, 'CASH');
assert(resultParachute.governanceChange < 0, 'Golden Parachute deve penalizar governança por conflito de agência');

// Teste da People Pill com jogador em caixa negativo (R$ -24M)
const resultPeoplePillBroke = TakeoverEngine.playDefenseCard('people_pill', scenario, mockBrokePlayer);
assert(resultPeoplePillBroke.success === true, 'People Pill deve funcionar mesmo com caixa negativo (custo R$ 0)');
assert(resultPeoplePillBroke.cashSpent === 0, 'People Pill não deve gastar caixa');

// Teste da Joia da Coroa (deve gerar entrada de caixa)
const resultCrownJewel = TakeoverEngine.playDefenseCard('crown_jewel', scenario, mockBrokePlayer);
assert(resultCrownJewel.success === true, 'Crown Jewel deve funcionar com sucesso');
assert(resultCrownJewel.cashGained === 25, 'Crown Jewel deve injetar R$ 25M de caixa');

// Teste do Cavaleiro Branco (deve gerar entrada de capital e aporte de R$ 30M)
const resultWhiteKnight = TakeoverEngine.playDefenseCard('white_knight', scenario, mockBrokePlayer);
assert(resultWhiteKnight.success === true, 'White Knight deve ser acolhido com sucesso');
assert(resultWhiteKnight.cashGained === 30, 'White Knight deve aportar R$ 30M no caixa');

// Teste de Poison Pill com caixa negativo financiada via debêntures/dívida
const resultPoisonPillDebt = TakeoverEngine.playDefenseCard('poison_pill', scenario, mockBrokePlayer, 'DEBT');
assert(resultPoisonPillDebt.success === true, 'Poison Pill deve ser ativada via debêntures');
assert(resultPoisonPillDebt.debtAdded === 12, 'Poison Pill via dívida deve adicionar R$ 12M de dívida');
assert(resultPoisonPillDebt.cashSpent === 0, 'Poison Pill via dívida não gasta caixa');

// Teste de Aceitar a Oferta de Gordon
const resultAcceptGordon = TakeoverEngine.acceptGordonOffer(scenario, mockPlayer);
assert(resultAcceptGordon.success === true, 'Aceitar oferta de Gordon deve ter sucesso');
assert(resultAcceptGordon.gordonTakeoverWon === true, 'Gordon deve assumir o controle ao aceitar oferta');
assert(resultAcceptGordon.severanceBonus > 0, 'CEO deve receber indenização rescisória na saída');

console.log('🎉 Todos os testes de MNAEngine e TakeoverEngine passaram com sucesso!');
