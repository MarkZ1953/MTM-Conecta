import { Route, Routes } from "react-router-dom";
import { PrivateLayout } from "./private-layout";
import { PrivateRoute } from "./private-route";
import { DashboardPage, HomePage } from "@/core";
import { UsersPage } from "@/users";
import { LoginPage, RegisterPage } from "@/auth";

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Private routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<PrivateLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
