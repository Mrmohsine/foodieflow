import React from "react";
import { Routes, Route, redirect, useNavigate,Navigate } from "react-router-dom";
import AuthApp from "./components/auth/AuthApp";
import Nav from "./components/nav/Nav";
import Error from "./components/error/Error";
import Menu from "./components/menu/Menu";
import Owner from "./components/owner/Owner";
// import { useUser } from "./User_crud/users_crud";
import { useUser } from "./components/context/user";
import { auth } from "./firebase/firebase-auth";
import { useAuthState } from "react-firebase-hooks/auth";
import ProtectedRoute from "./components/pages/ProtectedRoute";
import LoadingScreen from "./components/pages/LoadingScreen";
import RouteTransitionWrapper from "./components/pages/RouteTransitionWrapper";
import Users_created from './components/Owner_dash_items/Users_created';
import Products_created from "./components/Owner_dash_items/Products_created";
import CreateUsers from './components/form/CreateUsers';
import KithenDash from "./components/kitchen/KithenDash";
import ReceptionDash from "./components/reception/ReceptionDash";

export default function App() {
  // const [firebaseUser, loadingAuth] = useAuthState(auth);

  // const user = useUser(firebaseUser?.uid);
  // const isInitialLoading = loadingAuth || (firebaseUser && !user);


  const {user , loadingAuth} = useUser();
  if (loadingAuth) return <LoadingScreen />;
  if (!user) return <AuthApp />;


  // const [firebaseUser, loadingAuth] = useAuthState(auth);
  // const { user: user, loading: loadingUser } = useUser(firebaseUser?.uid);

  // const isInitialLoading = loadingAuth || loadingUser;

  // if (isInitialLoading) return <LoadingScreen />;

  return (
    <>
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
              ) :
               user?.role === "kitchen" ? (
                <Navigate to="/kitchen" />
              ) 
              :
              user?.role === "reception" ? (
                <Navigate to="/reception" />
              ) :
              (
                <Error />
              )}                
              </ProtectedRoute>
            }
          />
          {/* {console.log(user?.role)} */}
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
  )
}