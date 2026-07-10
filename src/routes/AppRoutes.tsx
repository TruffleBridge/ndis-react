import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { lazy } from "react";
import MainLayout from '../layouts/MainLayout';




const Home = lazy(() => import("../pages/dashboard/Home"));
const Verification = lazy(() => import("../pages/verificationQueue/Verification"));
const Workers = lazy(() => import("../pages/workers/workerTable"));
const Clients = lazy(() => import("../pages/clients/clientTable"));
const Jobs = lazy(() => import("../pages/jobs/Jobs"));
const Bookings = lazy(() => import("../pages/booking/Bookings"));
const Budget = lazy(() => import("../pages/budget/Budget"));
const RolesPermission = lazy(() => import("../pages/roleAndPermission/RolesPermission"));
const Rewards = lazy(() => import("../pages/reward/Rewards"));
const Subscription = lazy(() => import("../pages/subscription/Subscription"));
const AddNewWorkerPage = lazy(() => import("../pages/workers/createWorker"));
const AddNewClientPage = lazy(() => import("../pages/clients/createClient"));
const AddNewRolesPage = lazy(() => import("../pages/roleAndPermission/createRoles"));

const AppRoutes: React.FC = () => {
  return (
    <MainLayout>
      {/* <Suspense> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verification-queue" element={<Verification />} />
        {/* workers */}
        <Route path="/workers" element={<Workers />} />
        <Route path="/create-worker" element={<AddNewWorkerPage />} />
        {/*client  */}
        <Route path="/clients" element={<Clients />} />
        <Route path="/create-client" element={<AddNewClientPage />} />
        {/* jobs */}
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/budget" element={<Budget />} />
        {/* roles and permisson */}
        <Route path="/roles-permission" element={<RolesPermission />} />
        <Route path="/create-roles" element={<AddNewRolesPage />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/subscription" element={<Subscription />} />
      </Routes>
      {/* </Suspense> */}
    </MainLayout>
  );
};

export default AppRoutes;
