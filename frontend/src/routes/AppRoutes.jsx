import { Routes, Route } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";

import DashboardPage from "../pages/dashboard/DashboardPage";
import RequestsPage from "../pages/requests/RequestsPage";
import CreateRequestPage from "../pages/requests/CreateRequestPage";
import SchemaBuilderPage from "../pages/requests/SchemaBuilderPage";

import RequestDetailsPage from "../pages/requests/RequestDetailsPage";
import ContributePage from "../pages/requests/ContributePage";
import ContributionsPage from "../pages/contributions/ContributionsPage";
import ContributionDetailsPage from "../pages/contributions/ContributionDetailsPage";

import DatasetsPage from "../pages/datasets/DatasetsPage";
import DatasetDetailsPage from "../pages/datasets/DatasetDetailsPage";
import ProfilePage from "../pages/profile/ProfilePage";
import EditRequestPage from "../pages/requests/EditRequestPage";

import CreateDatasetPage from "../pages/datasets/CreateDatasetPage";
import EditDatasetPage from "../pages/datasets/EditDatasetPage";
import HomePage from "../pages/HomePage";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      {/* Protected Routes */}

      <Route
        path="/datasets/:id/edit"
        element={<EditDatasetPage />}
      />
      <Route
        path="/datasets/create"
        element={<CreateDatasetPage />}
      />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/requests"
          element={<RequestsPage />}
        />

        <Route
          path="/requests/create"
          element={<CreateRequestPage />}
        />

        <Route
          path="/requests/create/schema"
          element={<SchemaBuilderPage />}
        />

        <Route
          path="/requests/:id"
          element={<RequestDetailsPage />}
        />

        <Route
          path="/requests/:id/edit"
          element={<EditRequestPage />}
        />

        <Route
          path="/requests/:id/contribute"
          element={<ContributePage />}
        />

        <Route
          path="/contributions"
          element={<ContributionsPage />}
        />

        <Route
          path="/contributions/:id"
          element={<ContributionDetailsPage />}
        />

        <Route
          path="/datasets"
          element={<DatasetsPage />}
        />

        <Route
          path="/datasets/:id"
          element={<DatasetDetailsPage />}
        />

        <Route
          path="/profile"
          element={<ProfilePage />}
        />
      </Route>

      {/* Admin */}
      <Route
        path="/admin"
        element={<div>Admin</div>}
      />
    </Routes>

  );
}

export default AppRoutes;