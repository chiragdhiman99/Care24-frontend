import { useEffect, useState } from "react";
import { verifyUser } from "../../services/AuthService";
import { Navigate } from "react-router";

export const ProtectedRoute = ({ children, requiredRole }) => {
  const [isAuth, setIsAuth] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    verifyUser()
      .then((data) => {
        setIsAuth(true);
        setRole(data.user.role);
      })
      .catch(() => setIsAuth(false));
  }, []);

  if (isAuth === null) return <div>Loading...</div>;
  if (!isAuth) return <Navigate to="/admin/login" />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/" />;

  return children;
};

