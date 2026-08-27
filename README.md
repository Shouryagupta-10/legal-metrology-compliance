# MetrologyGuard AI ⚖️
### Legal Metrology (Packaged Commodities) Rules, 2011 Compliance & Vision Studio

A software suite for regulatory authorities, FMCG brand compliance teams, packaging QA engineers, and e-commerce platforms to automatically audit and verify commercial packaging compliance under the **Legal Metrology (Packaged Commodities) Rules, 2011** and the **Legal Metrology Act, 2009** (including 2021/2022 Unit Sale Price amendments).

---

## 🌟 Key Features

- **Photorealistic Packaging Proofing Canvas**:
  - Precision bounding box annotations synchronized bidirectionally with statutory checklist.
  - **2.5x Optical Loupe (Magnifier)**: Real-time magnifying lens with crosshairs and sub-millimeter pixel grid.
  - **Draggable & Rotatable Rule 7 Millimeter Gauge**: Measure printed numeral font heights directly on packaging artwork against Table 1 statutory standards ($1.5\text{ mm}$, $2.0\text{ mm}$, $4.0\text{ mm}$, $6.0\text{ mm}$).
  - **1-Click Auto-Fix Artwork Simulator**: Dynamically preview compliant artwork patches (`75 gms` $\to$ `75 g`, `(inclusive of all taxes)`, legal USP rates) and observe the compliance score reach 100%.

- **Complete Statutory Rule Coverage**:
  - **Rule 6(1)(a)**: Manufacturer / Packer / Importer with State and mandatory 6-digit PIN code.
  - **Rule 6(1)(b)**: Generic or common commodity name verification.
  - **Rule 6(1)(c) & Rules 11–13**: Net quantity & strict SI metric symbol enforcement (rejects illegal `gms`, `gm`, `kgs`, `ml.`, `mtrs`).
  - **Rule 6(1)(d)**: Month and Year of manufacture, pre-packing, or import.
  - **Rule 6(1)(e)**: Maximum Retail Price (MRP) with mandatory `"inclusive of all taxes"`.
  - **2021 Second Amendment**: Mandatory Unit Sale Price (USP) rate verification for packages $> 1\text{ kg} / 1\text{ L}$.
  - **Rule 6(1)(f)**: Size and metric dimensions declaration.
  - **Rule 6(1)(n)**: 4-tier Consumer Care Cell verification (Designation, Address, Phone/Toll-Free, Email).
  - **Rule 6(10)**: E-Commerce digital listing compliance scanner.
  - **Rule 7 & Table 1**: Principal Display Panel (PDP) surface area calculator ($40\%$ rectangular/pouch, $20\%$ cylindrical).
  - **Section 36 & 48**: Compounding fee and statutory penalty liability calculator.

- **"Ask Legal Metrology Officer" AI Assistant**:
  - Slide-out assistant drawer with grounded answers on LMPC 2011 clauses, compounding procedures, and packaging standards.

- **Official PDF Audit Export**:
  - Generate publication-grade inspection notices with reference IDs and Section 36 liability breakdowns.

- **Bulk Batch Audit**:
  - Audit multi-SKU catalogues simultaneously with CSV export.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/Shouryagupta-10/legal-metrology-compliance.git
cd legal-metrology-compliance

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Run automated statutory test suite
npx tsx tests/compliance.test.ts

# 5. Build for production
npm run build
```

---

## 🧪 Test Verification

Run the automated test suite covering all statutory clauses and edge cases:

```bash
npx tsx tests/compliance.test.ts
```

```
=== LEGAL METROLOGY COMPLIANCE SUITE TESTS ===
✅ PASS: Sample 1 must be COMPLIANT (Heritage Basmati Rice 5kg)
✅ PASS: Sample 2 must be NON_COMPLIANT (Prohibited 'gms' unit)
✅ PASS: Sample 3 must be NON_COMPLIANT (Missing 'inclusive of all taxes')
✅ PASS: Sample 4 must be NON_COMPLIANT (Missing mandatory USP on 2L pack)
✅ PASS: Rule 7 PDP & Table 1 Font Height Calculation
✅ PASS: OCR Extraction Heuristics

🎉 ALL 6 TEST SCENARIOS PASSED WITH ZERO REGRESSIONS!
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Vision & OCR**: Tesseract.js (Client-side WASM OCR), HTML5 Canvas
- **Reports**: jsPDF, html2canvas
- **Audio Feedback**: Web Audio API Synthesizer
- **Testing**: tsx, Node Test Suite

---

## 📜 License

MIT License. Designed for regulatory authorities, FMCG packaging QA, and commercial compliance auditing under the Legal Metrology (Packaged Commodities) Rules, 2011.