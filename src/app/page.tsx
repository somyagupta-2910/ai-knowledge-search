'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import SearchInterface from '@/components/SearchInterface';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';

export default function Home() {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center purple-gradient">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen purple-gradient flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">AI Knowledge Search</h1>
            <p className="text-purple-100">Upload documents and search them with AI</p>
          </div>
          
          {showLogin ? (
            <LoginForm 
              onSwitchToRegister={() => {
                setShowLogin(false);
                setShowRegister(true);
              }}
            />
          ) : showRegister ? (
            <RegisterForm 
              onSwitchToLogin={() => {
                setShowRegister(false);
                setShowLogin(true);
              }}
            />
          ) : (
            <div className="card">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome</h2>
                <p className="text-gray-600 mb-6">Sign in to your account or create a new one</p>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowLogin(true)}
                    className="btn-primary w-full"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setShowRegister(true)}
                    className="btn-secondary w-full"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <SearchInterface />
      </main>
    </div>
  );
}