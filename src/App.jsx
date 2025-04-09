import React from "react";
import { Routes, Route } from "react-router-dom"; // Use react-router-dom for web routing
import AuthApp from "./components/auth/AuthApp";
import Nav from "./components/nav/Nav";
import Error from "./components/error/Error";
import Menu from "./components/menu/Menu";
import { useUser } from "./components/context/users"; // Custom hook to get one user by uid
import { auth } from "./firebase/firebase-auth";
import { useAuthState } from "react-firebase-hooks/auth";

function App() {
  // Get the authenticated Firebase user (if any)
  const [firebaseUser] = useAuthState(auth);
  
  // If a user is authenticated, fetch additional data from Firestore
  const firestoreUser = firebaseUser ? useUser(firebaseUser.uid) : null;

  return (
    <>
      {/* Optionally display a simple welcome message */}
      <p>
        Hi {firestoreUser?.fullName} — your role is {firestoreUser?.role}
      </p>
      
      {/* Navigation bar */}
      <Nav />

      {/* Define application routes */}
      <Routes>
        <Route path="/" element={<Menu />} />
        {/* Only allow access to /login if the Firestore user has role "admin" */}
        <Route
          path="/path_to_check"
          element={
            firestoreUser && firestoreUser.role === "admin" ? (
              <AuthApp />
            ) : (
              <Error />
            )
          }
        />
        {/* Sign-up route */}
        <Route path="/login" element={<AuthApp />} />
        <Route path="/signup" element={<AuthApp />} />
        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}

export default App;