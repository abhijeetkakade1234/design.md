import { motion } from "framer-motion";

export function EditorialBlob({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className={`editorial-blob ${className}`}
      style={{
        width: "600px",
        height: "600px",
      }}
    />
  );
}
