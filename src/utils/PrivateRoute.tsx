import { Navigate } from "react-router-dom";
import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";

const PrivateRoute: React.FC<React.PropsWithChildren> = ({ children, ...rest }) => {
  const { user }  = useContext(AuthContext);
  return !user ? <Navigate to="/login" /> : children;
};

export default PrivateRoute;
