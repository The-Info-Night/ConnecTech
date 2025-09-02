"use client";
import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useRouter } from "next/navigation";

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

const BackButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Go back"
    className="absolute top-6 left-6 z-20 bg-black rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-800 transition"
    style={{ outline: "none", border: "none" }}
  >
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  </button>
);

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [success, setSuccess] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setSuccess("Account created ! Check your email to confirm.");
    } catch (err: any) {
      setError("An unexpected error occurred while creating the account.");
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setSuccess('Login successful !');
      router.push("/");
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error: dbError } = await supabase
          .from('users')
          .insert([{ id: user.id, email: user.email }]);
        if (dbError) {
          setError("Login successful, but an error occurred while registering in the database: " + dbError.message);
          setLoading(false);
          return;
        }
        setSuccess("User profile registered !");
      }
    } catch (err: any) {
      setError("An unexpected error occurred while logging in.");
    }
    setLoading(false);
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
      });
      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError("An unexpected error occurred while logging in with GitHub.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-black relative">
      <BackButton onClick={() => router.back()} />
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 mx-2 relative">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-900 dark:text-blue-400">
          {mode === 'login' ? 'Login to Connectech' : 'Create an account'}
        </h2>
        <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md font-bold transition ${
              loading
                ? 'bg-gray-400 text-gray-100'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading
              ? mode === 'login'
                ? 'Login...'
                : 'Creation...'
              : mode === 'login'
                ? 'Login'
                : 'Create account'}
          </button>
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            <span className="mx-2 text-gray-400 text-xs">or</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          </div>
          <button
            type="button"
            onClick={handleGithubLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-md font-bold transition bg-black hover:bg-gray-900 text-white border border-black"
            style={{ fontFamily: "'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace" }}
          >
            {GITHUB_LOGO}
            <span style={{ fontFamily: "inherit", fontWeight: 600, letterSpacing: 0.5 }}>GitHub</span>
          </button>
          {error && <span className="block mt-2 text-red-600 text-sm">{error}</span>}
          {success && <span className="block mt-2 text-green-500 text-sm">{success}</span>}
        </form>
        <div className="mt-4 text-center">
          {mode === 'login' ? (
            <span>
              No account ?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(null); setSuccess(null); }}
                disabled={loading}
                className="text-blue-600 hover:underline font-medium"
              >
                Create an account
              </button>
            </span>
          ) : (
            <span>
              Already have an account ?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
                disabled={loading}
                className="text-blue-600 hover:underline font-medium"
              >
                Login
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
