import { AuthContext } from "@/Context/AuthContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext); // ✅ Use context

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
