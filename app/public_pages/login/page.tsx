"use client";
import React, { useState } from 'react';
import Login from './login';
import Signup from './signup';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const router = useRouter();

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4 relative"
      style={{
        background: "linear-gradient(120deg, #F18585 0%, #F8CACF 30%, #EED5FB 55%, #CB90F1 80%, #C174F2 100%)",
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        aria-label="Go back"
        className="absolute top-6 left-6 z-20 bg-[#EED5FB] hover:bg-[#F18585] text-[#CB90F1] rounded-full w-10 h-10 flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-[#CB90F1] transition"
        type="button"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 mx-2 border border-[#EED5FB]">
        {mode === 'login' ? (
          <Login switchToSignup={() => setMode('signup')} />
        ) : (
          <Signup switchToLogin={() => setMode('login')} />
        )}
      </div>
    </div>
  );
}
