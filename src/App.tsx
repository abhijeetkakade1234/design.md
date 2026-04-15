import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "./lib/firebase";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { AnimatePresence } from "framer-motion";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { UploadPage } from "./pages/UploadPage";
import { DesignViewPage } from "./pages/DesignViewPage";
import { FallbackResultsPage } from "./pages/FallbackResultsPage";
import { ShowcasePage, DashboardPage } from "./pages/ShowcasePage";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  const handleLogout = () => {
    signOut(auth);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body overflow-x-hidden relative">
      <Navbar user={user} onLogout={handleLogout} />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage user={user} />} />
          <Route path="/login" element={<LoginPage user={user} />} />
          <Route path="/upload" element={<UploadPage user={user} />} />
          <Route path="/dashboard" element={<DashboardPage user={user} />} />
          <Route path="/showcase" element={<ShowcasePage />} />
          <Route path="/design/:id" element={<DesignViewPage user={user} />} />
          <Route path="/fallback" element={<FallbackResultsPage />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
