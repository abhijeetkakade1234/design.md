import { FC, useState, useRef, useEffect } from "react";
import { useUsage } from "../hooks/useUsage";
import { useNavigate } from "react-router-dom";
import { User } from "firebase/auth";
import { analyzeUI } from "../lib/gemini";
import { buildColorMetadataFromMarkdown } from "../lib/colorMetadata";
import { findFallbackMatchesFromImages } from "../lib/fallback";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { ProcessingDisplay } from "../components/ProcessingDisplay";

interface UploadPageProps {
  user: User | null;
}

export const UploadPage: FC<UploadPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const { usageCount, canGenerate, incrementUsage, loading } = useUsage(user);

  const [images, setImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processingRef = useRef(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
    window.scrollTo(0, 0);
  }, [user, loading, navigate]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = 'target' in e ? (e.target as HTMLInputElement).files : (e as React.DragEvent).dataTransfer.files;
    if (!files) return;

    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`Security: ${file.name} is not a valid image file.`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(`Security: ${file.name} exceeds the 10MB limit payload constraint.`);
        return false;
      }
      return true;
    });

    const newImages: Promise<string>[] = validFiles
      .slice(0, 5 - images.length)
      .map(file => new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      }));

    Promise.all(newImages).then(base64s => {
      setImages(prev => [...prev, ...base64s]);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const generate = async () => {
    if (processingRef.current) return;
    if (images.length === 0 || !canGenerate || !user) return;
    
    processingRef.current = true;
    setProcessing(true);
    
    try {
      // 1. Ask Gemini to generate the markdown
      const result = await analyzeUI(images);
      const metadata = buildColorMetadataFromMarkdown(result, 10);
      
      // 2. Save result to Firestore designs collection
      const docRef = await addDoc(collection(db, "designs"), {
        userId: user.uid,
        content: result,
        createdAt: Date.now(),
        palette: metadata.palette,
        colorBuckets: metadata.colorBuckets,
      });
      
      // 3. Mark usage
      await incrementUsage();
      
      // 4. Navigate to the unique URL
      navigate(`/design/${docRef.id}`);
      
    } catch (err) {
      console.error("Gemini generation failed, attempting fallback matching:", err);
      try {
        const fallbackResult = await findFallbackMatchesFromImages(images, 8);
        navigate("/fallback", {
          state: {
            ...fallbackResult,
            sourceError: err instanceof Error ? err.message : "AI generation failed.",
          },
        });
      } catch (fallbackError) {
        console.error("Fallback matching also failed:", fallbackError);
        alert("There was an error generating your design and finding fallback matches. Please try again.");
      } finally {
        processingRef.current = false;
        setProcessing(false);
      }
    }
  };

  if (loading || !user) return null;

  if (processing) {
    return (
      <div className="min-h-screen bg-[#fbfaed] pt-24">
        <ProcessingDisplay />
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-[#fbfaed]">
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-24 h-24 shape-squircle bg-[#8B004B]/10 rotate-12 -z-0"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#8B004B]/5 editorial-blob -z-0"></div>
        <div className="absolute top-1/2 left-0 w-12 h-12 dot-grid opacity-15"></div>
        
        <div className="max-w-4xl mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="font-accent text-3xl text-[#a51f5e] block mb-2">Step 1</span>
            <h2 className="text-5xl font-headline font-bold mb-4">Drop your screenshots.</h2>
            
            <div className="flex items-center justify-center gap-4 mt-6">
              <span className="font-accent text-2xl text-[#b52d6b] block">Up to 5 images.</span>
              <div className="bg-[#b52d6b]/10 text-[#b52d6b] px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#b52d6b] mr-2 animate-pulse"></span>
                {2 - usageCount} generations left today
              </div>
            </div>
          </div>

          <div className="relative group">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFile}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFile}
              className={`w-full h-80 rounded-2xl border-4 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all p-8 text-center bg-white shadow-sm
                ${isDragging ? 'border-[#b52d6b] bg-[#b52d6b]/5 scale-[0.99]' : 'border-[#b52d6b]/20 hover:border-[#b52d6b] hover:bg-[#fffcf2] hover:shadow-md'}`}
            >
              <div className="w-20 h-20 rounded-full bg-[#b52d6b]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-4xl text-[#b52d6b]">cloud_upload</span>
              </div>
              <p className="text-xl font-medium text-[#646653]">Drag and drop or click to browse</p>
              <p className="text-sm text-[#80826e] mt-2">PNG, JPG or SVG (Max 10MB each)</p>
            </div>
          </div>

          {/* Sample uploaded images matching UploadDisplay aesthetic */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {images.map((img, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-[#b9bba5]/20 relative group hover:shadow-md transition-shadow">
                  <div className="w-full h-24 bg-[#efefdb] rounded-md mb-3 flex items-center justify-center overflow-hidden">
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="h-1 w-full bg-[#f5f4e4] rounded-full overflow-hidden">
                    <div className="h-full bg-[#8B004B] w-full"></div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#b3374e] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={generate}
            disabled={images.length === 0 || !canGenerate}
            className={`w-full mt-12 text-white py-5 rounded-full text-xl font-bold flex items-center justify-center gap-3 shadow-xl transition-all
              ${images.length === 0 || !canGenerate 
                ? 'bg-[#b9bba5] cursor-not-allowed opacity-50' 
                : 'bg-[#b52d6b] hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98]'}`}
          >
            {canGenerate ? "Generate design.md" : "Out of Generations"}
            <span className="material-symbols-outlined">magic_button</span>
          </button>
        </div>
      </section>
    </div>
  );
};
