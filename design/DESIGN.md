# Design System Strategy: The Editorial Artisan

## 1. Overview & Creative North Star
The North Star for this design system is **"The Digital Curator."** 

We are moving away from the "app-like" rigidity of standard SaaS interfaces and toward the prestige of a high-end fashion editorial or a bespoke architecture monograph. This system treats the browser viewport as a physical canvas. By combining the fluidity of **Material You Expressive** with the timelessness of serif typography, we create an environment that feels "designer-engineered"—intentional, breathable, and unapologetically premium.

The visual language relies on **intentional asymmetry**. Do not center-align every element; allow "blobs" and organic SVG shapes to break the container edges, creating a sense of motion and life.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
The palette is rooted in the rich, wine-soaked depth of **Murrey** and the warmth of **Alabaster**. To maintain a luxury feel, we avoid the "cheapness" of digital gray.

### The "No-Line" Rule
**Explicit Instruction:** Prohibit the use of 1px solid borders to define sections. Sectioning must be achieved through:
1.  **Background Shifts:** Transitioning from `surface` (#fffcf2) to `surface-container-low` (#fbfaed).
2.  **Organic Silhouettes:** Using the `primary-container` (#ffa8c4) in a large, soft organic shape to cradle a content block.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, fine papers. 
- **Base Layer:** `surface`
- **Raised Content:** `surface-container`
- **Interactive Elements:** `surface-container-highest`
Each layer should be defined by a subtle shift in Alabaster tones, never by an outline.

### The Glass & Gradient Rule
Floating elements (Modals, Navigation Bars) should utilize **Glassmorphism**. Use a semi-transparent `surface` color with a `backdrop-filter: blur(20px)`. This allows the vibrant Murrey accents to bleed through the background, softening the interface.

### Signature Textures
Main CTAs and Hero sections should rarely be flat. Use a linear gradient: 
`linear-gradient(135deg, var(--primary) 0%, var(--primary-dim) 100%)`.
This adds "soul" and mimics the way light hits a physical material.

---

## 3. Typography: The Editorial Voice
Our typography is a conversation between the classical and the functional.

*   **Display (Cormorant Garamond):** Our "Couture" voice. Use `display-lg` for hero statements. It should feel oversized and authoritative.
*   **Accent (Cookie):** Our "Handwritten" annotation. Use this sparingly for pull-quotes, decorative labels, or "Editor's Notes." It breaks the digital grid with human warmth.
*   **Body/UI (DM Sans):** Our "Technical" voice. This provides the legibility required for complex information.

**Hierarchy Note:** Always pair a `display-lg` heading with a `body-lg` lead-in paragraph in `on-surface-variant` (#646653) to create a sophisticated, low-contrast reading experience.

---

## 4. Elevation & Depth
We reject the standard "Drop Shadow." Depth in this system is atmospheric.

*   **Tonal Layering:** Place a `surface-container-lowest` card on a `surface-container-low` section. The contrast is enough to create a "soft lift" without visual noise.
*   **Ambient Shadows:** For floating cards, use the "Murrey Shadow": `0 8px 32px rgba(139, 0, 75, 0.12)`. This replaces neutral gray with a warm, wine-tinted glow, making the shadow feel like a reflection of the brand color.
*   **The Ghost Border:** If a boundary is required for accessibility, use the `outline-variant` (#b9bba5) at **10% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
*   **Primary:** Pill-shaped (`rounded-full`), `primary` (#b52d6b) background, `on-primary` (#ffffff) text. Use the signature gradient on hover.
*   **Secondary:** Pill-shaped, `surface-container-high` background. No border.
*   **Tertiary:** Text-only in `primary`, with the **Cookie** font for a "Hand-styled" look in special editorial contexts.

### Cards & Lists
*   **Forbid Dividers:** Never use horizontal lines to separate list items. Use 24px-32px of vertical white space or a alternating `surface-container` background shifts.
*   **Radius:** Cards must use `rounded-lg` (2rem) to `rounded-xl` (3rem) to maintain the "Expressive" organic vibe.

### Input Fields
*   **Style:** Minimalist. No enclosing box. Use a `surface-container-highest` bottom bar (2px) that expands into an organic "blob" shape upon focus.
*   **Labels:** Use `label-md` in `on-secondary-fixed-variant` (#794f5f).

### Signature Component: The "Editorial Blob"
*   **Usage:** A background decorative element using `Murrey Ghost` (rgba(139, 0, 75, 0.08)). It should sit behind text or images, with a slow, 10-second CSS "liquid" animation to give the page a breathing quality.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical margins (e.g., 8% left, 12% right) to create editorial interest.
*   **Do** let images overlap the container boundaries of cards.
*   **Do** use `Cormorant Garamond` in Italics for emphasis within body text.

### Don’t:
*   **Don't** use 100% black (#000000). Use `Text Primary` (#1A0010) for all dark elements.
*   **Don't** use sharp 90-degree corners. Everything must feel "honed" and "softened."
*   **Don't** use standard Material icons in isolation. Enclose them in a `Murrey Ghost` circle to give them a "stamped" look.

---

## 7. Interaction & Motion
Motion is not a utility; it is a brand statement.
*   **The "Ink Flow" Transition:** Page transitions should mimic ink spreading across paper—using a center-out mask expansion in the `primary` color.
*   **Staggered Entrance:** Elements should not pop in. Use a "soft rise" (Y-offset 20px to 0px) with a `cubic-bezier(0.34, 1.56, 0.64, 1)` easing.