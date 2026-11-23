/**
 * ETHICAL MED-AI: Dataset Bias Awareness Quiz
 * Interactive educational assessment evaluating engineering ethics in medical AI.
 */

(function () {
  'use strict';

  const quizQuestions = [
    {
      id: 1,
      question: "Why can an AI dermatology classifier achieve 95% overall benchmark accuracy in laboratory testing yet produce inaccurate diagnoses for darker skin tones in clinical practice?",
      options: [
        { text: "Laboratory computers possess higher GPU compute power than hospital workstations.", correct: false },
        { text: "The training dataset predominantly contained Fitzpatrick skin types I–II, so the model learned features specific to lighter skin while darker skin was underrepresented.", correct: true },
        { text: "Darker skin tones are biologically immune to common dermatological conditions.", correct: false },
        { text: "Convolutional neural networks cannot process color medical photographs.", correct: false }
      ],
      explanation: "<strong>Subgroup Performance Disparity:</strong> When 80%+ of training samples represent light skin tones, a model can maximize aggregate accuracy by excelling on the majority class, masking critical diagnostic failures and elevated false-negative rates on underrepresented patient groups."
    },
    {
      id: 2,
      question: "In the famous 2019 study published in Science (Obermeyer et al.), what caused a widely deployed commercial healthcare algorithm to exhibit severe racial bias against Black patients?",
      options: [
        { text: "The engineers wrote explicit discriminatory rules into the software code.", correct: false },
        { text: "The algorithm used historical healthcare expenditure as a proxy for illness severity, ignoring that less money was spent on Black patients due to systemic access barriers.", correct: true },
        { text: "The AI system experienced a floating-point mathematical overflow error during gradient descent.", correct: false },
        { text: "The algorithm was mistakenly trained on veterinary clinical records instead of human patients.", correct: false }
      ],
      explanation: "<strong>Label Choice & Proxy Bias:</strong> The algorithm predicted future healthcare cost as a proxy for health need. Because systemic disparities resulted in lower historical healthcare spending for Black patients with identical illness severity, the algorithm mistakenly predicted they were healthier and needed less clinical support."
    },
    {
      id: 3,
      question: "How does 'Federated Learning' help resolve geographic dataset bias while complying with international health data regulations like GDPR and HIPAA?",
      options: [
        { text: "By uploading all international patient EHR records to a single public cloud repository.", correct: false },
        { text: "By training models locally inside hospitals across different countries and only transmitting encrypted model weight updates to a central coordinator without exporting raw patient data.", correct: true },
        { text: "By replacing human physicians with fully automated diagnostic bots.", correct: false },
        { text: "By translating all international medical records into a single language using automated translators.", correct: false }
      ],
      explanation: "<strong>Privacy-Preserving Distributed AI:</strong> Federated learning allows institutions across the Global South and North to collaborate. Patient health data never leaves the hospital boundary; only mathematical gradients are shared, enabling diverse global AI training without compromising patient privacy or data sovereignty."
    },
    {
      id: 4,
      question: "Under the engineering ethics principle of 'Transparency & Explainability', which method allows radiologists to verify which anatomical features influenced an AI's chest X-ray diagnosis?",
      options: [
        { text: "Grad-CAM (Gradient-weighted Class Activation Mapping) and saliency heatmaps.", correct: true },
        { text: "Increasing monitor backlight brightness in the radiology suite.", correct: false },
        { text: "Doubling the neural network's clock cycle frequency during inference.", correct: false },
        { text: "Compressing high-resolution DICOM images into lossy thumbnail files.", correct: false }
      ],
      explanation: "<strong>Explainable AI (XAI):</strong> Grad-CAM highlights the exact pixel clusters that activated the neural network. This ensures the model is detecting real pulmonary pathology rather than relying on spurious correlations, such as hospital markers or scanner-specific artifacts."
    },
    {
      id: 5,
      question: "According to the World Health Organization (WHO) and international medical AI standards, what is required after a clinical AI model is validated and deployed?",
      options: [
        { text: "Auditing should cease because the model passed pre-deployment validation once.", correct: false },
        { text: "Continuous post-market surveillance and algorithmic drift monitoring to detect performance variations across changing demographic cohorts and clinical environments.", correct: true },
        { text: "Immediate granting of autonomous robotic surgical privileges without human oversight.", correct: false },
        { text: "Purging and resetting the neural weights every 24 hours.", correct: false }
      ],
      explanation: "<strong>Continuous Algorithmic Stewardship:</strong> Clinical populations and disease presentations evolve over time (covariate shift). Post-market surveillance ensures that AI models maintain diagnostic parity, clinical safety, and ethical compliance throughout their active operational lifespan."
    }
  ];

  let currentQuestionIndex = 0;
  let score = 0;
  let answered = false;

  function initQuiz() {
    const quizCounter = document.getElementById('quiz-counter');
    const quizScoreDisplay = document.getElementById('quiz-score-display');
    const quizQuestionEl = document.getElementById('quiz-question');
    const quizOptionsContainer = document.getElementById('quiz-options');
    const quizExplanation = document.getElementById('quiz-explanation');
    const quizNextBtn = document.getElementById('quiz-next-btn');

    if (!quizQuestionEl || !quizOptionsContainer) return;

    function loadQuestion(index) {
      answered = false;
      const q = quizQuestions[index];

      if (quizCounter) quizCounter.textContent = `Question ${index + 1} of ${quizQuestions.length}`;
      if (quizScoreDisplay) quizScoreDisplay.textContent = `Score: ${score}`;
      if (quizQuestionEl) quizQuestionEl.textContent = q.question;

      if (quizExplanation) {
        quizExplanation.classList.remove('show');
        quizExplanation.innerHTML = '';
      }
      if (quizNextBtn) quizNextBtn.style.display = 'none';

      quizOptionsContainer.innerHTML = '';

      q.options.forEach((opt, optIndex) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.innerHTML = `<span style="font-weight:700; width:26px; height:26px; border-radius:50%; background:rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; flex-shrink:0;">${String.fromCharCode(65 + optIndex)}</span><span>${opt.text}</span>`;
        btn.addEventListener('click', () => handleOptionClick(btn, opt, q));
        quizOptionsContainer.appendChild(btn);
      });
    }

    function handleOptionClick(selectedBtn, selectedOption, questionObj) {
      if (answered) return;
      answered = true;

      const allButtons = quizOptionsContainer.querySelectorAll('.quiz-option-btn');

      allButtons.forEach((btn, idx) => {
        btn.style.pointerEvents = 'none';
        if (questionObj.options[idx].correct) {
          btn.classList.add('correct');
        }
      });

      if (selectedOption.correct) {
        score++;
        if (quizScoreDisplay) quizScoreDisplay.textContent = `Score: ${score}`;
      } else {
        selectedBtn.classList.add('wrong');
      }

      if (quizExplanation) {
        quizExplanation.innerHTML = questionObj.explanation;
        quizExplanation.classList.add('show');
      }

      if (quizNextBtn) {
        quizNextBtn.style.display = 'inline-flex';
        if (currentQuestionIndex === quizQuestions.length - 1) {
          quizNextBtn.innerHTML = '<i class="fa-solid fa-flag-checkered"></i> View Final Results';
        } else {
          quizNextBtn.innerHTML = 'Next Question <i class="fa-solid fa-arrow-right"></i>';
        }
      }
    }

    function showResults() {
      if (quizCounter) quizCounter.textContent = 'Assessment Completed';
      const percentage = Math.round((score / quizQuestions.length) * 100);

      let gradeTitle = '';
      let gradeDescription = '';

      if (percentage >= 80) {
        gradeTitle = 'Distinguished Medical AI Ethics Champion';
        gradeDescription = 'Outstanding! You demonstrate exceptional mastery of engineering ethics, debiasing methodologies, and global healthcare equity principles.';
      } else if (percentage >= 60) {
        gradeTitle = 'Proficient Clinical AI Engineer';
        gradeDescription = 'Good work! You understand core algorithmic bias concepts and ethical safeguards in healthcare technology.';
      } else {
        gradeTitle = 'Foundational Learner in Medical AI';
        gradeDescription = 'Keep exploring! Review the dataset bias mechanisms and engineering solutions above to strengthen your ethical AI foundation.';
      }

      if (quizQuestionEl) quizQuestionEl.textContent = `Your Final Score: ${score} / ${quizQuestions.length} (${percentage}%)`;

      quizOptionsContainer.innerHTML = `
        <div style="background: var(--bg-input); padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--border-glow); text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 0.5rem; color: var(--color-cyan-light);">
            <i class="fa-solid fa-award"></i>
          </div>
          <h3 style="font-size: 1.45rem; margin-bottom: 0.5rem;">${gradeTitle}</h3>
          <p style="margin-bottom: 1.5rem; font-size: 1rem; color: var(--text-secondary);">${gradeDescription}</p>
          <button id="quiz-restart-btn" class="btn btn-primary" style="margin: 0 auto;">
            <i class="fa-solid fa-rotate-right"></i> Retake Ethics Assessment
          </button>
        </div>
      `;

      if (quizExplanation) quizExplanation.classList.remove('show');
      if (quizNextBtn) quizNextBtn.style.display = 'none';

      const restartBtn = document.getElementById('quiz-restart-btn');
      if (restartBtn) {
        restartBtn.addEventListener('click', () => {
          currentQuestionIndex = 0;
          score = 0;
          loadQuestion(0);
        });
      }
    }

    if (quizNextBtn) {
      quizNextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
          currentQuestionIndex++;
          loadQuestion(currentQuestionIndex);
        } else {
          showResults();
        }
      });
    }

    loadQuestion(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuiz);
  } else {
    initQuiz();
  }
})();
