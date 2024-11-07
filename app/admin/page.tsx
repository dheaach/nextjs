// app/admin/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

const AdminDashboard = () => {
    const { user } = useAuth(); // Get user from useAuth
    const router = useRouter();
  
    useEffect(() => {
      if (!user) {
        router.push('/login'); 
      }
    }, [user, router]);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">
          <h2 className="text-xl mb-4">Welcome to the Admin Dashboard!</h2>
          <p>This is where you can manage your application.</p>
          {/* Add more content or components here */}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
