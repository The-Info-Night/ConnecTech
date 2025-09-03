"use client";
import React, { useState, useEffect } from 'react';
import Login from './login';
import Signup from './signup';
import { useRouter } from 'next/navigation';
import { fetchUsers, User } from '../../services/userServices';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);

  useEffect(() => {
    const getUsers = async () => {
      setLoadingUsers(true);
      setErrorUsers(null);
      try {
        // Call fetchUsers from userServices to get the user list
        const response = await fetchUsers();
        if (response && Array.isArray(response)) {
          setUsers(response);
        } else {
          throw new Error("Format de réponse inattendu lors du chargement des utilisateurs");
        }
      } catch (err: any) {
        let errorMessage = 'Erreur lors du chargement des utilisateurs';
        if (err instanceof Error) {
          errorMessage += ` : ${err.message}`;
        }
        setErrorUsers(errorMessage);
      }
      setLoadingUsers(false);
    };
    getUsers();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-black p-4 relative">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        aria-label="Go back"
        className="absolute top-6 left-6 z-20 bg-black hover:bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 mx-2">
        {mode === 'login' ? (
          <Login switchToSignup={() => setMode('signup')} />
        ) : (
          <Signup switchToLogin={() => setMode('login')} />
        )}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Liste des utilisateurs :</h2>
          {loadingUsers && <div className="text-gray-500">Chargement...</div>}
          {errorUsers && <div className="text-red-500">{errorUsers}</div>}
          {!loadingUsers && !errorUsers && (
            <ul className="space-y-1">
              {users.map((user) => (
                <li key={user.id} className="text-gray-700 dark:text-gray-200">
                  {user.name ? `${user.name} (${user.email})` : user.email}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
