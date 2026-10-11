import React, { useState } from 'react';
import { X, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { JollyRogerIcon } from './Icons.tsx';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, pass: string) => Promise<void>;
  onSignup: (name: string, email: string, pass: string) => Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onSignup,
}) => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignup) {
        if (!name.trim()) throw new Error('Captain name is required');
        await onSignup(name.trim(), email.trim(), password);
      } else {
        await onLogin(email.trim(), password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCaptain = async () => {
    setError('');
    setLoading(true);
    try {
      await onLogin('captain@mugiwara.com', 'pirateking123');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to board as demo captain');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-6 bg-[#0d1424] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#172238] flex items-center justify-center border border-amber-500/30">
              <JollyRogerIcon size={26} />
            </div>
            <div>
              <h3 className="font-extrabold text-base">
                {isSignup ? 'Enlist in Mugiwara Fleet' : 'Welcome Back, Captain'}
              </h3>
              <p className="text-xs text-amber-200/80">
                {isSignup ? 'Create your pirate commander account' : 'Sign in to access your AI crew & data'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isSignup && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Captain Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Monkey D. Luffy"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-amber-500 focus:outline-hidden"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="captain@mugiwara.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-amber-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Secret Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-amber-500 focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSignup ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            {isSignup ? 'Register New Captain' : 'Sign In'}
          </button>

          {/* Quick Demo Captain Button */}
          <button
            type="button"
            onClick={handleDemoCaptain}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
          >
            Sign in as Demo Captain (Luffy)
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
              }}
              className="text-xs font-semibold text-amber-700 hover:underline"
            >
              {isSignup
                ? 'Already have an account? Sign In'
                : "Don't have an account? Enlist now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
