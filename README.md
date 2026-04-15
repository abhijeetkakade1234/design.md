# design.md

> The digital monograph for modern design engineering.

**design.md** is an autonomous UI architect designed to bridge the gap between high-fidelity layouts and structured code semantics. It acts as an intelligent extraction engine that analyzes UI screenshots and reverse-engineers their creative intent—automatically delivering design tokens, layout strategies, and structural data inside a pristine Markdown document.

## 🌟 Philosophy

Built around the "Editorial Artisan" aesthetic, design.md rejects standard SaaS rigidness for a richer, more curatorial environment. The interface itself reflects its purpose: capturing the meticulous nuances of "Glass & Gradients", "Tonal Depth", and "Brutalist Shadows" to perfectly reconstruct the visual soul of any web interface.

## ✨ Features

- **Multi-Modal Pixel Extraction**: Ingests up to 5 screenshots at once and perfectly dictates the visual layout.
- **Fail-Resilient AI Generation**: Integrates a highly fault-tolerant array of Google Gemini vision models (`gemini-2.5-flash`, `gemini-1.5-pro`, etc.) to automatically load-balance rate limits seamlessly. 
- **The "Digital Curator" Showcase**: An architectural library where all generated `design.md` files are archived and publicly browsable as a living, staggered masonry timeline.
- **Role-Based Workspaces**: Authenticated builders (via Google or Email/Password) maintain strict ownership over their archived design strategies.

## 🛠 Tech Stack

- **Framework**: React 18 / Vite / TypeScript
- **Styling**: Tailwind CSS (with highly customized utility classes for specific non-standard editorial shapes)
- **Animation**: Framer Motion
- **Database / Auth**: Firebase (Firestore Database, Firebase Auth)
- **AI Core**: Google Generative AI SDK (`@google/generative-ai`)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/abhijeetkakade1234/design.md.git
cd design.md
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file at the root of the project with your specific Firebase configurations and Gemini keys. Reference `.env.example` for the correct layout:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# AI Configuration (Automated Load Balancing built-in)
VITE_GEMINI_API_KEY=your_primary_gemini_key
VITE_GEMINI_API_KEY_1=your_secondary_gemini_key (optional)
VITE_GEMINI_API_KEY_2=your_tertiary_gemini_key (optional)
```

### 4. Firestore Security Rules
Ensure your live Firestore database is set up with the following restricted rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /designs/{designId} {
      allow read: if true; 
      allow create: if request.auth != null; 
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId; 
    }
    match /usage/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Start the architect
```bash
npm run dev
```

---

*Built by [Abhijeet](https://experimentwith.abhijeetkakade.in/)*