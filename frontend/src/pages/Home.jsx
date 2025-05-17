import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <Navbar />
      <div className="flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-4xl font-extrabold mb-4 text-blue-800">Welcome to NeuroBridge</h1>
        <p className="text-lg text-gray-700 max-w-xl mb-6">
          Your AI-powered mental wellness assistant. 
          Chat with AI, record your thoughts, track your mental health, and stay mindful — all in one place.
        </p>
        <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition">
          Get Started
        </Link>
      </div>
    </div>
  );
}