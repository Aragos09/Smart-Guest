
'use client';

import { useState, useEffect } from 'react';

export function DynamicBackground() {
  const [backgroundClass, setBackgroundClass] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      // Morning: 5am to 11:59am
      setBackgroundClass('bg-gradient-to-br from-blue-200 via-sky-100 to-white');
    } else if (hour >= 18 && hour < 22) {
      // Evening: 6pm to 9:59pm
      setBackgroundClass('bg-gradient-to-br from-blue-900 via-green-900/50 to-gray-900');
    } else {
        // Default
        setBackgroundClass('bg-background');
    }
  }, []);

  return <div className={`fixed inset-0 -z-10 transition-colors duration-1000 ${backgroundClass}`}></div>;
}
