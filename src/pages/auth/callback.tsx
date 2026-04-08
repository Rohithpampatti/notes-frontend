import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      // Get the session after OAuth redirect
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Callback error:', error);
        navigate('/login');
        return;
      }
      
      if (session) {
        // Successfully logged in
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
      <div className="text-white">Completing sign in...</div>
    </div>
  );
};

export default AuthCallback;