// app/login/page.tsx
"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { user, error, setError, login } = useAuth();
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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Clear previous errors

        try {
        await login(email, password); // Use login function from useAuth
        } catch (err) {
        console.error('Login error:', err);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
          <form className="bg-white p-6 rounded shadow-md w-80" onSubmit={handleLogin}>
            <h2 className="text-lg mb-4">Login</h2>
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
            <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">Login</button>
            <p className="mt-4 text-center">
                Don't have an account? 
                <Link href="/registration" className="text-blue-600 hover:underline">
                  Register here
                </Link>
            </p>
          </form>
        </div>
    );
  };
  
  export default Login;
  