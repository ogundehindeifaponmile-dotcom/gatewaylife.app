// src/components/AuthModal.jsx
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';

export default function AuthModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-1">Gateway Life</h2>
          <p className="text-white/60 text-sm">Enter Ogun State. Choose Your Fate.</p>
        </div>

        {/* Supabase Auth Component */}
        <Auth 
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#FACC15', // Yellow-400 for Ogun branding
                  brandAccent: '#EAB308',
                  inputBackground: '#1F2937',
                  inputText: '#FFFFFF',
                  inputBorder: '#374151',
                  messageText: '#EF4444',
                },
                radii: {
                  borderRadiusButton: '0.75rem',
                  buttonBorderRadius: '0.75rem',
                  inputBorderRadius: '0.75rem',
                }
              }
            }
          }}
          providers={[]} // Disable OAuth for now, keep it email/password only
          redirectTo={window.location.origin}
          view="sign_in" // Start with sign in, allow toggle to sign up
        />

        {/* Footer Note */}
        <p className="text-center text-white/40 text-xs mt-4">
          By entering, you accept the hustle. No refunds on NEPA bills.
        </p>
      </div>
    </div>
  );
}
