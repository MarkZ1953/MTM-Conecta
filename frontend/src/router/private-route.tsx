import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "@/auth";

export const PrivateRoute = () => {
  const { logged, refresh } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      await refresh();
      setLoading(false);
    };

    verify();
  }, []);

  if (!loading) {
    return logged ? <Outlet /> : <Navigate to="/login" />;
  }
};
