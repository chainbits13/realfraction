/**
 * Central route configuration for React Router.
 * Single source of truth for paths and lazy-loaded page components.
 */

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/",
  HOW_IT_WORKS: "/how-it-works",
  ABOUT: "/about",
  DEVELOPERS: "/developers",
  MARKETPLACE: "/marketplace",
  MY_PROPERTIES: "/my-properties",
  RENTALS: "/rentals",
  FRACTIONAL: "/fractional",
  STAKING: "/staking",
  ADMIN: "/admin",
  NOT_FOUND: "*",
};

/** Route path list for nav links and redirects */
export const ROUTE_PATHS = Object.values(ROUTES).filter((p) => p !== "*");

/** Paths that require wallet connection (show ConnectGate when disconnected) */
export const PROTECTED_PATHS = [
  ROUTES.MARKETPLACE,
  ROUTES.MY_PROPERTIES,
  ROUTES.RENTALS,
  ROUTES.FRACTIONAL,
  ROUTES.STAKING,
  ROUTES.ADMIN,
];

export default ROUTES;
