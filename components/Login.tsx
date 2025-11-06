import React, { useState } from 'react';
import { LogoIcon } from './icons';

interface LoginProps {
  onLogin: (firstName: string) => Promise<boolean>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [firstName, setFirstName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await onLogin(firstName);
    if (!success) {
      setError('Employee not found. Please check your first name.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-sky-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-transparent rounded-xl p-8">
          <div className="flex flex-col items-center mb-6">
            <LogoIcon className="h-12 w-12 text-sky-600 mb-3" />
            <h1 className="text-2xl font-bold text-slate-800">Cavinte Work Log</h1>
            <p className="text-slate-500 mt-1">Sign in to record your work</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-600 mb-2">
                Employee First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow bg-white text-slate-900 placeholder:text-slate-400"
                placeholder="e.g., Alice"
                required
                autoCapitalize="words"
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Login'}
            </button>
          </form>
        </div>
        <p className="text-center text-slate-500 text-sm mt-6">
          Enter your first name to log in.
        </p>
      </div>
    </div>
  );
};

export default Login;