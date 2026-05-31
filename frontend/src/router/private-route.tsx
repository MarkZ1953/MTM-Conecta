import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext, canAccessAdminPanel } from "@/auth";

export const PrivateRoute = () => {
  const { logged, refresh, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      await refresh();
      setLoading(false);
    };

    verify();
  }, []);

  if (!loading) {
    if (!logged) return <Navigate to="/login" />;
    if (!canAccessAdminPanel(user)) return <Navigate to="/home" />;

    return <Outlet />;
  }
};
