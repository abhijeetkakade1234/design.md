// Mock Gemini Service for UI development phase
export async function analyzeUI(images: string[]): Promise<string> {
  console.log("Mock analysis started for", images.length, "images");
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));

  return `# design.md - Mock Specification

## 🎨 Color Palette
- **Primary**: #8b004b (Murrey) - Used for major accents and backgrounds.
- **Secondary**: #fffcf2 (Alabaster) - The primary background color.
- **Text**: #1A0010 - Deep charcoal for maximum readability.

## 📐 Layout Logic
- **Grid**: 12-column liquid grid system.
- **Spacing**: 8px base unit (scales of 8, 16, 24, 32, 64).
- **Radius**: Large 3rem (xl) and 2rem (lg) corners for a soft, premium feel.

## ✍️ Typography
- **Display**: Cormorant Garamond (Serif)
- **UI/Body**: DM Sans (Sans-serif)
- **Accent**: Cookie (Cursive)

## 🏗️ Structure
- Header: Fixed glassmorphic navigation.
- Hero: Centered display typography with organic animated blobs.
- Main: Alternating background sections based on shifts in tone (No-Line Rule).
`;
}
