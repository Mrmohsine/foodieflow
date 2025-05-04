import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthApp from "./components/auth/AuthApp";
import Nav from "./components/nav/Nav";
import Error from "./components/error/Error";
import Menu from "./components/menu/Menu";
import Owner from "./components/owner/Owner";
import { useUser } from "./components/context/user";
import ProtectedRoute from "./components/pages/ProtectedRoute";
import LoadingScreen from "./components/pages/LoadingScreen";
import RouteTransitionWrapper from "./components/pages/RouteTransitionWrapper";
import Users_created from './components/Owner_dash_items/Users_created';
import Products_created from "./components/Owner_dash_items/Products_created";
import CreateUsers from './components/form/CreateUsers';
import KithenDash from "./components/kitchen/KithenDash";
import ReceptionDash from "./components/reception/ReceptionDash";
import { Toaster } from 'react-hot-toast';
import Valid from "./components/reception/Valid";
import Payed from "./components/reception/Payed";
import {UseProductsOrderedForClientProvider} from "./components/context/ProductsOrderedForClient";
import Analyse from "./components/Owner_dash_items/Analyse";
export default function App() {
  const { user, loadingAuth } = useUser();

  return (
    <>
      {/* 1️⃣ Always mounted */}
      <Toaster
        position="top-right"
        toastOptions={{
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
        }}
      />

      {/* 2️⃣ Then gate the rest */}
      {loadingAuth ? (
        <LoadingScreen />
      ) : !user ? (
        <AuthApp />
      ) : (
        <>
          <p>hi you are {user.role}</p>
          <Nav />

          <RouteTransitionWrapper>
            <Routes>
              <Route path="/login" element={<AuthApp />} />
              <Route path="/signup" element={<AuthApp />} />

              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    {user.role === "admin" ? (
                      <Navigate to="/owner/menu" />
                    ) : user.role === "client" ? (
                      <Navigate to="/menu" />
                    ) : user.role === "kitchen" ? (
                      <Navigate to="/kitchen" />
                    ) : user.role === "reception" ? (
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
                    {user.role === "admin" ? <Owner /> : <Error />}
                  </ProtectedRoute>
                }
              >
                <Route path="users" element={<Users_created />} />
                <Route path="menu" element={<Products_created />} />
                <Route path="form" element={<CreateUsers />} />
                <Route path="analyse" element={<Analyse />} />
              </Route>

              <Route path="/menu" element={<Menu />} />
              <Route path="/kitchen" element={<KithenDash />} />
              <Route path="/reception" element={<ReceptionDash />} />
              <Route
                path="/reception"
                element={
                  <ProtectedRoute>
                    {user.role === "reception" ? <ReceptionDash /> : <Error />}
                  </ProtectedRoute>
                }
              >
                {/* redirect /reception → /reception/valid */}
                <Route index element={<Navigate to="valid" replace />} />

                {/* VALID orders (payed=false, valid=true) */}
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

                {/* PAYED orders (payed=true, valid=true) */}
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
              <Route path="*" element={<Error />} />
            </Routes>
          </RouteTransitionWrapper>
        </>
      )}
    </>
  );
}
