# 🏛️ AnimM&A: O Jogo do Controle Corporativo

> **Web App PWA Mobile-First de M&A, Governança Corporativa e Leis Antitruste**  
> *Assuma o papel de CEO na B3, comande fusões estratégicas, calcule o HHI em tempo real, sobreviva a ataques hostis do Tubarão Gordon e aprenda táticas societárias e de recuperação judicial!*

---

## 🎯 1. Visão Geral e Objetivo

**AnimM&A** é um Web App interativo e gamificado otimizado para celulares (Progressive Web App), onde o jogador assume o papel de CEO de uma companhia aberta de tecnologia brasileira (**NexTech Brasil S.A. - NXTK3**) listada na B3.

O objetivo é expandir os negócios através de **Fusões e Aquisições (M&A)**, defender o controle da empresa contra investidores ativistas hostis, negociar aprovações antitruste com o **CADE** e enfrentar cenários macroeconômicos de juros elevados (Selic 2025/2026) e reestruturação judicial.

---

## 👥 2. Os Agentes do Mercado (Personagens)

| Personagem | Papel no Mercado | Estilo e Comportamento no Jogo |
|---|---|---|
| **🦈 Tubarão Gordon (O Agressor)** | **Takeover Hostil** | Predador de Wall Street e da B3 que busca empresas mal geridas para protocolar Ofertas Públicas de Aquisição (OPA) hostis com prêmio tentador aos acionistas minoritários. Atua como o **mecanismo externo de governança** (Teoria de Henry Manne, 1965), forçando a diretoria a ser eficiente sob risco de destituição. |
| **⚖️ Dra. Defesa (A Advogada Societária)** | **Táticas de Defesa** | Estrategista societária de topo que oferece um arsenal de *Poison Pills* (pílulas de veneno), *Shark Repellents*, *Golden Parachutes* e *White Knights*. Alerta o jogador sobre os riscos de **conflito de agência** e entrincheiramento gerencial. |
| **🏛️ Inspetor CADE (O Regulador)** | **Defesa da Concorrência** | Fiscal rigoroso do Conselho Administrativo de Defesa Econômica (CADE). Calcula matematicamente o **Índice Herfindahl-Hirschman (HHI)** para fusões horizontais, avalia barreiras de entrada e impõe remédios estruturais (desinvestimento) ou vetos. |

---

## 🧠 3. Conceitos Econômicos e Jurídicos Ensinados

1. **Classificação de M&A**:
   - **Fusão Horizontal:** Concorrentes diretos. Gera ganho de escala e poder de precificação, mas aciona escrutínio antitruste rigoroso pelo CADE.
   - **Fusão Vertical:** Fornecedores (*upstream*) ou distribuidores (*downstream*). Elimina a **Margem Dupla** (*Double Marginalization*) e reduz custos de transação (Teoria de Ronald Coase e Oliver Williamson).
   - **Conglomerado:** Setores não correlacionados (ex: Tech + Finanças). Diversifica receita e risco de liquidez, mas pode sofrer o "desconto de conglomerado" (*conglomerate discount*).

2. **O Teste Antitruste (HHI em Tempo Real)**:
   - Fórmula: $\text{HHI} = \sum_{i=1}^{n} s_i^2$, onde $s_i$ é a fatia percentual de cada firma.
   - $\Delta \text{HHI} = 2 \cdot s_A \cdot s_B$.
   - **Diretrizes do CADE:**
     - $\text{HHI} < 1.500$: Mercado Desconcentrado (Aprovação sumária sem restrições).
     - $1.500 \le \text{HHI} \le 2.500$: Mercado Moderado (Atenção se $\Delta \text{HHI} > 100$).
     - $\text{HHI} > 2.500$: Mercado Altamente Concentrado (Se $\Delta \text{HHI} > 200$, presunção de risco oligopolista; exige remédios estruturais ou veto).

3. **Defesas contra Takeovers Hostis**:
   - **Flip-in Poison Pill:** Emissão de ações com desconto expressivo para aliados, diluindo o invasor.
   - **Golden Parachute:** Indenizações rescisórias estratosféricas para a diretoria, encarecendo a troca de controle (com custo na governança pelo conflito de agência).
   - **Crown Jewel Defense:** Alienação do ativo mais cobiçado para um parceiro estratégico.
   - **White Knight:** Ingressão de um parceiro institucional amigo para comprar um bloco de bloqueio.
   - **People Pill & Pac-Man Defense:** Ameaça de renúncia de talentos-chave ou contra-OPA.

4. **Crise, Insolvência e Distressed M&A**:
   - **Falência (Art. 75 Lei 11.101/05):** Liquidação forçada com destruição do valor intangível.
   - **Recuperação Judicial (Lei 11.101/05):** Preservação da empresa viável, *Stay Period* de 180 dias, repactuação com credores (*haircut*) e **venda de UPI (Unidade Produtiva Isolada)** blindada contra sucessão de dívidas trabalhistas e fiscais.

