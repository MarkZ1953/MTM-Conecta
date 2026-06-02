import { AuthContext } from "@/auth";
import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export function AuthenticatedPublicRoute() {
  const { logged, refresh } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      await refresh();
      setLoading(false);
    };

    verify();
  }, []);

  if (loading) return null;
  if (!logged) return <Navigate to="/login" />;

  return <Outlet />;
}
