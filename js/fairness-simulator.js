/**
 * ETHICAL MED-AI: AI Fairness Demonstration Simulator
 * Simulates real-time clinical diagnostic performance across two patient cohorts:
 * Group A: Majority / Well-Represented Cohort (e.g., High-income, Fitzpatrick I-II)
 * Group B: Underrepresented / Historically Excluded Cohort (e.g., Fitzpatrick V-VI, rural)
 */

(function () {
  'use strict';

  function initSimulator() {
    // DOM Elements
    const diversitySlider = document.getElementById('sim-diversity');
    const diversityValText = document.getElementById('sim-diversity-val');
    const mitigationSelect = document.getElementById('sim-mitigation');
    const thresholdSlider = document.getElementById('sim-threshold');
    const thresholdValText = document.getElementById('sim-threshold-val');

    // Outputs
    const parityBanner = document.getElementById('sim-parity-banner');
    const parityStatusText = document.getElementById('sim-parity-status');
    const parityGapVal = document.getElementById('sim-parity-gap');
    const overallAccVal = document.getElementById('sim-overall-acc');

    // Group A Elements
    const groupAAccText = document.getElementById('group-a-acc');
    const groupAFill = document.getElementById('group-a-fill');
    const groupAFnrText = document.getElementById('group-a-fnr');
    const groupAFnrFill = document.getElementById('group-a-fnr-fill');

    // Group B Elements
    const groupBAccText = document.getElementById('group-b-acc');
    const groupBFill = document.getElementById('group-b-fill');
    const groupBFnrText = document.getElementById('group-b-fnr');
    const groupBFnrFill = document.getElementById('group-b-fnr-fill');

    // Confusion matrix elements
    const cmA_TP = document.getElementById('cm-a-tp');
    const cmA_FN = document.getElementById('cm-a-fn');
    const cmB_TP = document.getElementById('cm-b-tp');
    const cmB_FN = document.getElementById('cm-b-fn');

    if (!diversitySlider || !mitigationSelect || !thresholdSlider) {
      return;
    }

    function calculateSimulation() {
      try {
        // Inputs
        const diversityPercent = parseFloat(diversitySlider.value) || 10;
        const mitigation = mitigationSelect.value || 'none';
        const threshold = parseFloat(thresholdSlider.value) || 0.5;

        // Update text labels
        if (diversityValText) {
          diversityValText.textContent = `${diversityPercent}% (Group B Share)`;
        }
        if (thresholdValText) {
          thresholdValText.textContent = threshold.toFixed(2);
        }

        // Representation factor: 10% -> 0.0, 50% -> 1.0
        const representationFactor = Math.max(0, Math.min(1, (diversityPercent - 10) / 40));
        const thresholdDelta = threshold - 0.5;

        // Baseline raw accuracies before mitigation:
        let accA = 96.8 - (representationFactor * 2.2) - (thresholdDelta * 4);
        let accB = 64.5 + (representationFactor * 24.5) - (thresholdDelta * 8);

        // False Negative Rate (missed disease diagnoses):
        let fnrB = 37.0 - (representationFactor * 22.0) + (thresholdDelta * 18);
        let fnrA = 4.2 + (representationFactor * 1.5) + (thresholdDelta * 10);

        // Apply Algorithmic Mitigation Strategy
        if (mitigation === 'reweighting') {
          accB += 4.5;
          fnrB -= 5.5;
          accA -= 0.8;
        } else if (mitigation === 'adversarial') {
          accB += 7.2;
          fnrB -= 8.5;
          accA -= 1.4;
        } else if (mitigation === 'equalized_odds') {
          const gap = Math.abs(accA - accB);
          accB += gap * 0.72;
          fnrB = fnrA + (fnrB - fnrA) * 0.28;
          accA -= gap * 0.12;
        }

        // Clamp values to realistic bounds
        accA = Math.min(98.5, Math.max(75.0, accA));
        accB = Math.min(97.0, Math.max(50.0, accB));
        fnrA = Math.max(2.0, Math.min(25.0, fnrA));
        fnrB = Math.max(3.5, Math.min(48.0, fnrB));

        // Overall Accuracy
        const weightA = (100 - diversityPercent) / 100;
        const weightB = diversityPercent / 100;
        const overallAcc = (accA * weightA) + (accB * weightB);

        // Parity Disparity Gap
        const parityGap = Math.abs(accA - accB);

        // Render metrics safely
        if (overallAccVal) overallAccVal.textContent = `${overallAcc.toFixed(1)}%`;
        if (parityGapVal) parityGapVal.textContent = `${parityGap.toFixed(1)}%`;

        if (groupAAccText) groupAAccText.textContent = `${accA.toFixed(1)}%`;
        if (groupAFill) {
          groupAFill.style.width = `${accA}%`;
          groupAFill.style.backgroundColor = accA > 90 ? 'var(--color-cyan)' : 'var(--color-amber)';
        }

        if (groupAFnrText) groupAFnrText.textContent = `${fnrA.toFixed(1)}%`;
        if (groupAFnrFill) {
          groupAFnrFill.style.width = `${Math.min(100, fnrA * 2)}%`;
          groupAFnrFill.style.backgroundColor = fnrA < 10 ? 'var(--color-emerald)' : 'var(--color-rose)';
        }

        if (groupBAccText) groupBAccText.textContent = `${accB.toFixed(1)}%`;
        if (groupBFill) {
          groupBFill.style.width = `${accB}%`;
          groupBFill.style.backgroundColor = accB > 88 ? 'var(--color-purple)' : 'var(--color-rose)';
        }

        if (groupBFnrText) groupBFnrText.textContent = `${fnrB.toFixed(1)}%`;
        if (groupBFnrFill) {
          groupBFnrFill.style.width = `${Math.min(100, fnrB * 2)}%`;
          groupBFnrFill.style.backgroundColor = fnrB < 12 ? 'var(--color-emerald)' : 'var(--color-rose)';
        }

        // Confusion Matrix
        if (cmA_TP) cmA_TP.textContent = Math.round(1000 * (1 - fnrA / 100));
        if (cmA_FN) cmA_FN.textContent = Math.round(1000 * (fnrA / 100));
        if (cmB_TP) cmB_TP.textContent = Math.round(1000 * (1 - fnrB / 100));
        if (cmB_FN) cmB_FN.textContent = Math.round(1000 * (fnrB / 100));

        // Parity Banner Status
        if (parityBanner && parityStatusText) {
          parityBanner.className = 'parity-banner';
          if (parityGap <= 3.0 && fnrB <= 10.0) {
            parityBanner.classList.add('parity-fair');
            parityStatusText.innerHTML = '<i class="fa-solid fa-circle-check"></i> <strong>Clinically Equitable:</strong> Parity gap is below 3% threshold. Diagnoses are equally dependable across cohorts.';
          } else if (parityGap <= 8.0) {
            parityBanner.style.background = 'rgba(245, 158, 11, 0.12)';
            parityBanner.style.borderColor = 'rgba(245, 158, 11, 0.35)';
            parityBanner.style.color = 'var(--color-amber)';
            parityStatusText.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> <strong>Moderate Disparity:</strong> Underrepresented group suffers noticeable diagnostic variance.';
          } else {
            parityBanner.style.background = 'rgba(244, 63, 94, 0.12)';
            parityBanner.style.borderColor = 'rgba(244, 63, 94, 0.35)';
            parityBanner.style.color = 'var(--color-rose)';
            parityStatusText.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> <strong>Critical Bias Hazard:</strong> High disparity gap (>8%). High False Negative rate risks missed diagnoses in Group B.';
          }
        }
      } catch (err) {
        console.warn('Fairness simulator calculation warning:', err);
      }
    }

    // Attach listeners
    diversitySlider.addEventListener('input', calculateSimulation);
    thresholdSlider.addEventListener('input', calculateSimulation);
    mitigationSelect.addEventListener('change', calculateSimulation);

    // Initial run
    calculateSimulation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSimulator);
  } else {
    initSimulator();
  }
})();
