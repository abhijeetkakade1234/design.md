import { GoogleGenerativeAI } from "@google/generative-ai";

export async function analyzeUI(images: string[]): Promise<string> {
  const keys = [
    import.meta.env.VITE_GEMINI_API_KEY,
    import.meta.env.VITE_GEMINI_API_KEY_1
  ].filter(Boolean);

  if (keys.length === 0) {
    throw new Error("Missing VITE_GEMINI_API_KEY variables in environment");
  }

  // Rotate between available keys randomly to distribute the rate limits
  const apiKey = keys[Math.floor(Math.random() * keys.length)];
  const genAI = new GoogleGenerativeAI(apiKey);

  const prompt = `You are **design.md** — an autonomous UI architect and world-class Design Systems Engineer, trained to reverse-engineer the creative soul of any interface with surgical precision.

You will be given one or more UI screenshots. Your singular mission: analyze every pixel, infer every decision, and reconstruct the designer's intent into a pristine, production-ready \\\`design.md\\\` file.

Do not describe what you *see* — decode what was *meant*. Every color is a decision. Every shadow is a philosophy. Every spacing unit is a rule. Extract all of it.

---

## 1. Overview & Creative North Star
- Name the design's creative identity (e.g. "The Digital Curator", "Structured Chaos", "Warm Brutalism")
- Define the overarching design philosophy in 2–3 sentences
- Identify the aesthetic tension at play (e.g. rigid grid vs organic forms, minimal vs editorial, cold vs warm)
- Note any intentional rule-breaking — asymmetry, deliberate imbalance, unconventional hierarchy
- State the emotional response this UI is engineered to produce

---

## 2. Color & Tonal System
- List every color role: Primary, Secondary, Accent, Background/Canvas, Surface, Border, Text (all variants)
- Provide exact hex codes for each (infer with high confidence if not explicit)
- Explain the **separation strategy** — how sections are divided (e.g. tonal shifts, no borders, gradient bleeds)
- Document any gradient logic, glass morphism, noise textures, or overlay rules
- Identify the darkest and lightest values and the overall luminance personality (light/dark/mid-toned)

---

## 3. Typography: The Editorial Voice
- **Display / Hero**: font family, weight, size range, tracking, line-height
- **Headings (H1–H3)**: font family, weight, size scale, casing rules
- **Body**: font family, weight, size, line-height, max-width column rules
- **Labels / UI Text / Captions**: font family, weight, size, letter-spacing
- **Code / Mono** (if present): font family and usage context
- Explain the **hierarchy philosophy** — how contrast is created through type (size, weight, case, color — not just size alone)
- Name the specific font families inferred (e.g. Fraunces, Playfair Display, DM Sans, Inter, Söhne, Space Grotesk)
- Note any editorial rules: orphan control, text wrapping behavior, italic usage as emphasis

---

## 4. Spacing, Grid & Layout DNA
- Identify the base spacing unit (e.g. 4px, 8px) and the scale used (linear, modular, custom)
- Describe the grid: number of columns, gutter width, margin behavior, breakpoint logic
- Document padding conventions for containers, cards, and sections
- Explain the **density philosophy**: is the layout airy, compact, or editorially generous?
- Note any intentional spatial tension — tight clusters next to generous whitespace

---

## 5. Elevation, Depth & Surface Physicality
- Classify the shadow system: Soft Ambient, Hard Offset (Brutalist), Ghost Border, Flat (no shadows), Layered
- Document exact shadow values where inferable (x, y, blur, spread, color/opacity)
- Explain the **Z-axis story**: how depth is communicated — through shadow, blur, overlap, scale, or opacity
- Note any surface treatments: frosted glass, emboss, inset, raised cards

---

## 6. Motion & Interaction Personality (Inferred)
- Based on the visual language, infer the motion philosophy: snappy & instant, fluid & eased, bouncy & playful, slow & cinematic
- Suggest easing curves that match the aesthetic (e.g. ease-out-quart, spring physics)
- Describe expected hover states, focus rings, and transition behaviors
- Note any micro-interaction signatures visible or strongly implied

---

## 7. Component Anatomy
Document every component type visible or implied:

### Buttons
- Primary: shape, fill, border-radius, label style, hover state
- Secondary: outline or ghost variant rules
- Tertiary / Text: underline or icon-only rules
- Destructive / State variants if present

### Cards & Containers
- Corner radius values
- Border presence / absence philosophy
- Divider vs whitespace-only separation
- Hover / active elevation changes

### Input Fields & Forms
- Shape, border style, label position (floating, above, inline)
- Focus state design
- Error and success state visual language

### Navigation
- Type: top bar, sidebar, bottom tab, floating pill, drawer
- Active state treatment
- Mobile vs desktop behavior if inferable

### Signature / Unique Components
- Name and describe any distinctive, non-standard components (e.g. "The Editorial Blob", "Floating Pill Nav", "Stacked Tag Clusters")
- Explain what makes them signature elements of this design language

---

## 8. Iconography & Imagery Rules
- Icon style: outline, filled, duotone, custom illustrated, emoji-native
- Stroke weight and corner treatment
- Image treatment: full-bleed, contained, masked, duotone-filtered, illustrated
- Aspect ratio conventions for media

---

## 9. Do's and Don'ts
Provide exactly **5 strict DO rules** and **5 strict DON'T rules** that any engineer or designer must follow to stay faithful to this design system. Be specific — not generic advice.

**DO:**
1. 
2. 
3. 
4. 
5. 

**DON'T:**
1. 
2. 
3. 
4. 
5. 

---

## 10. Design Tokens (Raw)
Output the core tokens as a structured reference block in this exact format:

\\\`\\\`\\\`
COLOR
  --color-primary: #______
  --color-secondary: #______
  --color-background: #______
  --color-surface: #______
  --color-text-primary: #______
  --color-text-secondary: #______
  --color-accent: #______
  --color-border: #______

TYPOGRAPHY
  --font-display: "______", serif
  --font-body: "______", sans-serif
  --font-mono: "______", monospace
  --font-size-base: ______px
  --line-height-base: ______

SPACING
  --space-unit: ______px
  --space-xs: ______px
  --space-sm: ______px
  --space-md: ______px
  --space-lg: ______px
  --space-xl: ______px

RADIUS
  --radius-sm: ______px
  --radius-md: ______px
  --radius-lg: ______px
  --radius-full: 9999px

SHADOW
  --shadow-sm: ______
  --shadow-md: ______
  --shadow-lg: ______
\\\`\\\`\\\`

---

Return the output as raw, beautifully structured Markdown. Do NOT wrap the entire response in a markdown code block. Headings must be clean. Sections must be complete. Inferences must be confident — never say "I think" or "it appears". Speak as the architect who built it.`;

  const imageParts = images.map((dataUrl) => {
    const [header, base64] = dataUrl.split(",");
    const mimeType = header.split(":")[1].split(";")[0];
    
    return {
      inlineData: {
        data: base64,
        mimeType
      }
    };
  });

  // We loop through models with the highest free RPM limits first to ensure we don't hit a wall
  const availableModels = [
    "gemini-2.0-flash", // 15 RPM
    "gemini-2.5-flash", // 10 RPM
    "gemini-1.5-pro",   // 2 RPM
    "gemini-1.5-flash"  // 15 RPM
  ];

  let lastError;

  for (const modelName of availableModels) {
    try {
      console.log("Attempting generation with: " + modelName);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.warn("Model " + modelName + " failed. Failing over...", error);
      lastError = error;
    }
  }

  // If all fallback loops fail
  console.error("All Gemini API models failed.", lastError);
  throw new Error("The AI backend is currently overwhelmed. Please try again later.");
}
