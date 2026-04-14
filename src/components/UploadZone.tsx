import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Loader2, Sparkles } from "lucide-react";
import { analyzeUI } from "../lib/gemini";

interface UploadZoneProps {
  onGenerated: (content: string) => void;
  canGenerate: boolean;
  onStartProcessing: () => void;
  onIncrementUsage: () => void;
}

export function UploadZone({ onGenerated, canGenerate, onStartProcessing, onIncrementUsage }: UploadZoneProps) {
  const [images, setImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    const files = 'target' in e ? (e.target as HTMLInputElement).files : (e as React.DragEvent).dataTransfer.files;
    if (!files) return;

    const newImages: Promise<string>[] = Array.from(files)
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
    if (images.length === 0 || !canGenerate) return;
    
    setProcessing(true);
    onStartProcessing();
    
    const statuses = [
      "Analyzing layout hierarchy...",
      "Extracting design tokens and color palette...",
      "Inferring typography and spacing systems...",
      "Synthesizing layout logic for AI agents...",
      "Finalizing design.md structure..."
    ];

    let statusIndex = 0;
    const interval = setInterval(() => {
      setStatus(statuses[statusIndex]);
      statusIndex = (statusIndex + 1) % statuses.length;
    }, 2000);

    try {
      const result = await analyzeUI(images);
      clearInterval(interval);
      onGenerated(result);
      onIncrementUsage();
    } catch (error) {
      console.error(error);
      setStatus("Error generating design.md. Please try again.");
    } finally {
      setProcessing(false);
      clearInterval(interval);
    }
  };

  return (
    <section id="upload-zone" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div 
          className={`glass-card rounded-xl p-12 text-center transition-all duration-500 border-2 border-dashed ${
            isDragging ? "border-primary bg-murrey-ghost" : "border-surface-highest"
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e); }}
        >
          {images.length === 0 ? (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-murrey-ghost rounded-full flex items-center justify-center mb-6">
                <Upload className="text-murrey w-8 h-8" />
              </div>
              <h2 className="text-3xl font-display mb-4">Start your curation</h2>
              <p className="text-text-secondary mb-8">Drag and drop up to 5 screenshots here, or click to browse.</p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="btn-secondary"
              >
                Select Files
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <AnimatePresence>
                  {images.map((img, i) => (
                    <motion.div 
                      key={i}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="relative aspect-square rounded-lg overflow-hidden group"
                    >
                      <img src={img} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 p-1 bg-white/50 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-murrey" />
                      </button>
                    </motion.div>
                  ))}
                  {images.length < 5 && (
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square border-2 border-dashed border-surface-highest rounded-lg flex items-center justify-center text-text-secondary hover:border-primary hover:text-primary transition-colors"
                    >
                      <Upload className="w-6 h-6" />
                    </button>
                  )}
                </AnimatePresence>
              </div>

              {!processing ? (
                <div className="pt-4">
                  {!canGenerate && (
                    <p className="text-murrey mb-4 text-sm font-medium">Daily limit reached (2/2). Resets in 24 hours.</p>
                  )}
                  <button 
                    onClick={generate}
                    disabled={!canGenerate}
                    className={`btn-primary flex items-center gap-2 mx-auto ${!canGenerate ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Sparkles className="w-5 h-5" />
                    Generate design.md
                  </button>
                </div>
              ) : (
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-center gap-4">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <span className="text-lg font-display text-text-primary italic">{status || "Initializing AI..."}</span>
                  </div>
                  <div className="w-full bg-surface-highest h-1 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-hero-gradient" 
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 10, ease: "linear" }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <input 
          type="file" 
          hidden 
          multiple 
          accept="image/*" 
          ref={fileInputRef} 
          onChange={handleFile}
        />
      </div>
    </section>
  );
}
