import { Route, Routes } from "react-router-dom";
import { PrivateRoute } from "./private-route";
import { DashboardPage } from "@/core";
import { LoginPage } from "@/auth";

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<DashboardPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};
