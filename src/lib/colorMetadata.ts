export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface ColorMetadata {
  palette: string[];
  colorBuckets: string[];
}

const HEX_COLOR_REGEX = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g;
const MAX_RGB_DISTANCE = Math.sqrt(255 * 255 * 3);

export const normalizeHexColor = (value: string): string | null => {
  const hex = value.replace("#", "").trim().toUpperCase();
  if (hex.length === 3) {
    return `#${hex.split("").map(char => `${char}${char}`).join("")}`;
  }
  if (hex.length === 6 && /^[0-9A-F]{6}$/.test(hex)) {
    return `#${hex}`;
  }
  return null;
};

export const extractHexPaletteFromMarkdown = (raw: string, max = 10): string[] => {
  const matches = Array.from(raw.matchAll(HEX_COLOR_REGEX)).map(match => match[0]);
  const normalized = matches
    .map(color => normalizeHexColor(color))
    .filter((color): color is string => Boolean(color));
  return Array.from(new Set(normalized)).slice(0, max);
};

export const hexToRgb = (hexColor: string): RgbColor | null => {
  const normalized = normalizeHexColor(hexColor);
  if (!normalized) return null;

  const value = normalized.slice(1);
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
};

export const rgbToHex = (rgb: RgbColor): string => {
  const channel = (value: number) => Math.max(0, Math.min(255, value)).toString(16).padStart(2, "0");
  return `#${channel(rgb.r)}${channel(rgb.g)}${channel(rgb.b)}`.toUpperCase();
};

export const toColorBucket = (hexColor: string): string | null => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return null;
  const quant = (value: number) => Math.min(7, Math.max(0, Math.floor(value / 32)));
  return `R${quant(rgb.r)}G${quant(rgb.g)}B${quant(rgb.b)}`;
};

export const paletteToBuckets = (palette: string[]): string[] => {
  const buckets = palette
    .map(color => toColorBucket(color))
    .filter((bucket): bucket is string => Boolean(bucket));
  return Array.from(new Set(buckets));
};

export const buildColorMetadataFromMarkdown = (content: string, maxPalette = 10): ColorMetadata => {
  const palette = extractHexPaletteFromMarkdown(content, maxPalette);
  return { palette, colorBuckets: paletteToBuckets(palette) };
};

const colorDistance = (a: RgbColor, b: RgbColor): number => {
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
};

export const computePaletteSimilarity = (sourcePalette: string[], candidatePalette: string[]): number => {
  if (sourcePalette.length === 0 || candidatePalette.length === 0) return 0;

  const sourceRgb = sourcePalette.map(hexToRgb).filter((item): item is RgbColor => Boolean(item));
  const candidateRgb = candidatePalette.map(hexToRgb).filter((item): item is RgbColor => Boolean(item));
  if (sourceRgb.length === 0 || candidateRgb.length === 0) return 0;

  const distances = sourceRgb.map(source => {
    let min = Number.POSITIVE_INFINITY;
    for (const candidate of candidateRgb) {
      const d = colorDistance(source, candidate);
      if (d < min) min = d;
    }
    return min;
  });

  const avgDistance = distances.reduce((sum, item) => sum + item, 0) / distances.length;
  return Math.max(0, 1 - avgDistance / MAX_RGB_DISTANCE);
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to decode uploaded image for fallback extraction."));
    image.src = src;
  });

export const extractPaletteFromImageDataUrl = async (dataUrl: string, max = 6): Promise<string[]> => {
  const image = await loadImage(dataUrl);
  const maxSide = 64;
  const ratio = Math.min(maxSide / image.width, maxSide / image.height, 1);
  const width = Math.max(1, Math.round(image.width * ratio));
  const height = Math.max(1, Math.round(image.height * ratio));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return [];

  context.drawImage(image, 0, 0, width, height);
  const { data } = context.getImageData(0, 0, width, height);

  const counts = new Map<string, number>();
  const step = 4;
  for (let idx = 0; idx < data.length; idx += step * 2) {
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const alpha = data[idx + 3];
    if (alpha < 100) continue;

    const quantized: RgbColor = {
      r: Math.min(255, Math.round(r / 32) * 32),
      g: Math.min(255, Math.round(g / 32) * 32),
      b: Math.min(255, Math.round(b / 32) * 32),
    };
    const hex = rgbToHex(quantized);
    counts.set(hex, (counts.get(hex) || 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([hex]) => hex);
};

export const extractPaletteFromImages = async (images: string[], max = 8): Promise<string[]> => {
  const countMap = new Map<string, number>();

  for (const image of images) {
    const palette = await extractPaletteFromImageDataUrl(image, max);
    for (const color of palette) {
      countMap.set(color, (countMap.get(color) || 0) + 1);
    }
  }

  return Array.from(countMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([hex]) => hex);
};
