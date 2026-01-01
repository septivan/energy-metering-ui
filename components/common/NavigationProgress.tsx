'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Navigation progress bar component
 * Shows loading indicator during page transitions
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Start loading animation
    setLoading(true);
    setProgress(20);

    // Simulate progress
    const timer1 = setTimeout(() => setProgress(50), 100);
    const timer2 = setTimeout(() => setProgress(80), 300);
    const timer3 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setLoading(false), 200);
    }, 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="navigation-progress-container">
      <div 
        className="navigation-progress-bar"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
