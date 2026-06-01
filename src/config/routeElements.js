/**
 * Route elements: Dashboard (home) is static; app routes use React.lazy for code-splitting.
 * Single source of truth for route → component mapping.
 */

import React, { lazy, Suspense } from "react";
import DashboardPage from "../pages/DashboardPage";
import { LoadingSpinner } from "../components/shared/PageLayout";

const MarketplacePage = lazy(() => import("../pages/MarketplacePage"));
const MyPropertiesPage = lazy(() => import("../pages/MyPropertiesPage"));
const RentalsPage = lazy(() => import("../pages/RentalsPage"));
const FractionalPage = lazy(() => import("../pages/FractionalPage"));
const StakingPage = lazy(() => import("../pages/StakingPage"));
const AdminPage = lazy(() => import("../pages/AdminPage"));
const HowItWorksPage = lazy(() => import("../pages/HowItWorksPage"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const DevelopersPage = lazy(() => import("../pages/DevelopersPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

const withSuspense = (El) => (
  <Suspense fallback={<LoadingSpinner label="Loading…" />}>{El}</Suspense>
);

/** Map ROUTES.* to element (for programmatic use). Lazy pages wrapped in Suspense. */
export const ROUTE_ELEMENTS = {
  home: <DashboardPage />,
  marketplace: withSuspense(<MarketplacePage />),
  myProperties: withSuspense(<MyPropertiesPage />),
  rentals: withSuspense(<RentalsPage />),
  fractional: withSuspense(<FractionalPage />),
  staking: withSuspense(<StakingPage />),
  admin: withSuspense(<AdminPage />),
  howItWorks: withSuspense(<HowItWorksPage />),
  about: withSuspense(<AboutPage />),
  developers: withSuspense(<DevelopersPage />),
  notFound: withSuspense(<NotFoundPage />),
};
