import { FC, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { User } from "firebase/auth";
import { Editor } from "../components/Editor";

interface DesignViewPageProps {
  user: User | null;
}

export const DesignViewPage: FC<DesignViewPageProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<string | null>(null);
  const [authorId, setAuthorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the design document by its :id from Firestore
  useEffect(() => {
    const fetchDesign = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "designs", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setContent(docSnap.data().content);
          setAuthorId(docSnap.data().userId);
        } else {
          // No document found; handle appropriately
          setContent(null);
        }
      } catch (err) {
        console.error("Error fetching document:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDesign();
    window.scrollTo(0, 0);
  }, [id]);

  const handleDelete = async () => {
    if (!id || user?.uid !== authorId) return;
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this layout?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "designs", id));
      navigate("/dashboard");
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("Failed to delete the design.");
    }
  };

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-[#fffcf2] flex items-center justify-center">
        <span className="material-symbols-outlined text-[#8B004B] animate-spin text-4xl">sync</span>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="pt-24 min-h-screen bg-[#fffcf2] flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-headline font-bold text-[#1a0010] mb-4">404 - Document Not Found</h1>
        <p className="text-[#646653] font-body mb-8">This design may have been deleted by the author.</p>
        <Link to="/showcase" className="text-[#8B004B] font-bold underline">Go to Showcase</Link>
      </div>
    );
  }

  const isOwner = user?.uid === authorId;

  return (
    <div className="pt-24 min-h-screen bg-[#fffcf2]">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate("/showcase")} className="text-[#b52d6b] font-medium flex items-center gap-2 hover:underline">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Gallery
          </button>
          
          <div className="flex items-center gap-6">
            <div className="text-sm font-label uppercase tracking-widest text-[#646653]">
              Result: <span className="text-[#b52d6b] font-bold">design.md</span>
            </div>
            
            {isOwner && (
              <button 
                onClick={handleDelete}
                className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-md hover:bg-red-100 flex items-center gap-2 transition-colors font-medium text-sm shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                Delete forever
              </button>
            )}
          </div>
        </div>
      </div>
      <Editor content={content} />
    </div>
  );
};
