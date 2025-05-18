import { Navigate } from "react-router-dom";
import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";

const PrivateRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
  const context  = useContext(AuthContext);
  return !context.isAuthenticated ? <Navigate to="/login" /> : children;
};

export default PrivateRoute;
