import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from "react";
import MainLayout from '../layouts/MainLayout';

// Page imports
// import Home from '../pages/dashboard/Home';
// import Verification from '../pages/verificationQueue/Verification';
// import Workers from '../pages/workers/workerTable';
// import Clients from '../pages/clients/clientTable';
// import Jobs from '../pages/jobs/Jobs';
// import Bookings from '../pages/booking/Bookings';
// import Budget from '../pages/budget/Budget';
// import RolesPermission from '../pages/roleAndPermission/RolesPermission';
// import Rewards from '../pages/reward/Rewards';
// import Subscription from '../pages/subscription/Subscription';
// import AddNewWorkerPage from '../pages/workers/createWorker';
// import AddNewClientPage from '../pages/clients/createClient';
// import AddNewRolesPage from '../pages/roleAndPermission/createRoles';



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
      <Suspense fallback={<div>Loading...</div>}>
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
        </Suspense>
    </MainLayout>
  );
};

export default AppRoutes;
