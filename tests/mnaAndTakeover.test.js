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

const mockPlayer = { cash: 100, marketCap: 300, marketShare: 20, friendlyControl: 45 };

// Avaliação de compra viável
const evalSuccess = MNAEngine.evaluateTransaction(mockPlayer, vertical.id, 'CASH');
assert(evalSuccess.canAfford === true, 'Jogador com R$ 100M deve ter caixa para alvo vertical');

// Avaliação de compra inviável por falta de caixa
const mockBrokePlayer = { cash: 5, marketCap: 100, marketShare: 10, friendlyControl: 40 };
const evalFail = MNAEngine.evaluateTransaction(mockBrokePlayer, horizontal.id, 'CASH');
assert(evalFail.canAfford === false, 'Jogador com R$ 5M não deve poder comprar alvo de R$ 75M');

console.log('--- Testando TakeoverEngine ---');
const scenario = TakeoverEngine.createAttackScenario(mockPlayer);
assert(scenario.gordonInitialStake === 18, 'Gordon inicia com 18% das ações no ataque');

// Teste da Poison Pill
const resultPoisonPill = TakeoverEngine.playDefenseCard('poison_pill', scenario, mockPlayer);
assert(resultPoisonPill.success === true, 'Poison pill deve ser ativada com sucesso');
assert(resultPoisonPill.updatedGordonStake < scenario.gordonInitialStake, 'Poison pill deve diluir participação de Gordon');
assert(resultPoisonPill.gordonDefeated === true, 'Poison pill deve derrotar o ataque hostil');

// Teste do Golden Parachute
const resultParachute = TakeoverEngine.playDefenseCard('golden_parachute', scenario, mockPlayer);
assert(resultParachute.governanceChange < 0, 'Golden Parachute deve penalizar governança por conflito de agência');

console.log('🎉 Todos os testes de MNAEngine e TakeoverEngine passaram com sucesso!');
