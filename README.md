# BRSR Compass

**Benchmark • Assess • Bridge the Gap**

A comprehensive sustainability reporting tool for Indian listed companies that combines peer benchmarking, BRSR maturity assessment (SRMM v2.0), and gap analysis — with optional AI-powered document parsing.

![BRSR Compass](https://img.shields.io/badge/BRSR-Compass-0d5a3e?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjIwIiBmaWxsPSIjMGQ1YTNlIi8+PHRleHQgeD0iNTAiIHk9IjY4IiBmb250LXNpemU9IjYwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJzZXJpZiI+QjwvdGV4dD48L3N2Zz4=)
![License](https://img.shields.io/badge/License-MIT-green)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-6-purple)

---

## Features

### 🔍 Benchmark — Peer Intelligence
- **Industry Classification Mapping**: NIC (India) → GICS / NAICS / NACE with hierarchical sub-division level mapping (80+ divisions)
- **Indian BRSR Peer Database**: 60+ exemplary Indian companies with direct links to sustainability reports, organized by NIC section and division
- **Global ESG Peer Database**: 150+ international best-in-class companies across GICS (global), NAICS (North America), and NACE (Europe) — with division-level specificity
- **Automatic fallback**: Section-level peers shown with clear warning when division-specific data isn't available

### 📊 Assess — SRMM v2.0 Maturity Scoring
- **100+ parameters** from ICAI's Sustainability Reporting Maturity Model Version 2.0
- Covers all **3 Sections** (A: General Disclosures, B: Management & Process, C: Principle-wise Performance) and **9 NGRBC Principles**
- **300-point scoring** (225 Essential + 75 Leadership indicators)
- **AI-powered auto-fill** (optional): Upload existing BRSR report (PDF/DOCX/XLSX) and AI pre-selects matching scores
- **4-level maturity model**: Formative → Emerging → Established → Leading

### 🌉 Bridge the Gap — Actionable Insights
- **Maturity Dashboard**: Score summary, Essential vs Leadership breakdown, section-wise progress bars
- **Gap Analysis**: Top gaps ranked by impact with recommendations tailored to your maturity level
- **PDF Export**: Professional multi-page report with cover, section breakdown, detailed scores, and gap analysis
- **SRMM maturity scale** with clear level descriptions

### 🔐 Authentication & Settings
- User signup/login with email and password
- **Connect API** (optional power-user setting) for AI document analysis
- All core features work without any API key
- Feature access table clearly shows what's free vs what needs API

---

## Tech Stack

- **Frontend**: React 18 + Vite
- **PDF Export**: jsPDF (loaded from CDN)
- **AI Analysis**: Anthropic Claude API (optional, user provides own key)
- **Styling**: Inline CSS with DM Sans + Playfair Display fonts
- **No backend required** for core features

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/prathameshparasharai/BRSR-Compass.git
cd BRSR-Compass

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deploy

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload the `dist/` folder to Netlify
```

### GitHub Pages
```bash
npm run build
# Deploy the `dist/` folder
```

---

## Project Structure

```
BRSR-Compass/
├── index.html              # Entry HTML
├── package.json            # Dependencies & scripts
├── vite.config.js          # Vite configuration
├── .gitignore
├── README.md
└── src/
    ├── main.jsx            # React entry point
    └── App.jsx             # Main application (all components)
```

---

## Data Sources & Frameworks

| Component | Source |
|-----------|--------|
| BRSR Scoring | SEBI Circular dated 10th May 2021 |
| SRMM v2.0 | ICAI Sustainability Reporting Standards Board |
| NIC Classification | MoSPI NIC 2025 (aligned with ISIC Rev.5) |
| GICS Classification | S&P Dow Jones Indices & MSCI |
| NAICS Classification | US Census Bureau |
| NACE Classification | Eurostat |

---

## How the AI Feature Works

The optional "Connect API" feature uses the Anthropic Claude API to:
1. Read your uploaded BRSR document (PDF, DOCX, or XLSX)
2. Match disclosures against all 100+ SRMM v2.0 parameters
3. Pre-select appropriate scores with validation
4. Extract the company name automatically

**Important**: The API key is stored only in the browser session and is sent only to Anthropic's API endpoint. It is never transmitted to any other server.

To use this feature:
1. Get an API key from [console.anthropic.com](https://console.anthropic.com/settings/keys)
2. Go to Settings → Connect API
3. Paste your key and save

Without the API key, all other features (benchmarking, manual scoring, dashboard, PDF export) work fully.

---

## Contributing

Contributions are welcome! Areas for improvement:
- Additional NIC division-level peer data
- More industry-specific BRSR examples
- BRSR Core indicators overlay (49 KPI subset)
- Year-over-year maturity tracking
- Backend authentication with database persistence

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Acknowledgements

- **ICAI** Sustainability Reporting Standards Board for the SRMM v2.0 framework
- **SEBI** for the BRSR reporting format and circular
- **MoSPI** for the NIC 2025 classification system
- **S&P/MSCI** for the GICS classification standard

---

*Built with purpose for India's sustainability reporting ecosystem.*
