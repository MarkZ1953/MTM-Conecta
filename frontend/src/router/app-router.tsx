import { Route, Routes } from "react-router-dom";
import { PrivateLayout } from "./private-layout";
import { PrivateRoute } from "./private-route";
import { DashboardPage, HomePage } from "@/core";
import { UsersPage } from "@/users";
import { BeneficiariesPage } from "@/beneficiaries";
import { GuardiansPage } from "@/guardians";
import { EventsPage } from "@/events";
import { AttendancePage } from "@/attendance";
import { ActsPage } from "@/event-act";
import { EvidencesPage } from "@/evidence";
import { DonationsPage } from "@/donations";
import { DonorsPage } from "@/donors";
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
          
          <Route path="/beneficiaries" element={<BeneficiariesPage />} />
          <Route path="/beneficiaries/guardians" element={<GuardiansPage />} />
          
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/attendance" element={<AttendancePage />} />
          <Route path="/events/acts" element={<ActsPage />} />
          <Route path="/events/evidences" element={<EvidencesPage />} />
          
          <Route path="/donations" element={<DonationsPage />} />
          <Route path="/donations/donors" element={<DonorsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};