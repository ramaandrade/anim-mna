/**
 * chartRenderer.js
 * Renderizador de Gráficos Vetoriais SVG Leves e de Alto Desempenho para Mobile
 * - Donut Chart de Market Share
 * - Barra Comparativa de HHI com Faixas CADE
 * - Termômetro de Controle Acionário (Gordon vs Bloco de Controle)
 */

export class ChartRenderer {
  /**
   * Renderiza Donut Chart SVG de fatias de mercado
   * @param {Array<{id: string, name: string, share: number, color?: string}>} items 
   * @param {number} size 
   * @param {string} centerLabel 
   */
  static renderMarketDonut(items, size = 260, centerLabel = 'Market Share') {
    const total = items.reduce((sum, item) => sum + (Number(item.share) || 0), 0) || 100;
    const radius = size / 2;
    const innerRadius = radius * 0.58;
    const center = radius;

    const defaultColors = [
      '#38bdf8', // Azul Ciano (Jogador)
      '#ef4444', // Vermelho (Rival Vanguard)
      '#a855f7', // Roxo (Alpha SaaS)
      '#10b981', // Verde (Beta Cloud)
      '#f59e0b', // Âmbar (PayExpress)
      '#64748b'  // Cinza (Outros)
    ];

    let currentAngle = -90; // Começa no topo

    const slicesSvg = items.map((item, index) => {
      const share = Number(item.share) || 0;
      const angle = (share / total) * 360;
      const color = item.color || defaultColors[index % defaultColors.length];

      if (angle <= 0) return '';

      // Ângulos em radianos
      const startRad = (currentAngle * Math.PI) / 180;
      const endRad = ((currentAngle + angle) * Math.PI) / 180;

      // Coordenadas externas
      const x1 = center + radius * Math.cos(startRad);
      const y1 = center + radius * Math.sin(startRad);
      const x2 = center + radius * Math.cos(endRad);
      const y2 = center + radius * Math.sin(endRad);

      // Coordenadas internas
      const x3 = center + innerRadius * Math.cos(endRad);
      const y3 = center + innerRadius * Math.sin(endRad);
      const x4 = center + innerRadius * Math.cos(startRad);
      const y4 = center + innerRadius * Math.sin(startRad);

      const largeArc = angle > 180 ? 1 : 0;

      const pathData = `
        M ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
        L ${x3} ${y3}
        A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
        Z
      `;

      currentAngle += angle;

      return `
        <path d="${pathData.trim()}" 
              fill="${color}" 
              stroke="#090d16" 
              stroke-width="2.5"
              data-name="${item.name}" 
              data-share="${share}%"
              class="donut-slice" />
      `;
    }).join('');

    return `
      <div class="donut-chart-container">
        <svg viewBox="0 0 ${size} ${size}" class="responsive-svg-chart" width="${size}" height="${size}">
          <g>${slicesSvg}</g>
          <!-- Círculo Central para Visual Donut -->
          <circle cx="${center}" cy="${center}" r="${innerRadius - 3}" fill="#0f172a" />
          <text x="${center}" y="${center - 6}" text-anchor="middle" fill="#94a3b8" font-size="11" font-weight="600" font-family="system-ui">
            ${centerLabel}
          </text>
          <text x="${center}" y="${center + 16}" text-anchor="middle" fill="#f8fafc" font-size="16" font-weight="700" font-family="system-ui">
            100%
          </text>
        </svg>
        <div class="donut-legend">
          ${items.map((item, index) => {
            const color = item.color || defaultColors[index % defaultColors.length];
            return `
              <div class="legend-chip">
                <span class="legend-color-dot" style="background-color: ${color}"></span>
                <span class="legend-label">${item.name}:</span>
                <strong class="legend-val">${item.share}%</strong>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Renderiza Gráfico de Barra do HHI com os Limiares do CADE (1500 e 2500)
   */
  static renderHHIBar(preHHI, postHHI, deltaHHI) {
    const maxScale = 5000; // Escala máxima para boa visualização
    const preWidth = Math.min(100, (preHHI / maxScale) * 100);
    const postWidth = Math.min(100, (postHHI / maxScale) * 100);

    const pos1500 = (1500 / maxScale) * 100;
    const pos2500 = (2500 / maxScale) * 100;

    let barColor = '#10b981'; // Verde (< 1500)
    let statusText = 'Desconcentrado (Livre)';
    if (postHHI >= 1500 && postHHI <= 2500) {
      barColor = '#f59e0b';
      statusText = 'Moderado (Atenção)';
    } else if (postHHI > 2500) {
      barColor = '#ef4444';
      statusText = 'Altamente Concentrado (Escrutínio Severo)';
    }

    return `
      <div class="hhi-bar-widget">
        <div class="hhi-header-row">
          <div class="hhi-stat-box">
            <span class="hhi-lbl">HHI Pré-Fusão</span>
            <span class="hhi-val">${preHHI} pts</span>
          </div>
          <div class="hhi-delta-pill ${deltaHHI > 200 ? 'danger' : deltaHHI > 100 ? 'warning' : 'success'}">
            <span>Δ ${deltaHHI >= 0 ? '+' : ''}${deltaHHI}</span>
          </div>
          <div class="hhi-stat-box right">
            <span class="hhi-lbl">HHI Pós-Fusão</span>
            <span class="hhi-val highlight" style="color: ${barColor}">${postHHI} pts</span>
          </div>
        </div>

        <!-- Trilha da Barra com Marcadores do CADE -->
        <div class="hhi-track-container">
          <div class="hhi-track-bg">
            <div class="hhi-zone zone-green" style="left: 0%; width: ${pos1500}%" title="Pouco Concentrado (< 1500)"></div>
            <div class="hhi-zone zone-yellow" style="left: ${pos1500}%; width: ${pos2500 - pos1500}%" title="Moderado (1500-2500)"></div>
            <div class="hhi-zone zone-red" style="left: ${pos2500}%; width: ${100 - pos2500}%" title="Altamente Concentrado (> 2500)"></div>

            <!-- Marcadores verticais do CADE -->
            <div class="hhi-marker-line" style="left: ${pos1500}%">
              <span class="marker-tag">1.500</span>
            </div>
            <div class="hhi-marker-line" style="left: ${pos2500}%">
              <span class="marker-tag">2.500</span>
            </div>

            <!-- Barra animada de preenchimento pós-fusão -->
            <div class="hhi-fill-bar" style="width: ${postWidth}%; background-color: ${barColor}"></div>
          </div>
        </div>

        <div class="hhi-footer-legend">
          <span class="hhi-zone-tag"><i class="dot green"></i> Desconcentrado</span>
          <span class="hhi-zone-tag"><i class="dot yellow"></i> Moderado</span>
          <span class="hhi-zone-tag"><i class="dot red"></i> Crítico CADE</span>
        </div>
      </div>
    `;
  }

  /**
   * Renderiza o Termômetro Acionário da Batalha de Controle contra Gordon
   */
  static renderOwnershipBar(friendlyShare, gordonShare, freeFloat) {
    const total = (friendlyShare + gordonShare + freeFloat) || 100;
    const fPct = Math.round((friendlyShare / total) * 100);
    const gPct = Math.round((gordonShare / total) * 100);
    const ffPct = Math.max(0, 100 - fPct - gPct);

    return `
      <div class="ownership-widget">
        <div class="ownership-header">
          <span class="ow-title">🛡️ Estrutura de Voto do Conselho</span>
          <span class="ow-goal">Controle = 50% + 1</span>
        </div>
        
        <div class="ownership-bar-track">
          <!-- Bloco Amigável (Você / Conselho) -->
          <div class="ow-segment friendly" style="width: ${fPct}%" title="Seu Bloco Amigável: ${fPct}%">
            <span>${fPct}%</span>
          </div>
          <!-- Tubarão Gordon -->
          <div class="ow-segment gordon" style="width: ${gPct}%" title="Tubarão Gordon: ${gPct}%">
            <span>${gPct > 5 ? `${gPct}%` : ''}</span>
          </div>
          <!-- Free Float (Mercado) -->
          <div class="ow-segment freefloat" style="width: ${ffPct}%" title="Free Float (Mercado): ${ffPct}%">
            <span>${ffPct > 8 ? `${ffPct}%` : ''}</span>
          </div>

          <!-- Linha de Corte de 50% de Controle -->
          <div class="ow-threshold-50" title="Linha de 50% para Maioria Absoluta">
            <span class="thresh-pin">50%</span>
          </div>
        </div>

        <div class="ownership-legend">
          <div class="ow-chip friendly">
            <span class="dot"></span>
            <span>Você & Conselho: <strong>${fPct}%</strong></span>
          </div>
          <div class="ow-chip gordon">
            <span class="dot"></span>
            <span>Tubarão Gordon: <strong>${gPct}%</strong></span>
          </div>
          <div class="ow-chip freefloat">
            <span class="dot"></span>
            <span>Free Float (B3): <strong>${ffPct}%</strong></span>
          </div>
        </div>
      </div>
    `;
  }
}
