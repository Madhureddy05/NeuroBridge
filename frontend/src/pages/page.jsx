import React from "react";
import SignupForm from "./pages/Signup"; // Adjust the path as per your file structure

const Home = () => {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
      {/* Gradient and Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 opacity-70" />
        <div
          className="absolute inset-0 bg-[url('/grid.png')] bg-center"
          style={{ maskImage: "linear-gradient(180deg, white, rgba(255,255,255,0))" }}
        />

        {/* Animated Random Blobs */}
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/30 blur-xl"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
                animation: `floating ${Math.random() * 10 + 10}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Three Main Animated Circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      {/* Signup Form */}
      <div className="w-full max-w-md z-10">
        <SignupForm />
      </div>
    </main>
  );
};

export default Home;
