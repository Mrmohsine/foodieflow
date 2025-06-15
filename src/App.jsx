import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { useUser } from "./components/context/user";
import LoadingScreen from "./components/pages/LoadingScreen";
import RouteTransitionWrapper from "./components/pages/RouteTransitionWrapper";
import ProtectedRoute from "./components/pages/ProtectedRoute";
import Error from "./components/error/Error";
import {UseProductsOrderedForClientProvider} from "./components/context/ProductsOrderedForClient";

// Lazy loaded components
const AuthApp = lazy(() => import("./components/auth/AuthApp"));
const Nav = lazy(() => import("./components/nav/Nav"));
const Menu = lazy(() => import("./components/menu/Menu"));
const Owner = lazy(() => import("./components/owner/Owner"));
const KithenDash = lazy(() => import("./components/kitchen/KithenDash"));
const ReceptionDash = lazy(() => import("./components/reception/ReceptionDash"));
const Valid = lazy(() => import("./components/reception/Valid"));
const Payed = lazy(() => import("./components/reception/Payed"));
const Users_created = lazy(() => import('./components/Owner_dash_items/Users_created'));
const Products_created = lazy(() => import("./components/Owner_dash_items/Products_created"));
const CreateUsers = lazy(() => import('./components/form/CreateUsers'));
const Analyse = lazy(() => import("./components/Owner_dash_items/Analyse"));

// Toast configuration
const toastConfig = {
  position: "top-right",
  toastOptions: {
    duration: 4000,
    style: {
      borderRadius: '8px',
      background: '#333',
      color: '#fff',
    },
    error: {
      style: {
        border: '1px solid #F56565',
        color: '#C53030',
      },
      iconTheme: {
        primary: '#C53030',
        secondary: '#FFF',
      },
    },
  },
};

// Role-based navigation helper
const getRoleBasedRedirect = (role) => {
  switch (role) {
    case "admin":
      return "/owner/menu";
    case "client":
      return "/menu";
    case "kitchen":
      return "/kitchen";
    case "reception":
      return "/reception";
    default:
      return "/error";
  }
};

export default function App() {
  const { user, loadingAuth } = useUser();

  if (loadingAuth) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthApp />;
  }

  return (
    <>
      <Toaster {...toastConfig} />
      <p>hi you are {user.role}</p>
      <Nav />

      <RouteTransitionWrapper>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<AuthApp />} />
            <Route path="/signup" element={<AuthApp />} />

            {/* Root Redirect */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigate to={getRoleBasedRedirect(user.role)} replace />
                </ProtectedRoute>
              }
            />

            {/* Owner Routes */}
            <Route
              path="/owner"
              element={
                <ProtectedRoute>
                  {user.role === "admin" ? <Owner /> : <Error />}
                </ProtectedRoute>
              }
            >
              <Route path="users" element={<Users_created />} />
              <Route path="menu" element={<Products_created />} />
              <Route path="form" element={<CreateUsers />} />
              <Route path="analyse" element={<Analyse />} />
            </Route>

            {/* Menu Route */}
            <Route path="/menu" element={<Menu />} />

            {/* Kitchen Route */}
            <Route 
              path="/kitchen" 
              element={
                <ProtectedRoute>
                  {user.role === "kitchen" ? <KithenDash /> : <Error />}
                </ProtectedRoute>
              } 
            />

            {/* Reception Routes */}
            <Route
              path="/reception"
              element={
                <ProtectedRoute>
                  {user.role === "reception" ? <ReceptionDash /> : <Error />}
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="valid" replace />} />
              <Route
                path="valid"
                element={
                  <UseProductsOrderedForClientProvider
                    payed={false}
                    valid={true}
                  >
                    <Valid />
                  </UseProductsOrderedForClientProvider>
                }
              />
              <Route
                path="payed"
                element={
                  <UseProductsOrderedForClientProvider
                    payed={true}
                    valid={true}
                  >
                    <Payed />
                  </UseProductsOrderedForClientProvider>
                }
              />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Error />} />
          </Routes>
        </Suspense>
      </RouteTransitionWrapper>
    </>
  );
}
