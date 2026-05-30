import { useNavigate } from "react-router-dom";
import { authReducer } from "./auth.reducer";
import { AuthContext } from "./auth-context";
import { authAPI } from "../auth.api";
import { types } from "../auth.types";
import { toast } from "@/components";
import { useEffect, useReducer } from "react";

interface AuthProviderProps {
  children: React.ReactNode;
}

const init = () => {
  const user = null;
  return { logged: !!user, user: user };
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, dispatch] = useReducer(authReducer, {}, init);
  const navigate = useNavigate();

  const refresh = async () => {
    try {
      const { status, data } = await authAPI.refresh();
      const user = data?.user ?? data;

      if (status === 401 || !data) {
        dispatch({ type: types.LOGOUT });
        return null;
      } else if (status === 200) {
        dispatch({
          type: types.REFRESH,
          payload: {
            logged: true,
            user,
          },
        });
        return user;
      }
    } catch (error) {
      dispatch({ type: types.LOGOUT });
    }

    return null;
  };

  const logout = async () => {
    try {
      const { status } = await authAPI.logout();

      if (status >= 200 && status < 300) {
        dispatch({ type: types.LOGOUT });
        toast.success("Sesión cerrada correctamente");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...authState, logout, logged: authState.logged, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
};
