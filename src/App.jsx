import React from "react";
import { Routes, Route, redirect, useNavigate,Navigate } from "react-router-dom";
import AuthApp from "./components/auth/AuthApp";
import Nav from "./components/nav/Nav";
import Error from "./components/error/Error";
import Menu from "./components/menu/Menu";
import Owner from "./components/owner/Owner";
import { useUser } from "./User_crud/users_crud";
import { auth } from "./firebase/firebase-auth";
import { useAuthState } from "react-firebase-hooks/auth";
import ProtectedRoute from "./components/pages/ProtectedRoute";
import LoadingScreen from "./components/pages/LoadingScreen";
import RouteTransitionWrapper from "./components/pages/RouteTransitionWrapper";
import Users_created from './components/Owner_dash_items/Users_created';
import Products_created from "./components/Owner_dash_items/Products_created";
import Form from './components/form/Form';




export default function App() {
  const [firebaseUser, loadingAuth] = useAuthState(auth);
  const firestoreUser = useUser(firebaseUser?.uid);

  const isInitialLoading = loadingAuth || (firebaseUser && !firestoreUser);

  if (isInitialLoading) return <LoadingScreen />;

  return (
    <>
    <p>hi you are {firestoreUser?.role}</p>
      <Nav />

      <RouteTransitionWrapper>
        <Routes>
          <Route path="/login" element={<AuthApp />} />
          <Route path="/signup" element={<AuthApp />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
              {firestoreUser?.role === "admin" ? (
                <Navigate to="./owner/menu" />
              ) : firestoreUser?.role === "client" ? (
                <Navigate to="./menu" />
              ) : (
                <Error />
              )}                
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner"
            element={
              <ProtectedRoute>
                {firestoreUser?.role === "admin" ? <Owner /> : <Error />}
              </ProtectedRoute>
            }
          >
            <Route path="users" element={<Users_created />} />
            <Route path="menu" element={<Products_created />} />
            <Route path="form" element={<Form />} />
          </Route>

          <Route path="/menu" element={<Menu />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </RouteTransitionWrapper>
    </>
  )
}