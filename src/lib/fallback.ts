import { collection, doc, getDocs, limit, query, updateDoc, where } from "firebase/firestore";
import { db } from "./firebase";
import {
  buildColorMetadataFromMarkdown,
  computePaletteSimilarity,
  extractPaletteFromImages,
  normalizeHexColor,
  paletteToBuckets,
} from "./colorMetadata";

export interface FallbackMatch {
  id: string;
  content: string;
  createdAt: number;
  palette: string[];
  similarity: number;
}

export interface FallbackResult {
  sourcePalette: string[];
  matches: FallbackMatch[];
}

const chunk = <T,>(items: T[], size: number): T[][] => {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    batches.push(items.slice(i, i + size));
  }
  return batches;
};

export const findFallbackMatchesFromImages = async (images: string[], maxMatches = 8): Promise<FallbackResult> => {
  const sourcePalette = await extractPaletteFromImages(images, 8);
  const sourceBuckets = paletteToBuckets(sourcePalette);
  const candidateMap = new Map<string, { id: string; content: string; createdAt: number; palette: string[]; colorBuckets: string[] }>();

  if (sourceBuckets.length > 0) {
    const bucketChunks = chunk(sourceBuckets, 10);
    for (const bucketChunk of bucketChunks) {
      const candidatesQuery = query(
        collection(db, "designs"),
        where("colorBuckets", "array-contains-any", bucketChunk),
        limit(40)
      );
      const snapshot = await getDocs(candidatesQuery);
      snapshot.docs.forEach(document => {
        const data = document.data() as {
          content?: string;
          createdAt?: number;
          palette?: string[];
          colorBuckets?: string[];
        };
        if (!data.content) return;
        candidateMap.set(document.id, {
          id: document.id,
          content: data.content,
          createdAt: data.createdAt || 0,
          palette: Array.isArray(data.palette) ? data.palette : [],
          colorBuckets: Array.isArray(data.colorBuckets) ? data.colorBuckets : [],
        });
      });
    }
  }

  // If prefilter returns nothing (or older docs are missing metadata), sample broader docs.
  if (candidateMap.size === 0) {
    const wideQuery = query(collection(db, "designs"), limit(80));
    const snapshot = await getDocs(wideQuery);
    snapshot.docs.forEach(document => {
      const data = document.data() as {
        content?: string;
        createdAt?: number;
        palette?: string[];
        colorBuckets?: string[];
      };
      if (!data.content) return;
      candidateMap.set(document.id, {
        id: document.id,
        content: data.content,
        createdAt: data.createdAt || 0,
        palette: Array.isArray(data.palette) ? data.palette : [],
        colorBuckets: Array.isArray(data.colorBuckets) ? data.colorBuckets : [],
      });
    });
  }

  const matches: FallbackMatch[] = [];
  for (const candidate of candidateMap.values()) {
    const normalizedStoredPalette = candidate.palette
      .map(color => normalizeHexColor(color))
      .filter((color): color is string => Boolean(color));

    let palette = normalizedStoredPalette;
    let colorBuckets = candidate.colorBuckets;
    let requiresBackfill = palette.length === 0 || colorBuckets.length === 0;

    if (requiresBackfill) {
      const metadata = buildColorMetadataFromMarkdown(candidate.content, 10);
      palette = metadata.palette;
      colorBuckets = metadata.colorBuckets;
      requiresBackfill = false;

      // Best-effort lazy backfill for older docs without metadata.
      try {
        await updateDoc(doc(db, "designs", candidate.id), {
          palette,
          colorBuckets,
        });
      } catch {
        // Firestore rules may reject this for public docs; ignore silently.
      }
    }

    if (palette.length === 0 || sourcePalette.length === 0) {
      continue;
    }

    const similarity = computePaletteSimilarity(sourcePalette, palette);
    if (similarity <= 0) continue;

    matches.push({
      id: candidate.id,
      content: candidate.content,
      createdAt: candidate.createdAt,
      palette,
      similarity,
    });
  }

  matches.sort((a, b) => {
    if (b.similarity !== a.similarity) return b.similarity - a.similarity;
    return b.createdAt - a.createdAt;
  });

  return {
    sourcePalette,
    matches: matches.slice(0, maxMatches),
  };
};
