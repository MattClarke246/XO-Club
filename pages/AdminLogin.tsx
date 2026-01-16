import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, Mail, AlertCircle } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    // Check if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate(from, { replace: true });
      }
    });
  }, [navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        // Verify admin role
        const userMetadata = data.session.user.user_metadata;
        if (userMetadata?.role === 'admin' || userMetadata?.is_admin === true) {
          navigate(from, { replace: true });
        } else {
          // Check admin_users table
          const { data: adminData } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', email)
            .single();

          if (adminData) {
            navigate(from, { replace: true });
          } else {
            await supabase.auth.signOut();
            setError('Access denied. Admin privileges required.');
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4 uppercase tracking-tighter">
            XO CLUB<span className="text-blue-500">.</span>
          </h1>
          <p className="text-gray-500 font-bold tracking-[0.2em] uppercase text-xs">Admin Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4 flex items-center gap-3">
              <AlertCircle size={20} className="text-red-500" />
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3">
              Email Address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ADMIN@XOCLUB.COM"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 focus:border-blue-500 outline-none transition-all text-sm font-black uppercase tracking-widest placeholder:text-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 focus:border-blue-500 outline-none transition-all text-sm font-black uppercase tracking-widest placeholder:text-gray-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black px-12 py-6 rounded-2xl font-black text-xs tracking-[0.3em] uppercase hover:bg-blue-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
