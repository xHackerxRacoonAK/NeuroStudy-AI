import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Mail, Lock, ArrowRight, ArrowLeft, User, Eye, EyeOff } from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
  onLoginSuccess: (email: string) => void;
  onBack: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login', onLoginSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Update internal state if initialMode prop changes (e.g. clicking different buttons in header)
  useEffect(() => {
    setIsLogin(initialMode === 'login');
  }, [initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const users = JSON.parse(localStorage.getItem('neurostudy_users') || '{}');

      if (isLogin) {
        // Login Logic
        if (users[email] && users[email].password === password) {
          onLoginSuccess(email);
        } else {
          setError("Invalid email or password.");
        }
      } else {
        // Sign Up Logic
        if (users[email]) {
          setError("User already exists. Please login.");
        } else if (password.length < 6) {
            setError("Password must be at least 6 characters.");
        } else {
          users[email] = { password, createdAt: new Date().toISOString() };
          localStorage.setItem('neurostudy_users', JSON.stringify(users));
          onLoginSuccess(email);
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in-up">
      <div className="mb-6">
         <button 
           onClick={onBack}
           className="text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors"
         >
           <ArrowLeft className="w-4 h-4" /> Back to Home
         </button>
      </div>

      <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

        <div className="relative z-10 text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4">
            {isLogin ? <Lock className="w-8 h-8 text-white" /> : <User className="w-8 h-8 text-white" />}
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-gray-400">
            {isLogin ? 'Sign in to sync your progress' : 'Start your learning journey today'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="space-y-2 text-left">
            <label htmlFor="email" className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500 text-white transition-all outline-none"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2 text-left">
            <label htmlFor="password" className="text-sm font-medium text-gray-300 ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-12 pr-12 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500 text-white transition-all outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 animate-fade-in-up">
              {error}
            </div>
          )}

          <Button type="submit" isLoading={isLoading} className="w-full mt-4">
            <span className="flex items-center gap-2">
              {isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight className="w-4 h-4" />
            </span>
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); setPassword(''); }}
              className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};