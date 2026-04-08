import { useState } from 'react';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';

interface PrivacyPasswordModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const PrivacyPasswordModal = ({ onSuccess, onClose }: PrivacyPasswordModalProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Check password against environment variable
    const correctPassword = import.meta.env.VITE_PRIVACY_PASSWORD || 'admin123';
    
    if (password === correctPassword) {
      // Store in session storage (clears when browser closes)
      sessionStorage.setItem('privacyUnlocked', 'true');
      onSuccess();
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4">
        <div className="bg-[#1e293b] rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
          <div className="p-6 text-center border-b border-white/10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Private Notes</h2>
            <p className="text-gray-400 text-sm">
              This section is password protected. Enter the privacy password to view your private notes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Privacy Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent"
                  placeholder="Enter privacy password"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg font-medium hover:from-yellow-700 hover:to-yellow-800 transition-all transform hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Unlock Private Notes'}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              Cancel
            </button>
          </form>

          <div className="p-4 bg-white/5 border-t border-white/10 text-center">
            <p className="text-gray-500 text-xs">
              Contact your administrator if you forgot the password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};