/**
 * tests/sandboxPresets.test.js
 * Teste unitário para os cenários e presets do Sandbox
 */
import { SANDBOX_PRESETS } from '../js/sandboxPresets.js';
import { HHIEngine } from '../js/hhiEngine.js';

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FALHA: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ SUCESSO: ${message}`);
  }
}

console.log('--- Testando SANDBOX_PRESETS ---');

const presetKeys = Object.keys(SANDBOX_PRESETS);
assert(presetKeys.length >= 5, `Deve haver pelo menos 5 presets de mercado (encontrados: ${presetKeys.length})`);

presetKeys.forEach(key => {
  const p = SANDBOX_PRESETS[key];
  assert(p.title && p.companies && p.defaultAcquirerId && p.defaultTargetId, `Preset ${key} deve ter estrutura válida`);

  const totalShare = p.companies.reduce((sum, c) => sum + c.share, 0);
  assert(totalShare === 100, `Soma dos shares do preset ${key} deve ser 100% (calculado: ${totalShare}%)`);

  // Simula fusão entre as duas empresas padrão
  const sim = HHIEngine.simulateMerger(p.companies, p.defaultAcquirerId, p.defaultTargetId, 0);
  assert(sim.preHHI > 0, `Pre-HHI do preset ${key} deve ser positivo (calculado: ${sim.preHHI})`);
  assert(sim.postHHI >= sim.preHHI, `Post-HHI da fusão do preset ${key} deve ser maior ou igual (pre: ${sim.preHHI}, post: ${sim.postHHI})`);
  assert(sim.analysis && sim.analysis.badge, `Análise do CADE deve conter veredito para o preset ${key}`);
});

console.log('🎉 Todos os presets do Sandbox foram validados com sucesso!');
