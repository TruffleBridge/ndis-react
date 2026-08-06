import { Routes, Route } from "react-router-dom";
import { lazy } from "react";

import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "@/pages/NotFound";

const Login = lazy(() => import("@/pages/login/login"));
const Home = lazy(() => import("@/pages/dashboard/Home"));
const Verification = lazy(() => import("@/pages/verificationQueue/Verification"));
const Workers = lazy(() => import("@/pages/workers/workerTable"));
const Clients = lazy(() => import("@/pages/clients/clientTable"));
const Jobs = lazy(() => import("@/pages/jobs/Jobs"));
const Bookings = lazy(() => import("@/pages/booking/Bookings"));
const Budget = lazy(() => import("@/pages/budget/Budget"));
const RolesPermission = lazy(() =>
  import("@/pages/roleAndPermission/RolesPermission")
);
const Rewards = lazy(() => import("@/pages/reward/Rewards"));
const Subscription = lazy(() => import("@/pages/subscription/Subscription"));
const AddNewWorkerPage = lazy(() => import("@/pages/workers/createWorker"));
const AddNewClientPage = lazy(() => import("@/pages/clients/createClient"));
const AddNewRolesPage = lazy(() => import("@/pages/roleAndPermission/createRoles"));
const ProfileDetails = lazy(() => import("@/pages/profile/profiledetails"));
const AuditLogsPage = lazy(() => import("@/pages/auditLog/auditLog"));

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />

          <Route path="verification-queue" element={<Verification />} />

          <Route path="workers" element={<Workers />} />
          <Route path="create-worker" element={<AddNewWorkerPage />} />

          <Route path="clients" element={<Clients />} />
          <Route path="create-client" element={<AddNewClientPage />} />

          <Route path="jobs" element={<Jobs />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="budget" element={<Budget />} />

          <Route path="roles-permission" element={<RolesPermission />} />
          <Route path="create-roles" element={<AddNewRolesPage />} />

          <Route path="rewards" element={<Rewards />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="profile-details" element={<ProfileDetails />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;