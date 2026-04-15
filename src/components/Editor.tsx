/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Download, Check, Edit2, Play } from "lucide-react";
import { motion } from "framer-motion";

interface EditorProps {
  content: string;
  allowEditing?: boolean;
}

export function Editor({ content, allowEditing = false }: EditorProps) {
  const [markdown, setMarkdown] = useState(content);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "design.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Extract colors for smart preview
  const colors = Array.from(markdown.matchAll(/#([0-9a-fA-F]{3,6})\b/g)).map(m => m[0]);
  const uniqueColors = [...new Set(colors)];

  return (
    <section className="py-20 px-6 animate-soft-rise">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-display">Generated design.md</h2>
            <p className="text-text-secondary">Your AI-ready design specification is ready.</p>
          </div>
          <div className="flex gap-4">
            {allowEditing && (
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="btn-secondary flex items-center gap-2"
              >
                {isEditing ? <Play className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                {isEditing ? "Preview" : "Edit MD"}
              </button>
            )}
            <button onClick={copyToClipboard} className="btn-secondary flex items-center gap-2">
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              Copy
            </button>
            <button onClick={downloadFile} className="btn-primary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download .md
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="glass-card rounded-xl overflow-hidden min-h-[600px] flex flex-col">
              <div className="bg-surface-highest/50 px-6 py-3 border-b border-outline-variant text-xs font-mono text-text-variant flex justify-between">
                <span>DESIGN_SPEC_FILE</span>
                <span>MARKDOWN</span>
              </div>
              
              {allowEditing && isEditing ? (
                <textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  className="flex-1 p-8 bg-transparent font-mono text-sm outline-none resize-none custom-scrollbar"
                />
              ) : (
                <div className="p-8 prose prose-murrey max-w-none custom-scrollbar overflow-y-auto max-h-[800px]">
                  <ReactMarkdown
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-4xl font-display text-murrey mb-6" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-2xl font-display text-text-primary mt-8 mb-4 border-b border-murrey/10 pb-2" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 mb-4" {...props} />,
                      li: ({node, ...props}) => <li className="text-text-secondary" {...props} />,
                      p: ({node, ...props}) => <p className="text-text-primary leading-relaxed mb-4" {...props} />,
                      code: ({node, ...props}) => <code className="bg-murrey-ghost px-1.5 py-0.5 rounded font-mono text-sm text-murrey" {...props} />,
                    }}
                  >
                    {markdown}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-display text-xl mb-4">Detected Palette</h3>
              <div className="flex flex-wrap gap-3">
                {uniqueColors.map(color => (
                  <div key={color} className="group relative">
                    <div 
                      className="w-10 h-10 rounded-full shadow-inner border border-outline-variant"
                      style={{ backgroundColor: color }}
                    />
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] bg-black text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {color}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-xl p-6">
              <h3 className="font-display text-xl mb-4">System Confidence</h3>
              <div className="space-y-4">
                <ConfidenceBar label="Colors" score={0.95} />
                <ConfidenceBar label="Typography" score={0.85} />
                <ConfidenceBar label="Layout" score={0.92} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ConfidenceBar({ label, score }: { label: string, score: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-medium">
        <span>{label}</span>
        <span>{Math.round(score * 100)}%</span>
      </div>
      <div className="w-full bg-surface-highest h-1 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score * 100}%` }}
          className="h-full bg-murrey"
        />
      </div>
    </div>
  );
}
