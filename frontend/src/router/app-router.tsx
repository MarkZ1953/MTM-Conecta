import { Route, Routes } from "react-router-dom";
import { PrivateLayout } from "./private-layout";
import { PrivateRoute } from "./private-route";
import {
  AboutPage,
  BlogPage,
  ContactPage,
  DashboardPage,
  DonatePage,
  FAQPage,
  HelpPage,
  HomePage,
  NewsPage,
  NotFoundPage,
  ProgramsPage,
  PublicEventsPage,
  SponsorPage,
  TestimonialsPage,
  VolunteerPage,
} from "@/core";
import { UsersPage } from "@/users";
import { BeneficiariesPage } from "@/beneficiaries";
import { GuardiansPage } from "@/guardians";
import { EventsPage } from "@/events";
import { AttendancePage } from "@/attendance";
import { ActsPage } from "@/event-act";
import { EvidencesPage } from "@/evidence";
import { DonationsPage } from "@/donations";
import { DonorsPage } from "@/donors";
import { CampaignsPage, CampaignFormPage } from "@/campaigns";
import { VolunteersPage } from "@/volunteers";
import {
  CapCollectionPage,
  CompaniesPage,
  CollectionPointsPage,
  CollectionRequestsPage,
} from "@/cap-collection";
import { LoginPage, RegisterPage } from "@/auth";

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/nosotros" element={<AboutPage />} />
      <Route path="/programas" element={<ProgramsPage />} />
      <Route path="/como-ayudar" element={<HelpPage />} />
      <Route path="/donar" element={<DonatePage />} />
      <Route path="/padrino-permanente" element={<SponsorPage />} />
      <Route path="/voluntariado" element={<VolunteerPage />} />
      <Route path="/eventos-publicos" element={<PublicEventsPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/noticias" element={<NewsPage />} />
      <Route path="/testimonios" element={<TestimonialsPage />} />
      <Route path="/preguntas-frecuentes" element={<FAQPage />} />
      <Route path="/contacto" element={<ContactPage />} />
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
          <Route path="/volunteers" element={<VolunteersPage />} />

          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/campaigns/nueva" element={<CampaignFormPage />} />
          <Route path="/campaigns/:id/editar" element={<CampaignFormPage />} />

          <Route path="/cap-collection" element={<CapCollectionPage />} />
          <Route path="/cap-collection/companies" element={<CompaniesPage />} />
          <Route path="/cap-collection/points" element={<CollectionPointsPage />} />
          <Route path="/cap-collection/requests" element={<CollectionRequestsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
