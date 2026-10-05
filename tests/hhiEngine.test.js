/**
 * tests/hhiEngine.test.js
 * Testes unitários para o motor HHI e regras CADE
 */
import { HHIEngine, CADE_THRESHOLDS } from '../js/hhiEngine.js';

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FALHA: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ SUCESSO: ${message}`);
  }
}

console.log('--- Testando HHIEngine ---');

// Teste 1: HHI de monopólio puro (100%) -> 10.000
const monopolyHHI = HHIEngine.calculateHHI([100]);
assert(monopolyHHI === 10000, `HHI de monopólio deve ser 10.000 (calculado: ${monopolyHHI})`);

// Teste 2: HHI de duopólio simétrico (50% e 50%) -> 2500 + 2500 = 5000
const duopolyHHI = HHIEngine.calculateHHI([50, 50]);
assert(duopolyHHI === 5000, `HHI de duopólio (50/50) deve ser 5000 (calculado: ${duopolyHHI})`);

// Teste 3: HHI de 5 empresas de 20% -> 5 * 400 = 2000
const fiveEqualHHI = HHIEngine.calculateHHI([20, 20, 20, 20, 20]);
assert(fiveEqualHHI === 2000, `HHI de 5 empresas de 20% deve ser 2000 (calculado: ${fiveEqualHHI})`);

// Teste 4: Delta HHI analítico vs empírico (2 * 20 * 20 = 800)
const deltaFormula = HHIEngine.calculateDeltaHHI(20, 20);
assert(deltaFormula === 800, `Delta HHI entre 20% e 20% deve ser 800 (calculado: ${deltaFormula})`);

// Teste 5: Simulação de fusão e parecer do CADE
const companies = [
  { id: 'player_a', name: 'NexTech (Você)', share: 25 },
  { id: 'player_b', name: 'Vanguard Tech', share: 20 },
  { id: 'player_c', name: 'Alpha SaaS', share: 20 },
  { id: 'player_d', name: 'Beta Cloud', share: 15 },
  { id: 'player_e', name: 'Outros Menores', share: 20 }
];

// Pre-HHI: 25^2 + 20^2 + 20^2 + 15^2 + 20^2 = 625 + 400 + 400 + 225 + 400 = 2050
const preHHI = HHIEngine.calculateHHI(companies.map(c => c.share));
assert(preHHI === 2050, `Pre-HHI deve ser 2050 (calculado: ${preHHI})`);

// Fusão entre A (25) e B (20) sem remédios:
// Nova empresa tem 45%. Post-HHI: 45^2 + 20^2 + 15^2 + 20^2 = 2025 + 400 + 225 + 400 = 3050. Delta = 1000.
const simNoRemedy = HHIEngine.simulateMerger(companies, 'player_a', 'player_b', 0);
assert(simNoRemedy.postHHI === 3050, `Post-HHI sem remédio deve ser 3050 (calculado: ${simNoRemedy.postHHI})`);
assert(simNoRemedy.deltaHHI === 1000, `Delta-HHI deve ser 1000 (calculado: ${simNoRemedy.deltaHHI})`);
assert(simNoRemedy.analysis.status === 'REPROVADO_VETO', `Fusão com HHI > 2500 e Delta > 200 deve ser vetada sem remédios`);

// Fusão com Remédio Estrutural de 10% desinvestido:
const simWithRemedy = HHIEngine.simulateMerger(companies, 'player_a', 'player_b', 10);
assert(simWithRemedy.analysis.canPass === true, `Fusão com remédio pesado deve ser aprovada`);

console.log('🎉 Todos os testes de HHIEngine passaram com sucesso!');
