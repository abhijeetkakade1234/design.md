import { FC, useEffect } from "react";
import { Hero } from "../components/Hero";
import { UploadDisplay } from "../components/UploadDisplay";
import { ProcessingDisplay } from "../components/ProcessingDisplay";
import { OutputDisplay } from "../components/OutputDisplay";
import { HowItWorks } from "../components/HowItWorks";
import { BentoGrid } from "../components/BentoGrid";
import { Footer } from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { User } from "firebase/auth";
import { SEO } from "../components/SEO";

interface LandingPageProps {
  user: User | null;
}

export const LandingPage: FC<LandingPageProps> = ({ user }) => {
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAction = () => {
    if (user) {
      navigate('/upload');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <SEO 
        title="AI-Powered Design Intelligence"
        description="Automatically extract design tokens, layout logic, and structural semantics from your screenshots into clean, actionable markdown."
        keywords="AI, UI to Markdown, Design Tokens, Front-end development, design.md"
      />
      <div>
        <Hero onGoToUpload={handleAction} />
      <UploadDisplay onGoToUpload={handleAction} />
      <ProcessingDisplay />
      <OutputDisplay />
      <HowItWorks />
      <BentoGrid />
      <Footer />
      </div>
    </>
  );
};
