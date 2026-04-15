import { FC } from "react";
import { Link } from "react-router-dom";

export const Footer: FC = () => {
  return (
    <footer className="w-full rounded-t-[3rem] mt-20 bg-[#8B004B] text-[#fffcf2] flex flex-col items-center justify-center py-20 px-4 space-y-8 relative overflow-hidden">
      <div className="absolute top-10 right-10 w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[85px] border-b-white opacity-10 rotate-12"></div>
      <div className="absolute bottom-10 left-10 w-20 h-20 border-2 border-white/20 rotate-45"></div>
      <div className="absolute bottom-20 left-40 w-8 h-8 bg-white/10 rounded-full"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 dot-grid opacity-10 invert"></div>
      <div className="absolute inset-0 editorial-blob scale-150 blur-3xl opacity-20"></div>
      <div className="font-headline text-[#fffcf2] text-5xl relative z-10">design.md</div>
      <div className="flex flex-wrap justify-center gap-12 relative z-10">
        <Link to="/showcase" className="text-[#fffcf2]/60 font-body text-sm uppercase tracking-widest hover:text-white transition-opacity">Showcase</Link>
        <Link to="/upload" className="text-[#fffcf2]/60 font-body text-sm uppercase tracking-widest hover:text-white transition-opacity">Generate</Link>
        <Link to="/dashboard" className="text-[#fffcf2]/60 font-body text-sm uppercase tracking-widest hover:text-white transition-opacity">Workspace</Link>
        <a className="text-[#fffcf2]/60 font-body text-sm uppercase tracking-widest hover:text-white transition-opacity" href="mailto:abhijeetskakade04@gmail.com">Found a bug?</a>
      </div>
      <p className="font-headline text-2xl text-[#fffcf2]/80 max-w-md text-center italic relative z-10">"The digital monograph for modern design engineering."</p>
      <div className="pt-8 flex flex-col items-center gap-4 w-full relative z-10 border-t border-white/10 mt-8 max-w-4xl mx-auto">
        <div className="text-xs font-body opacity-60 uppercase tracking-[0.2em]">
          Built by <a href="https://experimentwith.abhijeetkakade.in/" target="_blank" rel="noreferrer" className="text-white hover:underline font-bold">Abhijeet</a>
        </div>
        <div className="text-[10px] font-body opacity-30 uppercase tracking-[0.3em]">
          © {new Date().getFullYear()} design.md curated works
        </div>
      </div>
    </footer>
  );
};
