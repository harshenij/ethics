/**
 * ETHICAL MED-AI: Dynamic Chart Visualizations
 * Chart 1: Global Geographic Distribution of Clinical AI Training Data
 * Chart 2: Diagnostic Accuracy Disparity: Baseline AI vs. Ethically Balanced AI
 * Includes built-in SVG fallback renderer if Chart.js is blocked or offline.
 */

(function () {
  'use strict';

  let geoChartInstance = null;
  let parityChartInstance = null;
  let retryCount = 0;
  const MAX_RETRIES = 10;

  function isLightTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light';
  }

  function getChartColors() {
    const light = isLightTheme();
    return {
      textColor: light ? '#334155' : '#cbd5e1',
      titleColor: light ? '#0f172a' : '#f8fafc',
      gridColor: light ? 'rgba(148, 163, 184, 0.2)' : 'rgba(255, 255, 255, 0.08)',
      tooltipBg: light ? '#ffffff' : '#0a1128',
      tooltipBorder: light ? '#cbd5e1' : 'rgba(6, 182, 212, 0.4)',
      tooltipText: light ? '#0f172a' : '#ffffff'
    };
  }

  function renderFallbackCharts() {
    // Fallback for Geo Chart
    const geoCanvas = document.getElementById('geoDistChart');
    if (geoCanvas && geoCanvas.parentElement) {
      geoCanvas.style.display = 'none';
      let existingFallback = document.getElementById('geo-svg-fallback');
      if (!existingFallback) {
        const fallback = document.createElement('div');
        fallback.id = 'geo-svg-fallback';
        fallback.style.cssText = 'width:100%; height:100%; display:flex; flex-direction:column; justify-content:center; gap:0.6rem; padding:1rem 0;';
        
        const regions = [
          { name: 'North America (US & Canada)', val: 51.5, color: '#06b6d4' },
          { name: 'Western & Central Europe', val: 22.8, color: '#8b5cf6' },
          { name: 'East Asia (China, Japan, S. Korea)', val: 18.2, color: '#3b82f6' },
          { name: 'Latin America & Caribbean', val: 3.4, color: '#f59e0b' },
          { name: 'South & Southeast Asia', val: 2.8, color: '#ec4899' },
          { name: 'Sub-Saharan Africa', val: 1.3, color: '#f43f5e' }
        ];

        let html = '';
        regions.forEach(r => {
          html += `
            <div>
              <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:0.25rem;">
                <span style="display:flex; align-items:center; gap:0.4rem;">
                  <span style="width:10px; height:10px; border-radius:50%; background:${r.color};"></span>
                  ${r.name}
                </span>
                <strong>${r.val}%</strong>
              </div>
              <div style="height:8px; border-radius:4px; background:rgba(255,255,255,0.1); overflow:hidden;">
                <div style="width:${r.val}%; height:100%; background:${r.color}; border-radius:4px;"></div>
              </div>
            </div>
          `;
        });
        fallback.innerHTML = html;
        geoCanvas.parentElement.appendChild(fallback);
      }
    }

    // Fallback for Parity Chart
    const parityCanvas = document.getElementById('parityCompareChart');
    if (parityCanvas && parityCanvas.parentElement) {
      parityCanvas.style.display = 'none';
      let existingFallback = document.getElementById('parity-svg-fallback');
      if (!existingFallback) {
        const fallback = document.createElement('div');
        fallback.id = 'parity-svg-fallback';
        fallback.style.cssText = 'width:100%; height:100%; display:flex; flex-direction:column; justify-content:center; gap:0.75rem; padding:1rem 0;';

        const cohorts = [
          { label: 'Fitzpatrick I–II (Fair Skin)', skewed: 96.2, fair: 96.5 },
          { label: 'Fitzpatrick III–IV (Olive Skin)', skewed: 83.5, fair: 94.8 },
          { label: 'Fitzpatrick V–VI (Dark Skin)', skewed: 62.1, fair: 93.7 },
          { label: 'Pediatric Cohort (<16y)', skewed: 71.4, fair: 92.5 }
        ];

        let html = `
          <div style="display:flex; justify-content:flex-end; gap:1.25rem; font-size:0.82rem; margin-bottom:0.5rem;">
            <span style="color:#f43f5e;"><i class="fa-solid fa-square"></i> Baseline (Skewed)</span>
            <span style="color:#06b6d4;"><i class="fa-solid fa-square"></i> Ethically Balanced</span>
          </div>
        `;

        cohorts.forEach(c => {
          html += `
            <div>
              <div style="font-size:0.85rem; font-weight:600; margin-bottom:0.3rem;">${c.label}</div>
              <div style="display:flex; flex-direction:column; gap:0.25rem;">
                <div style="height:8px; border-radius:4px; background:rgba(255,255,255,0.1); overflow:hidden;">
                  <div style="width:${c.skewed}%; height:100%; background:#f43f5e; border-radius:4px;"></div>
                </div>
                <div style="height:8px; border-radius:4px; background:rgba(255,255,255,0.1); overflow:hidden;">
                  <div style="width:${c.fair}%; height:100%; background:#06b6d4; border-radius:4px;"></div>
                </div>
              </div>
            </div>
          `;
        });
        fallback.innerHTML = html;
        parityCanvas.parentElement.appendChild(fallback);
      }
    }
  }

  function initGeoChart() {
    const ctx = document.getElementById('geoDistChart');
    if (!ctx) return;

    const colors = getChartColors();

    const data = {
      labels: [
        'North America (US & Canada)',
        'Western & Central Europe',
        'East Asia (China, Japan, S. Korea)',
        'Latin America & Caribbean',
        'South & Southeast Asia',
        'Sub-Saharan Africa'
      ],
      datasets: [
        {
          data: [51.5, 22.8, 18.2, 3.4, 2.8, 1.3],
          backgroundColor: [
            '#06b6d4',
            '#8b5cf6',
            '#3b82f6',
            '#f59e0b',
            '#ec4899',
            '#f43f5e'
          ],
          borderColor: isLightTheme() ? '#ffffff' : '#050a18',
          borderWidth: 2,
          hoverOffset: 10
        }
      ]
    };

    const config = {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: colors.textColor,
              font: {
                family: "'Inter', sans-serif",
                size: 11
              },
              padding: 14,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: colors.tooltipBg,
            titleColor: colors.titleColor,
            bodyColor: colors.textColor,
            borderColor: colors.tooltipBorder,
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: function (context) {
                return ` ${context.label}: ${context.raw}% of training data`;
              }
            }
          }
        },
        cutout: '62%',
        animation: {
          duration: 1200
        }
      }
    };

    if (geoChartInstance) {
      geoChartInstance.destroy();
    }
    geoChartInstance = new Chart(ctx, config);
  }

  function initParityChart() {
    const ctx = document.getElementById('parityCompareChart');
    if (!ctx) return;

    const colors = getChartColors();

    const data = {
      labels: [
        'Fitzpatrick I–II (Fair)',
        'Fitzpatrick III–IV (Olive)',
        'Fitzpatrick V–VI (Dark)',
        'Pediatric Cohort (<16y)',
        'Geriatric Cohort (>75y)'
      ],
      datasets: [
        {
          label: 'Baseline AI (Skewed Dataset)',
          data: [96.2, 83.5, 62.1, 71.4, 78.2],
          backgroundColor: 'rgba(244, 63, 94, 0.85)',
          borderColor: '#f43f5e',
          borderWidth: 1,
          borderRadius: 6
        },
        {
          label: 'Ethically Balanced & Debiased AI',
          data: [96.5, 94.8, 93.7, 92.5, 93.1],
          backgroundColor: 'rgba(6, 182, 212, 0.85)',
          borderColor: '#06b6d4',
          borderWidth: 1,
          borderRadius: 6
        }
      ]
    };

    const config = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: colors.textColor,
              font: {
                family: "'Inter', sans-serif",
                size: 12
              },
              padding: 12,
              usePointStyle: true,
              pointStyle: 'rectRounded'
            }
          },
          tooltip: {
            backgroundColor: colors.tooltipBg,
            titleColor: colors.titleColor,
            bodyColor: colors.textColor,
            borderColor: colors.tooltipBorder,
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: function (context) {
                return ` ${context.dataset.label}: ${context.raw}% Accuracy`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: colors.textColor,
              font: { family: "'Inter', sans-serif", size: 11 }
            }
          },
          y: {
            min: 50,
            max: 100,
            grid: { color: colors.gridColor },
            ticks: {
              color: colors.textColor,
              font: { family: "'Inter', sans-serif", size: 11 },
              callback: function (val) { return val + '%'; }
            }
          }
        },
        animation: {
          duration: 1200
        }
      }
    };

    if (parityChartInstance) {
      parityChartInstance.destroy();
    }
    parityChartInstance = new Chart(ctx, config);
  }

  function initAllCharts() {
    if (typeof Chart === 'undefined') {
      retryCount++;
      if (retryCount <= MAX_RETRIES) {
        setTimeout(initAllCharts, 250);
      } else {
        // Fallback to pure HTML/SVG rendering
        renderFallbackCharts();
      }
      return;
    }

    try {
      initGeoChart();
      initParityChart();
    } catch (e) {
      console.warn('Chart.js render note:', e);
      renderFallbackCharts();
    }
  }

  window.addEventListener('themeChanged', () => {
    if (typeof Chart !== 'undefined') {
      initAllCharts();
    }
  });

  window.addEventListener('resize', () => {
    if (geoChartInstance) geoChartInstance.resize();
    if (parityChartInstance) parityChartInstance.resize();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllCharts);
  } else {
    initAllCharts();
  }
})();
