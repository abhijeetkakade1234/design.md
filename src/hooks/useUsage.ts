/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';

// Mocking useUsage for UI testing
export function useUsage(_user: any) {
  const [usageCount] = useState<number>(0);
  const [canGenerate] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const incrementUsage = async () => {
    console.log("Mock usage incremented");
  };

  return { usageCount, canGenerate, incrementUsage, loading };
}
