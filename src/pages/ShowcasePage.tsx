import { FC, useEffect, useMemo, useRef, useState } from "react";
import { collection, query, where, getDocs, orderBy, limit, startAfter, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { User } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { SEO } from "../components/SEO";

export interface DesignDocument {
  id: string;
  userId?: string;
  content?: string;
  createdAt?: number;
  [key: string]: unknown;
}

interface ShowcaseDesign extends DesignDocument {
  palette: string[];
}

const HEX_COLOR_REGEX = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g;

const normalizeHexColor = (value: string) => {
  const hex = value.replace("#", "").toUpperCase();
  if (hex.length === 3) {
    return `#${hex.split("").map(char => `${char}${char}`).join("")}`;
  }
  if (hex.length === 6) {
    return `#${hex}`;
  }
  return null;
};

const extractPalette = (raw: string, max = 6) => {
  const rawMatches = Array.from(raw.matchAll(HEX_COLOR_REGEX)).map(match => match[0]);
  const normalizedMatches = rawMatches
    .map(color => normalizeHexColor(color))
    .filter((color): color is string => Boolean(color));
  return Array.from(new Set(normalizedMatches)).slice(0, max);
};

export const ShowcasePage: FC = () => {
  const [designs, setDesigns] = useState<DesignDocument[]>([]);
  const [colorQuery, setColorQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          fetchShowcase(true);
        }
      },
      { threshold: 0.1 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loadingMore, loading]);

  const fetchShowcase = async (isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      let q = query(collection(db, "designs"), orderBy("createdAt", "desc"), limit(10));
      if (isLoadMore && lastDoc) {
        q = query(collection(db, "designs"), orderBy("createdAt", "desc"), startAfter(lastDoc), limit(10));
      }
      
      const querySnapshot = await getDocs(q);
      const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (querySnapshot.docs.length < 10) {
        setHasMore(false);
      }
      if (querySnapshot.docs.length > 0) {
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }

      if (isLoadMore) {
        setDesigns(prev => [...prev, ...fetched]);
      } else {
        setDesigns(fetched);
      }
    } catch (err) {
      console.error("Error fetching showcase:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchShowcase();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const extractTitle = (raw: string) => {
    const h1Match = raw.match(/^#\s+(.*)/m);
    if (h1Match && !h1Match[1].includes('Overview')) return h1Match[1].trim();
    
    // Fallback to searching for the identity string inferred by the AI
    const identityMatch = raw.match(/(?:Creative Identity|Creative North Star).*?[:*]+\s*["']?([^"'\n\r*]+)["']?/i);
    if (identityMatch && identityMatch[1] && identityMatch[1].length < 50) return identityMatch[1].trim();
    
    return "design.md Blueprint";
  };

  const extractDescription = (raw: string) => {
    const lines = raw.split('\n');
    for (const l of lines) {
      const text = l.trim();
      // Find the first actual paragraph or long bullet point that represents the description
      if (text.length > 80 && !text.startsWith('#')) {
        return text.replace(/[*_`]/g, '').substring(0, 200) + '...';
      }
    }
    return raw.substring(0, 200).replace(/[*_#]/g, '') + '...';
  };

  const showcaseDesigns = useMemo<ShowcaseDesign[]>(
    () => designs.map(design => ({ ...design, palette: extractPalette(design.content || "") })),
    [designs]
  );

  const trendingColors = useMemo(() => {
    const counts = new Map<string, number>();
    showcaseDesigns.forEach(design => {
      design.palette.forEach(color => {
        counts.set(color, (counts.get(color) || 0) + 1);
      });
    });

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([color]) => color);
  }, [showcaseDesigns]);

  const normalizedColorQuery = normalizeHexColor(colorQuery.trim());
  const fallbackQuery = colorQuery.trim().replace("#", "").toUpperCase();

  const filteredDesigns = useMemo(() => {
    if (!colorQuery.trim()) return showcaseDesigns;

    return showcaseDesigns.filter(design => {
      if (normalizedColorQuery) {
        return design.palette.includes(normalizedColorQuery);
      }
      if (!fallbackQuery) return true;
      return design.palette.some(color => color.replace("#", "").includes(fallbackQuery));
    });
  }, [showcaseDesigns, colorQuery, normalizedColorQuery, fallbackQuery]);

  return (
    <>
      <SEO 
        title="Community Showcase"
        description="A curated gallery of UI architectures and design tokens extracted by researchers using design.md."
        keywords="Design Showcase, UI Gallery, Community Designs, design.md showcase"
        canonical="/showcase"
      />
      <div className="pt-24 min-h-screen bg-[#fbfaed] relative overflow-hidden">
        {/* Editorial aesthetic background shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8B004B]/5 rounded-full blur-3xl -z-10 translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-40 left-0 w-[600px] h-[600px] bg-[#8B004B]/5 editorial-blob -z-10 -translate-x-1/2 opacity-60"></div>

        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="mb-24 relative">
            <div className="absolute -left-8 top-4 w-16 h-1 bg-[#8B004B] rounded-full hidden md:block"></div>
            <h1 className="text-6xl md:text-8xl font-headline font-bold mb-6 text-[#1A0010] tracking-tighter">
              Community <span className="italic text-[#a51f5e] font-light">Showcase.</span>
            </h1>
            <p className="text-2xl font-accent text-[#646653] max-w-2xl leading-relaxed">
              A curated gallery of architectures extracted by developers using Editorial Artisan.
            </p>
          </div>

          <div className="mb-16 bg-white/70 backdrop-blur-sm border border-[#b9bba5]/30 rounded-[2.5rem] p-6 md:p-8 shadow-[0_20px_60px_-35px_rgba(139,0,75,0.55)] relative overflow-hidden">
            <div className="absolute -top-16 -right-12 h-36 w-36 rounded-full bg-[#8B004B]/10 blur-2xl"></div>
            <div className="absolute -bottom-20 -left-6 h-44 w-44 bg-gradient-to-br from-[#b52d6b]/20 to-transparent rounded-full"></div>
            <div className="relative">
              <p className="font-label uppercase tracking-[0.3em] text-xs text-[#8B004B] mb-3">Chromatic Filter</p>
              <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                <div className="flex-1">
                  <input
                    value={colorQuery}
                    onChange={event => setColorQuery(event.target.value)}
                    placeholder="#8B004B or 8B0"
                    className="w-full bg-[#fffcf2] border border-[#b9bba5]/50 rounded-full px-6 py-4 font-mono text-sm tracking-wide text-[#1A0010] outline-none focus:border-[#8B004B] focus:ring-2 focus:ring-[#8B004B]/20 transition-all"
                  />
                </div>
                {colorQuery && (
                  <button
                    onClick={() => setColorQuery("")}
                    className="bg-[#1A0010] text-white px-6 py-3 rounded-full text-sm font-bold tracking-wider uppercase hover:bg-[#8B004B] transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              {trendingColors.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {trendingColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setColorQuery(color)}
                      className={`group inline-flex items-center gap-2 rounded-full px-3 py-2 border transition-all ${
                        colorQuery.toUpperCase() === color
                          ? "border-[#8B004B] bg-[#8B004B]/10"
                          : "border-[#b9bba5]/40 bg-[#fffcf2] hover:border-[#8B004B]/40"
                      }`}
                    >
                      <span className="h-4 w-4 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: color }} />
                      <span className="font-mono text-xs text-[#1A0010]">{color}</span>
                    </button>
                  ))}
                </div>
              )}
              <p className="mt-4 text-sm font-body text-[#646653]">
                Showing {filteredDesigns.length} of {showcaseDesigns.length} loaded blueprints. Scroll to load more in batches of 10.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-32">
              <span className="material-symbols-outlined text-[#8B004B] animate-spin text-5xl">sync</span>
            </div>
          ) : showcaseDesigns.length === 0 ? (
            <div className="text-center text-[#80826e] py-32 border-b-2 border-t-2 border-[#b9bba5]/30">
              <p className="text-2xl font-headline italic">The archive is currently empty.</p>
            </div>
          ) : filteredDesigns.length === 0 ? (
            <div className="text-center text-[#80826e] py-20 border-y-2 border-[#b9bba5]/20">
              <p className="text-2xl font-headline italic">No palettes match this color yet.</p>
              <p className="text-sm mt-3 font-mono">Try a broader hex snippet like `8B` or clear the filter.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {filteredDesigns.map((design, index) => {
                const isEven = index % 2 === 0;
                const title = extractTitle(design.content || "");
                const description = extractDescription(design.content || "");
                
                return (
                  <Link to={`/design/${design.id}`} key={design.id} className="group block relative">
                    <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16`}>
                      
                      {/* Visual Anchor Block */}
                      <div className="w-full md:w-1/3 bg-white rounded-3xl shadow-sm border border-[#b9bba5]/20 group-hover:border-[#8B004B]/40 group-hover:shadow-xl transition-all duration-500 relative overflow-hidden flex items-center justify-center min-h-[200px]">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#8B004B]/5 rounded-full group-hover:scale-150 transition-transform duration-700 ease-out"></div>
                        <div className="absolute -left-10 -bottom-10 w-32 h-32 border border-[#8B004B]/10 rounded-full group-hover:scale-150 transition-transform duration-700 ease-out delay-75"></div>
                        <div className="text-[#8B004B] font-headline text-9xl opacity-20 hover:opacity-40 leading-none font-bold italic group-hover:scale-110 transition-all duration-500 z-10">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                      </div>

                      {/* Content Block */}
                      <div className="w-full md:w-2/3 flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-4">
                          <span className="font-label text-xs uppercase tracking-widest text-[#80826e] bg-white px-3 py-1 rounded-full shadow-sm border border-[#b9bba5]/20">
                            {new Date(design.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <h3 className="text-4xl md:text-5xl font-headline font-bold text-[#1A0010] mb-6 group-hover:text-[#8B004B] transition-colors leading-tight">
                          {title}
                        </h3>
                        <div className="text-lg font-body text-[#646653] line-clamp-3 leading-relaxed opacity-90 max-w-2xl relative pl-6 border-l-2 border-[#b9bba5]/30">
                          {description}
                          <span className="absolute -left-3 top-0 text-3xl text-[#8B004B] font-headline">"</span>
                        </div>
                        {design.palette.length > 0 && (
                          <div className="mt-6 flex flex-wrap gap-2">
                            {design.palette.map(color => (
                              <button
                                key={`${design.id}-${color}`}
                                onClick={event => {
                                  event.preventDefault();
                                  setColorQuery(color);
                                }}
                                className="inline-flex items-center gap-2 rounded-full border border-[#b9bba5]/40 bg-white/90 px-3 py-1.5 hover:border-[#8B004B]/50 transition-colors"
                              >
                                <span className="h-3.5 w-3.5 rounded-full border border-black/10" style={{ backgroundColor: color }} />
                                <span className="font-mono text-xs text-[#1A0010]">{color}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        
                        <div className="mt-8 flex items-center text-[#b52d6b] font-bold tracking-widest text-sm uppercase opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          Explore Blueprint <span className="material-symbols-outlined ml-2 text-md">arrow_forward</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {hasMore && (
                <div ref={observerTarget} className="pt-16 pb-8 flex justify-center">
                  <span className="material-symbols-outlined text-[#8B004B] animate-spin text-4xl opacity-50">sync</span>
                </div>
              )}
              {!hasMore && showcaseDesigns.length > 0 && (
                <div className="pt-16 pb-8 text-center text-[#b9bba5] font-accent italic text-lg">
                  End of the public archive.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const DashboardPage: FC<{ user: User | null }> = ({ user }) => {
  const [allDesigns, setAllDesigns] = useState<DesignDocument[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && visibleCount < allDesigns.length) {
          setVisibleCount(prev => prev + 10);
        }
      },
      { threshold: 0.1 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [visibleCount, allDesigns.length]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchMyDesigns = async () => {
      try {
        // Removed orderBy inside query to circumvent the missing composite index error.
        // We fetch by userId and sort client-side.
        const q = query(collection(db, "designs"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DesignDocument));
        fetched.sort((a: DesignDocument, b: DesignDocument) => (b.createdAt || 0) - (a.createdAt || 0));
        
        setAllDesigns(fetched);
      } catch (err) {
        console.error("Error fetching usage data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyDesigns();
    window.scrollTo(0, 0);
  }, [user, navigate]);

  const visibleDesigns = allDesigns.slice(0, visibleCount);

  if (!user) return null;

  return (
    <>
      <SEO 
        title="Your Workspace"
        description="Private archive of UI elements and design tokens extracted by your agents."
        keywords="Design Dashboard, Private Gallery, UI Workspace"
        canonical="/dashboard"
      />
      <div className="pt-24 min-h-screen bg-[#fffcf2]">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 border-b border-[#b9bba5]/20 pb-12">
            <div>
              <h1 className="text-5xl md:text-6xl font-headline font-bold mb-4 text-[#1A0010]">Your Workspace.</h1>
              <p className="text-xl font-accent text-[#646653] italic">Private archive of elements extracted by your agents.</p>
            </div>
            <button onClick={() => navigate('/upload')} className="mt-8 md:mt-0 bg-[#8B004B] text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:shadow-[#8B004B]/20 transition-all hover:-translate-y-1 flex items-center gap-2">
              <span className="material-symbols-outlined">add</span> New Generation
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="material-symbols-outlined text-[#8B004B] animate-spin text-4xl">sync</span>
            </div>
          ) : allDesigns.length === 0 ? (
            <div className="text-center py-32 bg-white shadow-sm rounded-[3rem] border border-[#b9bba5]/20">
              <div className="w-24 h-24 bg-[#fbfaed] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-4xl text-[#b52d6b]">design_services</span>
              </div>
              <h3 className="text-3xl font-headline font-bold text-[#1A0010] mb-4">No layouts found</h3>
              <p className="text-lg text-[#646653] font-body mb-8 max-w-sm mx-auto">You haven't extracted any designs yet. Drop a screenshot to begin.</p>
              <button onClick={() => navigate('/upload')} className="bg-transparent border-2 border-[#b52d6b] text-[#b52d6b] font-bold px-8 py-3 rounded-full hover:bg-[#b52d6b] hover:text-white transition-colors">
                Start first extraction
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleDesigns.map(design => {
                // Internal extraction for dashboard
                const getT = (r: string) => {
                  const idMatch = r.match(/(?:Creative Identity|Creative North Star).*?[:*]+\s*["']?([^"'\n\r*]+)["']?/i);
                  return idMatch && idMatch[1] && idMatch[1].length < 50 ? idMatch[1].trim() : "design.md Blueprint";
                };
                const getD = (r: string) => {
                  for (const l of r.split('\n')) {
                    const t = l.trim();
                    if (t.length > 80 && !t.startsWith('#')) return t.replace(/[*_`]/g, '').substring(0, 150) + '...';
                  }
                  return r.substring(0, 150).replace(/[*_#]/g, '') + '...';
                };
                const title = getT(design.content || "");
                const description = getD(design.content || "");
                
                return (
                <Link to={`/design/${design.id}`} key={design.id} className="group block bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-8 border border-[#b9bba5]/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B004B]/5 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-label text-xs uppercase tracking-widest text-[#80826e] bg-[#fbfaed] px-3 py-1 rounded-full">
                      {new Date(design.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                    <span className="bg-[#b52d6b] text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm">Owner</span>
                  </div>
                  <h3 className="text-2xl font-headline font-bold text-[#1A0010] mb-4 group-hover:text-[#8B004B] transition-colors leading-tight">
                    {title}
                  </h3>
                  <div className="w-12 h-1 bg-[#b9bba5]/40 rounded-full mb-4 group-hover:bg-[#8B004B] group-hover:w-20 transition-all duration-300"></div>
                  <div className="text-sm font-body text-[#646653] line-clamp-3 leading-relaxed opacity-80">
                    {description}
                  </div>
                </Link>
              )})}
            </div>
          )}

          {!loading && visibleCount < allDesigns.length && (
            <div ref={observerTarget} className="pt-16 pb-8 flex justify-center">
              <span className="material-symbols-outlined text-[#8B004B] animate-spin text-4xl opacity-50">sync</span>
            </div>
          )}
          {!loading && visibleCount >= allDesigns.length && allDesigns.length > 0 && (
            <div className="pt-16 pb-8 text-center text-[#b9bba5] font-accent italic text-lg">
              End of your private archive.
            </div>
          )}
        </div>
      </div>
    </>
  );
};
