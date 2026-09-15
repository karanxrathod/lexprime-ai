# LexPrime AI – AI for Legal Assistance & Access

<div align="center">

**An AI-powered multilingual legal document intelligence platform that helps people understand complex legal documents in clear, actionable language.**

[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.4.0-orange.svg)](https://firebase.google.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.0%20Flash-green.svg)](https://ai.google.dev/)

[Features](#-features) • [Challenge Alignment](#-challenge-alignment-ai-for-legal-assistance--access) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Security](#-security--privacy) • [Documentation](#-documentation)

</div>

---

## 📖 Overview

**LexPrime AI** is a modern AI-powered legal document intelligence platform designed to make legal information easier to understand and more accessible.

Legal documents are often difficult for ordinary users because they contain complex terminology, long clauses, hidden obligations, and unclear risks. LexPrime AI helps bridge that gap by allowing users to upload a legal document or paste its text and receive:

- Plain-language explanations
- Clause-by-clause analysis
- Risk detection and severity levels
- Action points and negotiation suggestions
- Role-specific perspectives
- Legal citations when confidently inferable
- Context-aware AI chat
- Multilingual assistance
- Authenticity and safety analysis
- Visual timelines, process flows, and responsibility matrices

The goal is not to replace lawyers. The goal is to help users understand legal documents better, identify possible concerns earlier, and know what questions they should ask before making an important decision.

---

## 🎯 Challenge Alignment: AI for Legal Assistance & Access

LexPrime AI is built specifically around the challenge:

> **AI for Legal Assistance & Access**

Many people sign rental agreements, employment contracts, service agreements, NDAs, consumer contracts, and other legal documents without fully understanding the language used in them. Professional legal help may also be difficult to access because of cost, location, time, or lack of awareness.

LexPrime AI addresses this accessibility gap through AI-assisted legal understanding.

### The Problem

Legal information is often:

- Written in difficult legal language
- Time-consuming to read and interpret
- Hard to understand for non-lawyers
- Difficult to access in local languages
- Expensive to review professionally for basic understanding
- Full of clauses whose risks and obligations may not be obvious

This creates an information gap between legal documents and the people expected to understand and act on them.

### Our Solution

LexPrime AI uses Generative AI to convert complex legal documents into structured, understandable insights.

A user can upload a PDF or paste legal text and receive:

1. **Plain-Language Summary**  
   Converts dense legal language into a concise explanation.

2. **Clause Lens**  
   Breaks the document into individual clauses and explains their meaning.

3. **Risk Radar**  
   Identifies potentially concerning clauses and categorizes them as low, medium, or high risk.

4. **Action Points**  
   Gives users practical next steps, clarification points, and items that may require further review.

5. **Negotiation Support**  
   Generates negotiation points for higher-risk clauses to help users understand what they may want to discuss or clarify.

6. **Role-Based Perspectives**  
   Shows how a clause may affect different parties such as Tenant vs Landlord, Employee vs Employer, or Consumer vs Business.

7. **Document-Grounded AI Chat**  
   Lets users ask questions about the uploaded document and receive answers based on that document's content.

8. **Multilingual Assistance**  
   Supports legal understanding across English, Hindi, and Marathi workflows.

9. **Authenticity & Safety Analysis**  
   Highlights suspicious elements, missing information, compliance concerns, and possible red flags.

10. **Legal Visualizations**  
    Converts complex legal processes into flowcharts, timelines, and responsibility matrices.

11. **Lawyer Discovery**  
    Helps users move from AI-assisted understanding toward professional legal help when needed.

### How LexPrime Improves Legal Access

LexPrime AI improves access to legal understanding by making the first layer of legal information:

- Easier to read
- Faster to analyze
- More visual
- More multilingual
- More interactive
- More accessible to non-lawyers

The platform is designed as an **AI-assisted legal understanding tool**, not a replacement for qualified legal professionals.

---

## ✨ Features

### 🔍 Document Analysis

#### Intelligent Chunking & Processing

- Splits large legal documents into manageable chunks
- Uses approximately 4000-character chunks with overlap
- Analyzes chunks independently
- Merges results with de-duplication
- Improves reliability when processing long documents

#### Clause-by-Clause Breakdown

Each identified clause can include:

- **Title**
- **Original Text**
- **Simplified Explanation**
- **Risk Level**
- **Detailed Analysis**
- **Role-specific interpretation**

Risk indicators:

- 🟢 Low
- 🟡 Medium
- 🔴 High

---

### 👥 Role-Specific Perspectives

For applicable agreements, LexPrime AI can analyze clauses from different viewpoints.

Examples:

- Tenant vs Landlord
- Employee vs Employer
- Consumer vs Business

Each perspective can include:

- Interpretation from that party's viewpoint
- Obligations
- Possible concerns
- Risks associated with the clause

---

### 🚨 Risk Radar

LexPrime AI creates a consolidated view of identified risks.

It can include:

- Risk description
- Severity
- Related clause
- Potential impact
- Recommended next step

This helps users quickly identify the sections of a document that may deserve closer attention.

---

### ✅ Action Points

The system extracts practical next steps such as:

- Clauses requiring clarification
- Documents that may need to be prepared
- Follow-up actions
- Questions to ask
- Negotiation opportunities

---

### 🤝 Negotiation Support

For high-risk clauses, LexPrime AI can generate structured negotiation guidance such as:

- Why the clause may be problematic
- Possible counter-proposal
- Suggested talking point

This feature is intended to help users better prepare for a discussion, not provide professional legal representation.

---

### 📚 Legal Citations

When confidently inferable, the system can surface:

- Relevant statutes
- Laws
- Legal principles
- Supporting reference links

LexPrime AI is designed to avoid inventing citations when reliable references are not available.

---

### 🛡️ Authenticity & Safety Analysis

LexPrime AI can analyze a document for potential safety and authenticity concerns.

The analysis may include:

- **Authenticity Score**
- **Compliance Status**
- **Possible Red Flags**
- **Safety Score**
- **Fake/Scam Indication**
- **Recommended Next Action**

Examples of possible red flags:

- Missing signatures
- Vague language
- Unbalanced obligations
- Missing essential clauses
- Suspicious formatting or terms

---

## 📊 Legal Visualizations

Legal documents can be difficult to understand when everything is presented as paragraphs.

LexPrime AI converts important information into visual structures.

### Process Flow Diagrams

Examples:

- Contract termination flow
- Renewal process
- Notice procedure
- Dispute resolution process

### POV-Based Timelines

Possible perspectives include:

- Court perspective
- Receiver perspective
- Overall chronological timeline

### Responsibility Matrix

Compares the responsibilities of each party side-by-side.

Example:

| Topic | Party A | Party B |
|---|---|---|
| Payment | Payment obligation | Receipt/acknowledgement |
| Notice | Notice requirement | Response obligation |
| Termination | Exit conditions | Termination rights |

---

## 💬 AI Chat System

LexPrime AI includes document-grounded conversational assistance.

### Chat Modes

1. **Floating Chat**
   - Available throughout the application
   - Can be minimized or expanded

2. **Full Chat Panel**
   - Dedicated conversational interface
   - Better for longer document discussions

### Chat Capabilities

- Uses the uploaded legal document as primary context
- Maintains conversation history
- Supports follow-up questions
- Can handle hypothetical scenarios
- Provides structured answers for risks and possible alternatives
- Supports multilingual responses
- Uses Markdown formatting for readability

When the document does not contain enough information, the assistant is designed to communicate uncertainty rather than fabricate missing contract terms.

---

## ⚖️ Clause Enforceability Analysis

Users can analyze an individual clause against a selected jurisdiction.

The AI can provide:

- Simplified meaning
- High-level enforceability status
- Jurisdiction notes
- References when available
- Possible alternatives

Possible statuses:

- Enforceable
- Restricted
- Not enforceable
- Uncertain

This feature provides informational analysis only and does not replace professional legal advice.

---

## 👨‍⚖️ AI Lawyer Assistance

LexPrime AI includes role-oriented AI legal assistance experiences.

The system is designed to:

- Provide clear legal information
- Explain legal concepts
- Help users understand possible options
- Maintain a professional and empathetic tone
- Remind users that AI output is informational

---

## ⚖️ Lawyer Locator

When AI assistance is not enough, users can move toward professional support.

### Search & Filter

Users can search using:

- Location
- Distance radius
- Legal specialization
- Rating
- Online consultation availability

### Lawyer Profile Information

Profiles may include:

- Name
- Bar registration
- Experience
- Specializations
- Ratings
- Contact details
- Address
- Consultation fees
- Languages

### Views

- List view
- Map view
- Detailed profile modal

---

## 📄 PDF Operations

### Upload & Text Extraction

LexPrime AI supports:

- Drag-and-drop PDF upload
- Digital PDF text extraction using PDF.js
- OCR fallback using Tesseract.js
- Multi-page documents
- Direct text input

### PDF Export

Analysis results can be exported into a professional PDF containing:

- Summary
- Clause analysis
- Risks
- Action points
- Visualizations
- Metadata

---

## 🌐 Multilingual Support

LexPrime AI supports multilingual legal understanding.

Current workflows include:

- **English**
- **Hindi**
- **Marathi**

The system can detect Devanagari text and use AI-assisted translation where required before analysis.

Users can receive explanations and AI responses in their selected language.

---

## 👤 User Management

### Authentication

- Email/password authentication
- Google OAuth
- Password recovery
- Profile management

### User Profiles

Profiles can contain:

- Display name
- Profile image
- Email
- Account creation information
- Language preferences
- Theme preferences

---

## 📚 Analysis History

### Storage

- Local-first history support
- Firebase-backed history for authenticated users
- Cross-device synchronization where configured

### Features

- Save previous analyses
- Open an old analysis
- Delete analysis history
- Sync user-specific history
- Optimistic UI updates

---

## 🎨 User Experience & Accessibility

### Theme System

- Light mode
- Dark mode
- System preference support
- Smooth theme transitions

### Responsive Design

The interface is designed for:

- Desktop
- Tablet
- Mobile

### Accessibility

The project includes accessibility-focused UI patterns such as:

- `aria-label` attributes for interactive controls
- Keyboard-friendly controls
- Semantic navigation patterns
- Accessible contrast targets
- Clear loading and feedback states

---

## 🧠 GenAI Usage

Google Gemini is the primary Generative AI service used by LexPrime AI.

### Gemini is used for:

- Legal document analysis
- Clause extraction
- Plain-language simplification
- Risk identification
- Action point generation
- Negotiation suggestions
- Multilingual translation
- Document summaries
- Context-aware legal document chat
- Clause enforceability analysis
- Authenticity analysis
- Safety analysis
- Process-flow generation
- Timeline generation
- Responsibility matrices
- AI lawyer conversations
- Legal illustration/SVG generation
- Mermaid mind-map generation

The current application implementation uses:

**Gemini 2.0 Flash**

through:

`@google/generative-ai`

---

## 🛠 Tech Stack

### Frontend

- **React 19**
- **TypeScript 5.5**
- **Vite 6**
- **Tailwind CSS**
- **Framer Motion**

### AI & APIs

- **Google Gemini AI**
- **@google/generative-ai**
- **@google/genai**
- **Google Cloud Vertex AI SDK**
- **Firebase**

### Document Processing

- **PDF.js**
- **Tesseract.js**
- **jsPDF**
- **html2canvas**

### Visualization

- **Mermaid**
- **react-chrono**
- **react-markdown**
- **Lucide React**

### Development Tools

- ESLint
- PostCSS
- Autoprefixer
- TypeScript ESLint

---

## 🏗 Architecture

```text
User
  │
  ▼
React + TypeScript Interface
  │
  ├── PDF/Text Input
  │
  ├── Authentication
  │
  ├── Analysis Dashboard
  │
  ├── AI Chat
  │
  ├── Visualizations
  │
  └── Lawyer Locator
  │
  ▼
Document Processing Layer
  │
  ├── PDF.js
  ├── OCR / Tesseract.js
  └── Chunking + De-duplication
  │
  ▼
Gemini AI Analysis
  │
  ├── Summary
  ├── Clauses
  ├── Risks
  ├── Actions
  ├── Negotiation
  ├── Enforceability
  ├── Authenticity
  └── Visual Structures
  │
  ▼
Firebase
  ├── Authentication
  ├── Firestore
  └── Hosting
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- Google Gemini API key
- Firebase project for authentication/history features

### Installation

1. Clone the repository:

```bash
git clone https://github.com/karanxrathod/lexprime-ai.git
cd lexprime-ai
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

Create a `.env` file in the project root.

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> **Security note:** Never commit real credentials or API keys to GitHub. For production systems, sensitive AI credentials should ideally be handled by a secure backend rather than exposed directly to the browser.

4. Start development:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

6. Preview production build:

```bash
npm run preview
```

---

## 🔥 Firebase Setup

For authentication and cloud history:

1. Create a Firebase project
2. Enable Authentication
3. Enable Email/Password authentication
4. Enable Google authentication if required
5. Enable Firestore Database
6. Add Firebase configuration to `.env`
7. Deploy the Firestore security rules

```bash
firebase deploy --only firestore:rules
```

---

## 🎯 Usage

### 1. Analyze a Document

- Open the Upload section
- Paste legal text or upload a PDF
- Select your preferred language
- Choose a simplification level
- Start analysis

### 2. Review AI Results

Explore:

- Plain Summary
- Clause Lens
- Risk Radar
- Action Points
- Negotiation Points
- Legal Citations
- Authenticity Analysis

### 3. Explore Visualizations

View:

- Process flows
- Timelines
- Responsibility matrices
- Mind maps

### 4. Ask Questions

Use the AI chat to ask questions about the document.

Examples:

- What happens if I terminate this agreement early?
- Which clause creates the highest financial risk?
- What are my responsibilities?
- Is there a notice period?
- What should I clarify before signing?

### 5. Find Professional Help

Use the Lawyer Locator when professional legal review is needed.

---

## 🔒 Security & Privacy

LexPrime AI is designed with privacy and user ownership in mind.

Current measures include:

- API keys are not intended to be committed to source control
- Firebase Authentication protects user-specific functionality
- Analysis history uses authenticated user ownership rules
- Local-first storage is supported for analysis history
- Production traffic uses HTTPS through Firebase Hosting
- Document-grounded AI is instructed not to fabricate missing contract terms

### Important Production Security Note

The current frontend supports API-key configuration for development and prototype usage.

For a production-grade legal application, Gemini requests should be routed through a protected backend such as:

- Firebase Functions
- Google Cloud Run
- Another authenticated server-side API

This helps prevent exposing long-lived AI credentials in client-side code.

---

## ♿ Accessibility

LexPrime AI aims to make legal understanding accessible not only through AI but also through interface design.

Accessibility considerations include:

- Accessible labels for interactive controls
- Keyboard-operable buttons and navigation
- Clear loading states
- Responsive layouts
- Light and dark themes
- Readable information hierarchy
- Visual risk indicators with textual descriptions

Future improvements include continued WCAG auditing and screen-reader testing.

---

## 📚 Documentation

Detailed technical documentation is available in the `/documentation` directory.

- **[README.md](./documentation/README.md)** – Documentation index
- **[USER_GUIDE.md](./documentation/USER_GUIDE.md)** – User guide
- **[ARCHITECTURE.md](./documentation/ARCHITECTURE.md)** – Architecture
- **[COMPONENTS.md](./documentation/COMPONENTS.md)** – Components
- **[FEATURES.md](./documentation/FEATURES.md)** – Features
- **[THEME_AND_STYLING.md](./documentation/THEME_AND_STYLING.md)** – Design system
- **[API_SERVICES_DOCUMENTATION.md](./documentation/API_SERVICES_DOCUMENTATION.md)** – API integrations
- **[WORKFLOW_DOCUMENTATION.md](./documentation/WORKFLOW_DOCUMENTATION.md)** – Workflows
- **[DEPLOYMENT_GUIDE.md](./documentation/DEPLOYMENT_GUIDE.md)** – Deployment

---

## 📸 Screenshots

### Document Upload

![Document Input](./documentation/screenshots/upload.png)

### Analysis Results

![Analysis Results](./documentation/screenshots/analysis.png)

### Visualizations

![Visualizations](./documentation/screenshots/visualizations.png)

### AI Chat

![Chat Interface](./documentation/screenshots/chat.png)

### Lawyer Locator

![Lawyer Locator](./documentation/screenshots/lawyer-locator.png)

---

## 🏗 Project Structure

```text
lexprime-ai/
├── src/
│   ├── components/
│   ├── analysis/
│   ├── chatbot/
│   ├── mapsComponents/
│   ├── pages/
│   ├── services/
│   │   ├── gemini.ts
│   │   ├── firebase.ts
│   │   ├── pdfService.ts
│   │   ├── analysis.ts
│   │   └── userService.ts
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── documentation/
├── public/
├── firebase.json
├── firestore.rules
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## 🧪 Recommended Testing Scope

The project should be tested across:

- PDF upload and parsing
- OCR fallback
- Large-document chunking
- Gemini JSON parsing
- Invalid AI response handling
- Authentication flows
- Firestore authorization
- Document history
- AI chat
- Multilingual output
- Responsive layout
- Keyboard accessibility

Automated unit and integration tests are planned as part of continued project hardening.

---

## ⚠️ Responsible AI & Legal Disclaimer

LexPrime AI provides **AI-assisted legal information and document understanding**.

It does **not** provide professional legal advice and does not replace a qualified lawyer.

AI-generated analysis may be incomplete, incorrect, or dependent on the quality of the uploaded document.

For important legal, financial, employment, property, or contractual decisions:

> **Always consult a qualified legal professional.**

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/AmazingFeature
```

3. Follow the existing project architecture
4. Update documentation where necessary
5. Test your changes
6. Commit your work

```bash
git commit -m "Add AmazingFeature"
```

7. Push the branch

```bash
git push origin feature/AmazingFeature
```

8. Open a Pull Request

---

## 🙏 Acknowledgments

LexPrime AI uses and builds upon excellent open-source and cloud technologies including:

- Google Gemini
- Firebase
- React
- TypeScript
- Tailwind CSS
- Mermaid
- PDF.js
- Tesseract.js
- jsPDF

Thank you to the developer and open-source communities behind these technologies.

---

## 📧 Contact & Support

- **GitHub:** https://github.com/karanxrathod/lexprime-ai
- **Issues:** Use GitHub Issues for bugs and suggestions
- **Documentation:** See the `/documentation` folder

---

<div align="center">

### LexPrime AI

**Making legal documents easier to understand with AI.**

**Built by Karan Rathod**

[⬆ Back to Top](#lexprime-ai--ai-for-legal-assistance--access)

</div>
