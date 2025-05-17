import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="font-bold">NeuroBridge</h1>
      <div>
        <Link to="/" className="mr-4">Home</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}
