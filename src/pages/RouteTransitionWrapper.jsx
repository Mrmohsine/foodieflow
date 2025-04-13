// components/pages/RouteTransitionWrapper.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

export default function RouteTransitionWrapper({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 400); // duration of your loading screen

    return () => clearTimeout(timeout);
  }, [location.pathname]); // re-run on every route

  return loading ? <LoadingScreen /> : children;
}