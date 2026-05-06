import { Route, Routes } from "react-router-dom";
import { PrivateLayout } from "./private-layout";
import { PrivateRoute } from "./private-route";
import { DashboardPage } from "@/core";
import { UsersPage } from "@/users";
import { BeneficiariesPage } from "@/beneficiaries";
import { LoginPage } from "@/auth";

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route element={<PrivateLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/beneficiaries" element={<BeneficiariesPage />} />
        </Route>
      </Route>

      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};