"use client";
import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useRouter } from "next/navigation";

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [success, setSuccess] = useState<string | null>(null);

  function isInvalidApiKeyError(message: string) {
    return (
      message.toLowerCase().includes('invalid api key') ||
      message.toLowerCase().includes('invalid key') ||
      message.toLowerCase().includes('401')
    );
  }

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-black">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 mx-2">
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
