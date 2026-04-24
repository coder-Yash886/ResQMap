import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { toast } from 'react-hot-toast';
import { ShieldAlert, LogIn, UserPlus } from 'lucide-react';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Successfully logged in!');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Account created successfully!');
      }
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Successfully logged in with Google!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-base relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-accent-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#1C3A5E]/30 rounded-full blur-[120px]" />

      <div className="glass-card w-full max-w-md p-8 relative z-10 animate-fade-in border-accent-primary/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-dark-base rounded-2xl border border-dark-border mb-4">
            <ShieldAlert className="text-accent-primary" size={40} />
          </div>
          <h1 className="text-3xl font-syne font-bold text-white mb-2">ResQMap AidSync</h1>
          <p className="text-gray-400">{isLogin ? 'Tactical Command Center Login' : 'Register New Operator'}</p>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="operator@resqmap.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
              minLength={6}
            />
            {!isLogin && <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters long.</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-3 text-lg mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                {isLogin ? <><LogIn size={20} /> Access Terminal</> : <><UserPlus size={20} /> Create Account</>}
              </span>
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-accent-primary hover:text-white transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
          </button>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-dark-border"></div>
          <span className="text-xs text-gray-500 uppercase font-medium tracking-wider">Secure Access</span>
          <div className="h-px flex-1 bg-dark-border"></div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full mt-6 bg-white hover:bg-gray-100 text-gray-900 font-sans font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-3 border border-gray-200"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
