import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthApp from "./components/auth/AuthApp";
import Nav from "./components/nav/Nav";
import Error from "./components/error/Error";
import Menu from "./components/menu/Menu";
import Owner from "./components/owner/Owner";
import { useUser } from "./components/context/user";
import { useAuthState } from "react-firebase-hooks/auth";
import ProtectedRoute from "./components/pages/ProtectedRoute";
import LoadingScreen from "./components/pages/LoadingScreen";
import RouteTransitionWrapper from "./components/pages/RouteTransitionWrapper";
import Users_created from './components/Owner_dash_items/Users_created';
import Products_created from "./components/Owner_dash_items/Products_created";
import CreateUsers from './components/form/CreateUsers';
import KithenDash from "./components/kitchen/KithenDash";
import ReceptionDash from "./components/reception/ReceptionDash";
// 1️⃣ Import the Toaster
import { Toaster } from 'react-hot-toast';

export default function App() {
  const { user, loadingAuth } = useUser();
  if (loadingAuth) return <LoadingScreen />;
  if (!user) return <AuthApp />;

  return (
    <>
      {/* 2️⃣ Add the Toaster (you can customize position, duration, etc.) */}
      <Toaster 
        position="top-right"
        toastOptions={{
          // default options
          duration: 4000,
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
         }
       }}
     />

      <p>hi you are {user?.role}</p>
      <Nav />

      <RouteTransitionWrapper>
        <Routes>
          <Route path="/login" element={<AuthApp />} />
          <Route path="/signup" element={<AuthApp />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                {user?.role === "admin" ? (
                  <Navigate to="/owner/menu" />
                ) : user?.role === "client" ? (
                  <Navigate to="/menu" />
                ) : user?.role === "kitchen" ? (
                  <Navigate to="/kitchen" />
                ) : user?.role === "reception" ? (
                  <Navigate to="/reception" />
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
                {user?.role === "admin" ? <Owner /> : <Error />}
              </ProtectedRoute>
            }
          >
            <Route path="users" element={<Users_created />} />
            <Route path="menu" element={<Products_created />} />
            <Route path="form" element={<CreateUsers />} />
          </Route>

          <Route path="/menu" element={<Menu />} />
          <Route path="/kitchen" element={<KithenDash />} />
          <Route path="/reception" element={<ReceptionDash />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </RouteTransitionWrapper>
    </>
  );
}
