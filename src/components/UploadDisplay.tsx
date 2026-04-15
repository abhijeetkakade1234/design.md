import { FC } from "react";

interface UploadDisplayProps {
  onGoToUpload: () => void;
}

export const UploadDisplay: FC<UploadDisplayProps> = ({ onGoToUpload }) => {
  return (
    <section className="py-32 bg-[#fbfaed] relative overflow-hidden">
      <div className="absolute top-10 left-10 w-24 h-24 shape-squircle bg-[#8B004B]/10 rotate-12"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#8B004B]/5 editorial-blob"></div>
      <div className="absolute top-1/2 left-0 w-12 h-12 dot-grid opacity-15"></div>
      <div className="max-w-4xl mx-auto px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="font-accent text-3xl text-[#a51f5e] block mb-2">Step 1</span>
          <h2 className="text-5xl font-headline font-bold mb-4">Drop your screenshots.</h2>
          <span className="font-accent text-2xl text-[#b52d6b] block">Up to 5 images.</span>
        </div>
        <div className="relative group">
          <div
            onClick={onGoToUpload}
            className="w-full h-80 rounded-xl border-4 border-dashed border-[#b52d6b]/20 bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-[#fffcf2] hover:border-[#b52d6b] transition-all p-8 text-center group"
          >
            <div className="w-20 h-20 rounded-full bg-[#b52d6b]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-4xl text-[#b52d6b]">cloud_upload</span>
            </div>
            <p className="text-xl font-medium text-[#646653]">Drag and drop or click to browse</p>
            <p className="text-sm text-[#80826e] mt-2">PNG, JPG or SVG (Max 10MB each)</p>
          </div>
        </div>
        {/* Sample uploaded images */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-[#b9bba5]/10 relative">
            <img className="w-full h-32 object-cover rounded-md mb-4" alt="clean user interface design screenshot" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtKI2Mdnoin2qqReMt1E4iJjRuFk1MH3GpaWXsoKsy5WRgaE46PV-uMuEI9syDINnbR-DgFLOnODmOZm6nbgAIvllqsyE9_JeZo04ZOLC0bLEnZ_eLm2TJQlNNJYv9fpgwylQbbrS_zTGvIr4Sh0gjkdD-H4xfcdYM-y0dO07W_539spuzMbd32p8QWPfukn7pWk3tparrKW4xiPoDrsb2351S-Tm0RDaOLS_BERRV0lfHBn2fVZAEnOi5EO-Y2YrB9qzZ98F-aB8"/>
            <div className="h-1 w-full bg-[#f5f4e4] rounded-full overflow-hidden">
              <div className="h-full bg-[#b52d6b] w-[85%]"></div>
            </div>
            <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#b3374e] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-[#b9bba5]/10 relative">
            <img className="w-full h-32 object-cover rounded-md mb-4" alt="mobile app design dashboard" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbNzrDK9i8FqaKfKHOKmdW4bMBrIuiG44JrK7juYX4VotZIkHqHlCEnjA-ys81VnFgBd9F8Mxxkyh7fW1iexyw36N_Vp2Kw2oueQsc_Gra2YaASDyohYgx0RpYd4vDY-UUWVqi4W2YqEWbQPRth7KGBbp8mlbQdD00G6Ydy3v9rWx5eqeEjgIc4CvSRIai1jW3ZNCFeX5quidk0WgiJdKNnwwFjQNr2tiKESz6OH4Nj50EwLQymu9Tf40K35_e87hm8diW_KGv2QE"/>
            <div className="h-1 w-full bg-[#f5f4e4] rounded-full overflow-hidden">
              <div className="h-full bg-[#b52d6b] w-[100%]"></div>
            </div>
            <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#b3374e] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>
        <button
          onClick={onGoToUpload}
          className="w-full mt-12 bg-[#b52d6b] text-white py-6 rounded-full text-xl font-bold flex items-center justify-center gap-3 shadow-xl hover:-translate-y-0.5 transition-all"
        >
          Generate design.md
          <span className="material-symbols-outlined">magic_button</span>
        </button>
      </div>
    </section>
  );
};
