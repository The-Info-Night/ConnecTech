"use client";
import React, { useState } from 'react';
import { supabase } from '../../../supabaseClient';

const GITHUB_LOGO = (
  <svg
    aria-hidden="true"
    height="22"
    viewBox="0 0 16 16"
    width="22"
    className="inline-block align-middle mr-2"
    fill="currentColor"
  >
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
      0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52
      -.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2
      -3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64
      -.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08
      2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01
      1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
  </svg>
);

const Signup: React.FC<{ switchToLogin: () => void }> = ({ switchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { pseudo }
        }
      });
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      setSuccess("Account created! Check your email for confirmation.");
    } catch (err: any) {
      setError("An unexpected error occurred while creating the account.");
    }
    setLoading(false);
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'github' });
      if (error) setError(error.message);
    } catch (err: any) {
      setError("An unexpected error occurred while signing up with GitHub.");
    }
    setLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSignup} className="space-y-4">
        <h2 className="text-2xl font-extrabold mb-6 text-center text-[#CB90F1]">Create an account</h2>
        <input
          type="text"
          placeholder="Pseudo"
          value={pseudo}
          onChange={e => setPseudo(e.target.value)}
          required
          disabled={loading}
          className="w-full px-4 py-2 border border-[#EED5FB] bg-[#EED5FB] text-[#7A3192] rounded-md focus:outline-none focus:ring-2 focus:ring-[#CB90F1] font-medium"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading}
          className="w-full px-4 py-2 border border-[#EED5FB] bg-[#EED5FB] text-[#7A3192] rounded-md focus:outline-none focus:ring-2 focus:ring-[#CB90F1] font-medium"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={loading}
          className="w-full px-4 py-2 border border-[#EED5FB] bg-[#EED5FB] text-[#7A3192] rounded-md focus:outline-none focus:ring-2 focus:ring-[#CB90F1] font-medium"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md font-bold transition
            ${loading
              ? 'bg-[#EED5FB] text-[#CB90F1] opacity-50'
              : 'bg-[#CB90F1] hover:bg-[#F18585] text-white shadow-lg'}
          `}
        >
          {loading ? 'Creating...' : 'Create account'}
        </button>
      </form>

      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-[#EED5FB]"></div>
        <span className="mx-2 text-[#CB90F1] text-xs">or</span>
        <div className="flex-grow border-t border-[#EED5FB]"></div>
      </div>

      <button
        type="button"
        onClick={handleGithubLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-md font-bold transition
          bg-[#EED5FB] border border-[#CB90F1] text-[#7A3192] hover:bg-[#F18585] hover:text-white shadow-sm mt-4"
        style={{ fontFamily: "'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace" }}
      >
        {GITHUB_LOGO}
        <span style={{ fontFamily: "inherit", fontWeight: 600, letterSpacing: 0.5 }}>GitHub</span>
      </button>

      {error && <span className="block mt-2 text-[#F18585] text-sm">{error}</span>}
      {success && <span className="block mt-2 text-green-500 text-sm">{success}</span>}

      <div className="mt-4 text-center text-[#ca93ed]">
        <span>
          Already have an account?{' '}
          <button
            type="button"
            className="text-[#CB90F1] hover:text-[#F18585] font-bold underline transition"
            onClick={switchToLogin}
            disabled={loading}
          >
            Login
          </button>
        </span>
      </div>
    </>
  );
};

export default Signup;
