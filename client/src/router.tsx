import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
} from "@tanstack/react-router"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import WeeklyDigest from "./pages/WeeklyDigest"
import RepositoryHealth from "./pages/RepositoryHealth"

const rootRoute = createRootRoute({
  component: Outlet,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Login,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: Dashboard,
})

const weeklyDigestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/weekly-digest",
  component: WeeklyDigest,
})

const repoHealthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/repo-health",
  component: RepositoryHealth,
})

const routeTree = rootRoute.addChildren([
  loginRoute,
  dashboardRoute,
  weeklyDigestRoute,
  repoHealthRoute,
])

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
