"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const CountdownTimer = dynamic(() => import('./CountdownTimer'), {
  ssr: false,
  loading: () => {
    // Static fallback while loading
    return (
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-sm font-mono uppercase tracking-[0.3em] text-gray-400">
          Drop 01 — Launching Soon
        </h3>
        <div className="flex gap-2 sm:gap-4">
          <div className="flex flex-col items-center">
            <div className="bg-white text-black px-4 py-2 rounded-lg min-w-[60px] text-center">
              <span className="text-2xl font-bold">--</span>
            </div>
            <span className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Days</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white text-black px-4 py-2 rounded-lg min-w-[60px] text-center">
              <span className="text-2xl font-bold">--</span>
            </div>
            <span className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Hours</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white text-black px-4 py-2 rounded-lg min-w-[60px] text-center">
              <span className="text-2xl font-bold">--</span>
            </div>
            <span className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Mins</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white text-black px-4 py-2 rounded-lg min-w-[60px] text-center">
              <span className="text-2xl font-bold">--</span>
            </div>
            <span className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Secs</span>
          </div>
        </div>
      </div>
    );
  }
});

export default function CountdownTimerWrapper() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-sm font-mono uppercase tracking-[0.3em] text-gray-400">
          Drop 01 — Launching Soon
        </h3>
        <div className="flex gap-2 sm:gap-4">
          <div className="flex flex-col items-center">
            <div className="bg-white text-black px-4 py-2 rounded-lg min-w-[60px] text-center">
              <span className="text-2xl font-bold">--</span>
            </div>
            <span className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Days</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white text-black px-4 py-2 rounded-lg min-w-[60px] text-center">
              <span className="text-2xl font-bold">--</span>
            </div>
            <span className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Hours</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white text-black px-4 py-2 rounded-lg min-w-[60px] text-center">
              <span className="text-2xl font-bold">--</span>
            </div>
            <span className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Mins</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white text-black px-4 py-2 rounded-lg min-w-[60px] text-center">
              <span className="text-2xl font-bold">--</span>
            </div>
            <span className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Secs</span>
          </div>
        </div>
      </div>
    }>
      <CountdownTimer />
    </Suspense>
  );
}
