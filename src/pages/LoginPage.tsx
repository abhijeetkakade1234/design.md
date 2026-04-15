import { FC, useEffect, useState } from "react";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, User } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { SEO } from "../components/SEO";

interface LoginPageProps {
  user: User | null;
}

export const LoginPage: FC<LoginPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // If already logged in, skip to dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/upload");
    } catch (error) {
      const err = error as { code?: string };
      console.error("Login failed:", err);
      setError("Failed to sign in. Please try again.");
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    
    try {
      setError(null);
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/upload");
    } catch (error) {
      const err = error as { code?: string };
      console.error("Email auth failed:", err);
      // Clean up common firebase errors for the user
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Invalid email or password.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Authentication failed. Please try again.");
      }
    }
  };

  return (
    <>
      <SEO 
        title="Sign In"
        description="Join the collective of developers accelerating their workflow by perfectly capturing visual identities from pixels to markdown."
        canonical="/login"
      />
      <div className="min-h-screen flex flex-col md:flex-row bg-[#fffcf2]">
      {/* ─── LEFT SIDE (BRANDING) ─── */}
      <div className="w-full md:w-1/2 bg-[#8B004B] text-white flex flex-col justify-center p-12 md:p-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 shape-squircle rotate-12"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-0 w-24 h-24 dot-grid opacity-20"></div>
        
        <div className="relative z-10 w-full max-w-lg mx-auto md:mx-0">
          <h1 className="text-6xl md:text-7xl font-headline font-bold mb-6 italic tracking-tight">
            design.md
          </h1>
          <p className="text-2xl md:text-3xl font-accent text-white/80 leading-relaxed mb-8">
            The autonomous UI architect.
          </p>
          <div className="h-1 w-24 bg-white/20 rounded-full mb-8" />
          <p className="text-lg font-body text-white/70">
            Join the collective of developers accelerating their workflow by perfectly capturing visual identities from pixels to markdown.
          </p>
        </div>
      </div>

      {/* ─── RIGHT SIDE (LOGIN FORM) ─── */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>
        
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-headline font-bold text-[#1A0010] mb-2">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-[#646653] font-body mb-10">
            {isSignUp ? "Sign up to start extracting layouts." : "Sign in to orchestrate your layouts."}
          </p>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white border border-[#b9bba5] hover:border-[#8B004B] text-[#1A0010] p-4 rounded-full font-bold flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
              Continue with Google
            </button>
            
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-[#b9bba5]/30"></div>
              <span className="flex-shrink-0 mx-4 text-[#80826e] text-sm md:text-md uppercase tracking-wider font-label font-bold">or</span>
              <div className="flex-grow border-t border-[#b9bba5]/30"></div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com" 
                className="w-full bg-white border border-[#b9bba5]/50 p-4 rounded-xl font-body outline-none focus:border-[#8B004B] focus:ring-1 focus:ring-[#8B004B] transition-all"
                required
              />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" 
                className="w-full bg-white border border-[#b9bba5]/50 p-4 rounded-xl font-body outline-none focus:border-[#8B004B] focus:ring-1 focus:ring-[#8B004B] transition-all"
                required
              />
              <button 
                type="submit"
                className="w-full bg-[#1A0010] hover:bg-[#8B004B] text-white p-4 rounded-full font-bold shadow-md transition-colors"
              >
                {isSignUp ? "Sign Up" : "Sign In with Email"}
              </button>
            </form>
            
            <div className="text-center mt-4">
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm font-medium text-[#8B004B] hover:underline"
              >
                {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
              </button>
            </div>
          </div>
          
          <p className="text-center text-sm text-[#80826e] mt-12">
            By signing in, you agree to our Terms of Service and Privacy Policy. All components generated are CC0.
        </p>
      </div>
    </div>
  </div>
</>
);
};
