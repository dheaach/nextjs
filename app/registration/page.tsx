"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

const Registration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, error, setError, register } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false); 

  useEffect(() => {
    setMounted(true); 
  }, []);

  useEffect(() => {
    if (mounted && user) {
      router.push('/admin');
    }
  }, [user, router, mounted]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); 

    try {
      await register(email, password); 
      router.push('/login'); 
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form className="bg-white p-6 rounded shadow-md w-80" onSubmit={handleRegister}>
        <h2 className="text-lg mb-4">Register</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded p-2 mb-4 w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded p-2 mb-4 w-full"
          required
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">Register</button>
      </form>
    </div>
  );
};

export default Registration;