5. **Cenários do Mundo Real**:
   - **Sadia vs. Perdigão (2006-2011):** O caso emblemático brasileiro de OPA hostil em 2006, crise cambial com derivativos em 2008, fusão amigável criando a BRF em 2009 e os remédios impostos pelo CADE em 2011.
   - **Cenário Macroeconômico 2025/2026:** Taxa Selic em patamar elevado tornando o M&A a principal ferramenta de consolidação e financiamento para o setor de Tecnologia no Brasil.

---

## 📱 4. Experiência Mobile-First e Gamificação

- **Design Responsivo Vertical:** Projetado sob medida para o uso com o polegar em smartphones, com navegação inferior fixa (*Bottom Navigation Bar*).
- **Emulação Desktop:** Quando aberto no navegador do desktop, renderiza um chassi elegante de smartphone centralizado.
- **Gráficos SVG em Tempo Real:** Gráfico Donut de Market Share com tooltip de dados, barra tricolor do HHI com limites do CADE e termômetro acionário de controle do Conselho.
- **Sintetizador de Áudio Procedural:** Efeitos sonoros ricos usando apenas a Web Audio API nativa (sem arquivos pesados externos), com botão para mutar.
- **PWA Completo:** Arquivo `manifest.json` com ícones vetoriais modernos e `sw.js` com suporte a execução 100% offline.

---

## 🗺️ 5. Jornada do Usuário (User Flow)

1. **Capítulo 1: Onboarding** – Posse como CEO da NexTech Brasil S.A. no cenário de Selic alta em 2025.
2. **Capítulo 2: A Primeira Fusão** – Aquisição vertical da fornecedora de servidores CloudData, eliminando a margem dupla.
3. **Capítulo 3: O Ataque do Tubarão** – Gordon lança OPA hostil com 35% de prêmio direto na B3.
4. **Capítulo 4: O Dilema da Defesa** – Escolha de cartas táticas (Poison Pill, White Knight, etc.) e gestão do conflito de agência.
5. **Capítulo 5: Crescimento e o CADE** – Fusão horizontal com a concorrente Vanguard Tech, com cálculo de HHI e ajuste de remédios estruturais.
6. **Capítulo 6: Crise & Casos Históricos** – Simulação de estresse macroeconômico, compra judicial de UPI e estudo de caso Sadia vs. Perdigão.
7. **Capítulo 7: Desfecho** – Relatório final de **Eficiência Alocativa e Governança**, perfil de liderança e desbloqueio do modo Sandbox livre.

---

## 🚀 6. Como Executar Localmente

### Opção 1: Via Python
```bash
python serve.py
```
Acesse em: `http://localhost:3001`

### Opção 2: Via Node.js
```bash
node server.js
```
Acesse em: `http://localhost:3001`

### Opção 3: No Windows (Duplo-clique)
Dê um duplo-clique no arquivo `run.bat`.

---

## 🧪 7. Testes Automatizados

Para rodar os testes unitários matemáticos do motor HHI, regras antitruste do CADE e defesas societárias:

```bash
npm.cmd test
# ou
node tests/hhiEngine.test.js && node tests/mnaAndTakeover.test.js
```

---

## 📁 8. Estrutura de Arquivos

```
anim-mna/
├── assets/
│   └── icons/
│       ├── icon-192.svg       # Ícone PWA 192x192
│       └── icon-512.svg       # Ícone PWA 512x512
├── css/
│   ├── animations.css         # Efeitos de shake, zoom e fade
│   ├── components.css         # Cards, widgets SVG, modais e badges
│   └── main.css               # Shell mobile-first e temas
├── js/
│   ├── app.js                 # Ponto de entrada e Service Worker
│   ├── audioEffects.js        # Sintetizador procedural Web Audio API
│   ├── characters.js          # Gordon, Dra. Defesa e Inspetor CADE (SVGs e diálogos)
│   ├── chartRenderer.js       # Donut Chart e Barras SVG interativas
│   ├── crisisEngine.js        # Falência vs Recuperação Judicial e UPI
│   ├── gameState.js           # Gerenciamento de estado reativo e persistência
│   ├── hhiEngine.js           # Cálculo de HHI, Delta e pareceres do CADE
│   ├── historicalScenarios.js # Caso Sadia x Perdigão e Selic 2025/2026
│   ├── mnaEngine.js           # Fusões Horizontal, Vertical e Conglomerado
│   ├── takeoverEngine.js      # Cartas de defesa societária e OPA hostil
│   └── ui.js                  # Controlador dinâmico de telas e modais
├── tests/
│   ├── hhiEngine.test.js      # Testes matemáticos de HHI e CADE
│   └── mnaAndTakeover.test.js # Testes de M&A e táticas de defesa
├── index.html                 # PWA Shell Mobile-First
├── manifest.json              # Web App Manifest
├── package.json               # Configuração e scripts
├── README.md                  # Documentação completa
├── run.bat                    # Inicializador Windows
├── serve.py                   # Servidor Python local
├── server.js                  # Servidor Node.js local
└── sw.js                      # Service Worker offline
```
