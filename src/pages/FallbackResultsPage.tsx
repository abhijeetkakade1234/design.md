import { FC } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FallbackMatch, FallbackResult } from "../lib/fallback";

interface FallbackLocationState extends FallbackResult {
  sourceError?: string;
}

const extractTitle = (raw: string) => {
  const h1Match = raw.match(/^#\s+(.*)/m);
  if (h1Match && !h1Match[1].includes("Overview")) return h1Match[1].trim();

  const identityMatch = raw.match(/(?:Creative Identity|Creative North Star).*?[:*]+\s*["']?([^"'\n\r*]+)["']?/i);
  if (identityMatch && identityMatch[1] && identityMatch[1].length < 60) return identityMatch[1].trim();

  return "design.md Blueprint";
};

const extractDescription = (raw: string) => {
  const lines = raw.split("\n");
  for (const line of lines) {
    const text = line.trim();
    if (text.length > 90 && !text.startsWith("#")) {
      return text.replace(/[*_`]/g, "").slice(0, 180) + "...";
    }
  }
  return raw.slice(0, 180).replace(/[*_#]/g, "") + "...";
};

const similarityLabel = (match: FallbackMatch) => `${Math.round(match.similarity * 100)}% visual similarity`;
const formatCreatedAt = (createdAt?: number) =>
  createdAt ? new Date(createdAt).toLocaleDateString() : "Unknown date";

export const FallbackResultsPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || null) as FallbackLocationState | null;

  if (!state) {
    return (
      <div className="pt-24 min-h-screen bg-[#fbfaed]">
        <div className="max-w-4xl mx-auto px-8 py-20 text-center">
          <h1 className="text-5xl font-headline font-bold text-[#1A0010]">Fallback results expired.</h1>
          <p className="mt-4 text-lg text-[#646653]">
            This page requires a recent upload session. Start a new generation to see similar designs.
          </p>
          <button
            onClick={() => navigate("/upload")}
            className="mt-10 bg-[#8B004B] text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            Back to Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-[#fbfaed] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8B004B]/5 rounded-full blur-3xl -z-10 translate-x-1/4 -translate-y-1/4"></div>
      <div className="absolute bottom-40 left-0 w-[600px] h-[600px] bg-[#8B004B]/5 editorial-blob -z-10 -translate-x-1/2 opacity-60"></div>

      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="mb-14">
          <p className="font-label uppercase tracking-[0.28em] text-xs text-[#8B004B] mb-3">Fallback Recovery</p>
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-[#1A0010] leading-tight">
            Similar <span className="italic text-[#a51f5e] font-light">Design Directions.</span>
          </h1>
          <p className="mt-6 text-xl font-accent text-[#646653] max-w-4xl leading-relaxed">
            We're having trouble generating a custom design right now, but here are some designs with a similar look and feel based on your input.
          </p>
          {state.sourceError && (
            <p className="mt-3 text-sm text-[#8B004B]/90 font-body">AI response: {state.sourceError}</p>
          )}
        </div>

        {state.sourcePalette.length > 0 && (
          <div className="mb-12 bg-white/80 rounded-3xl border border-[#b9bba5]/30 shadow-sm p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-[#80826e] font-label mb-4">Extracted Palette</p>
            <div className="flex flex-wrap gap-3">
              {state.sourcePalette.map(color => (
                <div key={color} className="inline-flex items-center gap-2 rounded-full border border-[#b9bba5]/35 px-3 py-2 bg-[#fffcf2]">
                  <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: color }} />
                  <span className="font-mono text-xs text-[#1A0010]">{color}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {state.matches.length === 0 ? (
          <div className="text-center py-20 border-y-2 border-[#b9bba5]/25">
            <p className="text-3xl font-headline italic text-[#1A0010]">No similar archived palettes found yet.</p>
            <p className="mt-4 text-[#646653]">Try uploading different screenshots or try again in a minute.</p>
            <button
              onClick={() => navigate("/upload")}
              className="mt-8 bg-[#8B004B] text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              Try Another Upload
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {state.matches.map(match => (
              <Link
                to={`/design/${match.id}`}
                key={match.id}
                className="group block bg-white rounded-3xl border border-[#b9bba5]/20 p-7 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all"
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs uppercase tracking-widest bg-[#fbfaed] rounded-full px-3 py-1 text-[#80826e] font-label">
                    {formatCreatedAt(match.createdAt)}
                  </span>
                  <span className="text-xs rounded-full px-3 py-1 bg-[#8B004B]/10 text-[#8B004B] font-bold">
                    {similarityLabel(match)}
                  </span>
                </div>

                <h3 className="text-3xl font-headline font-bold text-[#1A0010] group-hover:text-[#8B004B] transition-colors leading-tight mb-4">
                  {extractTitle(match.content)}
                </h3>
                <p className="text-sm leading-relaxed text-[#646653] line-clamp-3">{extractDescription(match.content)}</p>

                {match.palette.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {match.palette.slice(0, 6).map(color => (
                      <span
                        key={`${match.id}-${color}`}
                        className="inline-flex items-center gap-2 rounded-full border border-[#b9bba5]/35 px-2.5 py-1 text-[11px] bg-[#fffcf2]"
                      >
                        <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: color }} />
                        <span className="font-mono text-[#1A0010]">{color}</span>
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-6 text-[#b52d6b] font-bold tracking-wide text-sm uppercase flex items-center">
                  Open Blueprint <span className="material-symbols-outlined ml-2 text-base">arrow_forward</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
