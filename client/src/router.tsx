
import {
  createRouter,
  createRootRouteWithContext,
  createRoute,
  Outlet,
  redirect,
  useRouterState,
} from "@tanstack/react-router"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import WeeklyDigest from "./pages/WeeklyDigest"
import RepositoryHealth from "./pages/RepositoryHealth"
import type { AuthContextType } from "./AuthContext"
import { useAuth } from "./AuthContext"
import DashboardLayout from "./components/DashboardLayout"

interface MyRouterContext {
  auth: AuthContextType
}

const activeNavByPath: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/weekly-digest": "Weekly Digest",
  "/repo-health": "Repo Health",
}

const RootLayout = () => {
  const auth = useAuth()
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  if (pathname === "/") {
    return <Outlet />
  }

  return (
    <DashboardLayout
      avatarUrl={auth.authUser?.avatar_url ?? undefined}
      activeNav={activeNavByPath[pathname] ?? "Dashboard"}
    >
      <Outlet />
    </DashboardLayout>
  )
}

const rootRoute = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
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
    if (!context.auth.authLoading && !context.auth.isAuthenticated) {
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
    if (!context.auth.authLoading && !context.auth.isAuthenticated) {
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
    if (!context.auth.authLoading && !context.auth.isAuthenticated) {
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
