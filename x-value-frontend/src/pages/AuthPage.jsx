import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { signup, login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Get URL parameters
  const params = new URLSearchParams(window.location.search);
  const returnUrl = params.get('returnUrl');
  const action = params.get('action');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      if (isSignup) {
        await signup(name, email, password);
      } else {
        await login(email, password);
      }
      navigate(returnUrl || '/');
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-text text-center">{isSignup ? 'Create your account' : 'Welcome back'}</h2>
      
      {action === 'bookmark' && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">
            {isSignup 
              ? 'Create an account to start bookmarking cars and access them from anywhere!' 
              : 'Log in to save this car to your bookmarks and view it later!'}
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignup && (
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" autoComplete="name" className="w-full border border-gray-300 bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition" />
        )}
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" autoComplete="email" className="w-full border border-gray-300 bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" autoComplete="current-password" className="w-full border border-gray-300 bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition" />
        {error && <div className="text-red-500">{error}</div>}

        <div className="flex flex-col gap-3">
          <button disabled={loading} type="submit" className="w-full bg-primary text-white py-3 rounded-lg hover:bg-secondary transition transform hover:-translate-y-0.5">
            {loading ? 'Please wait...' : isSignup ? 'Create account' : 'Log in'}
          </button>
          <button type="button" onClick={() => setIsSignup(!isSignup)} className="w-full border border-gray-200 text-text py-3 rounded-lg hover:shadow-sm transition">{isSignup ? 'Have an account? Log in' : "Don't have an account? Sign up"}</button>
        </div>
      </form>
    </div>
  );
};

export default AuthPage;
