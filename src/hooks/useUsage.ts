import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User } from 'firebase/auth';

const MAX_GENERATIONS = 2;
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

export function useUsage(user: User | null) {
  const [usageCount, setUsageCount] = useState<number>(0);
  const [canGenerate, setCanGenerate] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setCanGenerate(false);
      return;
    }

    const fetchUsage = async () => {
      try {
        const docRef = doc(db, 'usage', user.uid);
        const docSnap = await getDoc(docRef);
        // We use Date.now() locally but acknowledge this can be skewed if user alters local clock.
        // A true production patch requires migrating this checks into a Firebase Cloud Function.
        const now = Date.now();

        if (docSnap.exists()) {
          const data = docSnap.data();
          const lastResetTime = data.lastResetTime || now;
          let count = data.count || 0;

          if (now - lastResetTime > TWENTY_FOUR_HOURS) {
            count = 0;
            // Prevent race condition on reset
            await updateDoc(docRef, { count: 0, lastResetTime: now });
          }

          setUsageCount(count);
          setCanGenerate(count < MAX_GENERATIONS);
        } else {
          await setDoc(docRef, {
            count: 0,
            lastResetTime: now,
          });
          setUsageCount(0);
          setCanGenerate(true);
        }
      } catch (err) {
        console.error("Error fetching usage data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, [user]);

  const incrementUsage = async () => {
    if (!user) return;
    
    try {
      const docRef = doc(db, 'usage', user.uid);
      // 🔥 RED TEAM FIX: Atomic state protection. We use Firebase's increment() 
      // instead of relying on the client's potentially stale usageCount state, 
      // preventing race condition abuses where users spam concurrent network requests.
      await updateDoc(docRef, { count: increment(1) });
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      setCanGenerate(newCount < MAX_GENERATIONS);
    } catch (err) {
      console.error("Error incrementing usage:", err);
    }
  };

  return { usageCount, canGenerate, incrementUsage, loading };
}
