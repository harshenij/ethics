# ETHICAL MED-AI: Engineering Ethics in Preventing Dataset Bias in Global Medical AI Development

> **"Building Fair, Transparent, Inclusive and Responsible Artificial Intelligence for Global Healthcare."**

A modern, responsive, educational web platform developed for college engineering demonstrations, clinical researchers, and AI engineers. This project explores the foundational principles of engineering ethics required to prevent, diagnose, and remediate dataset bias in clinical artificial intelligence.

---

## 🌟 Core Highlights & Features

1. **Healthcare + AI Theme:** Dark Navy Blue, Cyan, and Purple color scheme with glassmorphism cards and responsive layouts.
2. **Interactive AI Fairness Simulator:** Live emulation comparing majority and historically underrepresented patient cohorts across diversity levels and debiasing algorithms (Reweighting, Adversarial Debiasing, Equalized Odds).
3. **Animated Charts & Visualizations:** Dynamic charts illustrating the global geographic concentration of AI training data and accuracy parity improvements.
4. **Interactive 6-Step Workflow:** Visual step tracker covering the entire ethical engineering lifecycle:
   $$\text{Data Collection} \longrightarrow \text{Diversity Check} \longrightarrow \text{Model Training} \longrightarrow \text{Bias Testing} \longrightarrow \text{Ethical Validation} \longrightarrow \text{Fair Medical AI}$$
5. **Real-World Case Studies:** In-depth breakdowns of dermatology skin-tone disparities (*Buolamwini & Gebru*), risk-scoring spending proxy bias (*Obermeyer et al., Science 2019*), and radiology underdiagnosis (*Seyyed-Kalantari et al., Nature Medicine 2021*).
6. **Dataset Bias Awareness Quiz:** Scenario-based multiple-choice assessment with instant feedback, scoring, and explanations.
7. **Dark / Light Mode Toggle:** Smooth theme transitions with local persistence.
8. **Zero Dependencies Required:** Built with vanilla HTML5, CSS3, and ES6+ JavaScript.

---

## 📁 Repository Structure

```
ethics/
├── index.html              # Main single-page application covering all 12 educational modules
├── open_website.bat        # 1-click Windows launcher (opens default browser)
├── start_server.bat        # 1-click native Windows HTTP web server (no Python/Node needed)
├── start_server.ps1        # PowerShell HTTP server engine
├── README.md               # Project documentation
├── css/
│   └── style.css           # Custom design system, CSS variables, animations, glassmorphism
└── js/
    ├── main.js             # Theme engine, scroll tracking, animated statistics, canvas particles
    ├── fairness-simulator.js # Interactive demographic parity simulation engine
    ├── quiz.js             # Interactive 5-question dataset bias assessment
    └── charts.js           # Theme-aware Chart.js visualizations with offline SVG fallbacks
```

---

## 🚀 How to Run Locally

### Option 1: Direct Double-Click
Double-click `open_website.bat` or simply double-click `index.html`. It opens directly in any web browser.

### Option 2: Run via Local Web Server
Double-click `start_server.bat` or run:
```powershell
powershell -ExecutionPolicy Bypass -File .\start_server.ps1
```
This runs a local web server at `http://localhost:8080/` without needing Python or Node.js.

---

## 📚 Key Topics Covered

- **5 Pillars of Healthcare AI:** Disease diagnosis, medical imaging, patient monitoring, treatment recommendations, and predictive health.
- **Dataset Bias Mechanisms:** Sampling skew, historical proxy bias, and underrepresentation across gender, age, and geography.
- **6 Pillars of Engineering Ethics:** Fairness, Transparency, Privacy, Accountability, Inclusiveness, and Safety.
- **Global Healthcare Challenges:** The technical and structural divide between High-Income and Resource-Constrained clinical environments.
- **Governance Standards:** Adherence to the World Health Organization (WHO) Ethics and Governance of AI for Health, IEEE P7000 series, and the EU AI Act.

---

## ⚖️ License & Open Educational Resource
Developed for academic, educational, and clinical AI research demonstrations. Open Educational Resource (OER).
