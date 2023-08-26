import React, { useContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { Loading } from "./components/Loading";

import Index from "./pages/Index";
import Sign from "./pages/Sign";

const AppRoutes = () => {
  const Private = ({ children }) => {
    const { authenticated, loading } = useContext(AuthContext);

    if (loading) {
      return <Loading />;
    }

    if (!authenticated) {
      return <Navigate to="/sign" />;
    }

    return children;
  };

  const Public = ({ children }) => {
    const { authenticated, loading } = useContext(AuthContext);

    if (loading) {
      return <Loading />;
    }

    if (authenticated) {
      return <Navigate to="/" />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="*"
            element={
              <Public>
                <Sign />
              </Public>
            }
          />
          <Route
            path="/sign"
            element={
              <Public>
                <Sign />
              </Public>
            }
          />
          <Route
            path="/"
            element={
              <Private>
                <Index />
              </Private>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
