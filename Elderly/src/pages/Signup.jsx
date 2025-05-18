import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/ui/navbar';

export default function SignupLogin() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    setError('');

    if (!email || !password || (!isLoginMode && !confirmPassword)) {
      setError('Please fill in all fields');
      return;
    }

    if (!isLoginMode && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // ✅ Set authentication flags in localStorage
    localStorage.setItem('token', 'dummy_token');
    localStorage.setItem('isAuthenticated', 'true'); // ✅ Add this line

    console.log(`${isLoginMode ? 'Login' : 'Signup'} success with:`, email);

    // ✅ Navigate to authenticated route
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-center pt-10">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
            {isLoginMode ? 'Login' : 'Create Account'}
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {!isLoginMode && (
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            {isLoginMode ? 'Login' : 'Sign Up'}
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              {isLoginMode ? "Don't have an account?" : 'Already have an account?'}
              <span
                className="text-blue-600 ml-1 cursor-pointer hover:underline"
                onClick={() => setIsLoginMode(!isLoginMode)}
              >
                {isLoginMode ? 'Sign Up' : 'Login'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
