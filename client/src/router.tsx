
import {
  createRouter,
  createRootRouteWithContext,
  createRoute,
  Outlet,
  redirect,
} from "@tanstack/react-router"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import WeeklyDigest from "./pages/WeeklyDigest"
import RepositoryHealth from "./pages/RepositoryHealth"
import type { AuthContextType } from "./AuthContext"

interface MyRouterContext {
  auth: AuthContextType
}

const rootRoute = createRootRouteWithContext<MyRouterContext>()({
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
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/",
        search: { redirect: location.href },
      })
    }
  },
})

const weeklyDigestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/weekly-digest",
  component: WeeklyDigest,
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/",
        search: { redirect: location.href },
      })
    }
  },
})

const repoHealthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/repo-health",
  component: RepositoryHealth,
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/",
        search: { redirect: location.href },
      })
    }
  },
})

const routeTree = rootRoute.addChildren([
  loginRoute,
  dashboardRoute,
  weeklyDigestRoute,
  repoHealthRoute,
])

export const router = createRouter({
  routeTree,
  context: undefined as unknown as MyRouterContext,
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
    context: MyRouterContext
  }
}
