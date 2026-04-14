import { FC } from "react";

interface NavbarProps {
  onGoToLanding: () => void;
  onGoToUpload: () => void;
}

export const Navbar: FC<NavbarProps> = ({ onGoToLanding, onGoToUpload }) => {
  return (
    <nav className="fixed top-0 w-full z-50 glass-nav">
      <div className="flex justify-between items-center px-8 py-4">
        <button onClick={onGoToLanding} className="text-2xl font-headline font-bold text-[#8B004B]">
          design.md
        </button>
        <div className="hidden md:flex items-center space-x-10">
          <a className="text-[#646653] font-body hover:text-[#8B004B] transition-colors duration-300" href="#">How it Works</a>
          <a className="text-[#646653] font-body hover:text-[#8B004B] transition-colors duration-300" href="#">Why This</a>
          <a className="text-[#646653] font-body hover:text-[#8B004B] transition-colors duration-300" href="#">GitHub</a>
        </div>
        <button
          onClick={onGoToUpload}
          className="bg-[#8B004B] text-white px-8 py-2.5 rounded-full font-medium hover:opacity-90 transition-all scale-95 hover:scale-100 active:scale-95 shadow-md"
        >
          Try Free
        </button>
      </div>
    </nav>
  );
};
