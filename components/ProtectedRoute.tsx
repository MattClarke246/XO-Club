import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        checkAdminRole(session);
      } else {
        setAuthenticated(false);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setAuthenticated(true);
        await checkAdminRole(session);
      } else {
        setAuthenticated(false);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const checkAdminRole = async (session: any) => {
    try {
      // Check if user has admin role in metadata
      const userMetadata = session.user.user_metadata;
      if (userMetadata?.role === 'admin' || userMetadata?.is_admin === true) {
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      // Check in admin_users table
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (data && !error) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Admin check error:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-bold tracking-[0.2em] uppercase text-xs">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">Access Denied</h1>
          <p className="text-gray-500 mb-8">You do not have permission to access this area.</p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = '/#/';
            }}
            className="bg-white text-black px-8 py-4 rounded-2xl font-black text-xs tracking-[0.3em] uppercase hover:bg-blue-500 hover:text-white transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
