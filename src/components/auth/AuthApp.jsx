/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom"; // Import useLocation
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { signUp, signIn, logout, auth } from "../../firebase/firebase-auth";

function AuthApp() {
  const location = useLocation(); 
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState({ role: "admin", fullName: "", email: "", password: "" });
  const [isLoginMode, setIsLoginMode] = useState(true);

  useEffect(() => {
    if (location.pathname === "/signup") {
      setIsLoginMode(false);
    } else {
      setIsLoginMode(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLoginMode) {
        await signIn(credentials.email, credentials.password);
      } else {
        await signUp(credentials.email, credentials.password, credentials.fullName,credentials.role);
      }
      setCredentials({ fullName: "", email: "", password: "" });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      alert("Error signing out: " + error.message);
    }
  };

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="h-screen bg-white- flex items-center justify-center" style={{ marginTop: '-100px' }}> 
      <div className="bg-white p-6 max-w-md w-full shadow-md rounded mx-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-orange-600">
          {isLoginMode ? "Sign In" : "Sign Up"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={credentials.fullName}
              onChange={handleChange}
              required
            />
            <input
              type="hidden"
              name="role"
              value={credentials.role}
              onChange={handleChange}
            />
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={credentials.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={credentials.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
          >
            {isLoginMode ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center text-orange-600">
          {isLoginMode ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="underline"
          >
            {isLoginMode ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthApp;