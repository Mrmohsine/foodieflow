/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { signUp, signIn, logout, auth } from "../../firebase/firebase-auth";
import { useUser } from '../context/user';
import { toast } from 'react-hot-toast';  // ← import toast

function AuthApp() {
  const location = useLocation(); 
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState({
    role: "admin",
    fullName: "",
    email: "",
    password: ""
  });
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { count, setCount } = useUser();

  // switch between /login and /signup
  useEffect(() => {
    setIsLoginMode(location.pathname === "/login");
  }, [location.pathname]);

  // listen for firebase auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleChange = e => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (isLoginMode) {
        await signIn(credentials.email, credentials.password);
      } else {
        await signUp(
          credentials.email,
          credentials.password,
          credentials.fullName,
          credentials.role
        );
      }
      setCount(count + 1);
      setCredentials({ role: "admin", fullName: "", email: "", password: "" });
    } catch (error) {
      toast.error(error.message);  // ← error toast
    }
  };

  const handlePassword = async () => {
    const authInstance = getAuth();
    if (!credentials.email) {
      toast.error("Please enter your email address.");  // ← error toast
      return;
    }
    try {
      await sendPasswordResetEmail(authInstance, credentials.email);
      toast.success(`Password reset email sent to ${credentials.email}`); // ← success toast
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast.error("Error signing out: " + error.message); // ← error toast
    }
  };

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{ marginTop: '-100px' }}
    >
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
          {isLoginMode
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="underline cursor-pointer"
          >
            {isLoginMode ? "Sign Up" : "Sign In"}
          </button>
          <br />
          {isLoginMode && (
            <button
              type="button"
              onClick={handlePassword}
              className="underline cursor-pointer"
            >
              Reset Password
            </button>
          )}
        </p>
      </div>
    </div>
  );
}

export default AuthApp;
