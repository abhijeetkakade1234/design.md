import { FC } from "react";
import { User } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
  onLogout: () => void;
  user: User | null;
}

export const Navbar: FC<NavbarProps> = ({ onLogout, user }) => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav">
      <div className="flex justify-between items-center px-8 py-4">
        <Link to="/" className="text-2xl font-headline font-bold text-[#8B004B]">
          design.md
        </Link>
        <div className="hidden md:flex items-center space-x-10">
          <Link to="/showcase" className="text-[#646653] font-body font-medium hover:text-[#8B004B] transition-colors duration-300">Showcase</Link>
          <a className="text-[#646653] font-body hover:text-[#8B004B] transition-colors duration-300" href="/#how-it-works">How it Works</a>
          <a className="text-[#646653] font-body hover:text-[#8B004B] transition-colors duration-300" href="https://experimentwith.abhijeetkakade.in/" target="_blank" rel="noreferrer">Experiments</a>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <button
              onClick={onLogout}
              className="text-[#646653] font-medium hover:text-[#8B004B] transition-colors"
            >
              Sign out
            </button>
          )}
          <button
            onClick={() => navigate(user ? "/dashboard" : "/login")}
            className="bg-[#8B004B] text-white px-8 py-2.5 rounded-full font-medium hover:opacity-90 transition-all scale-95 hover:scale-100 active:scale-95 shadow-md"
          >
            {user ? "Dashboard" : "Login"}
          </button>
        </div>
      </div>
    </nav>
  );
};
