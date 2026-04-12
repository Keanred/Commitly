import { QueryErrorResetBoundary } from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  Outlet,
  redirect,
  useRouterState,
} from '@tanstack/react-router';
import { useAuth, type AuthContextType } from './AuthContext';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import DashboardError from './pages/Dashboard/DashboardError';
import Login from './pages/Login';
import RepositoryHealth from './pages/RepositoryHealth';
import WeeklyDigest from './pages/WeeklyDigest';

interface MyRouterContext {
  auth: AuthContextType;
}

const activeNavByPath: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/weekly-digest': 'Weekly Digest',
  '/repo-health': 'Repo Health',
};

const createQueryErrorComponent = (title?: string, description?: string) => {
  return ({ error, reset }: { error: unknown; reset: () => void }) => (
    <QueryErrorResetBoundary>
      {({ reset: resetQueryError }) => (
        <DashboardError
          error={error}
          title={title}
          description={description}
          onRetry={() => {
            resetQueryError();
            reset();
          }}
        />
      )}
    </QueryErrorResetBoundary>
  );
};

const RootLayout = () => {
  const auth = useAuth();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname === '/') {
    return <Outlet />;
  }

  return (
    <DashboardLayout
      avatarUrl={auth.authUser?.avatar_url ?? undefined}
      activeNav={activeNavByPath[pathname] ?? 'Dashboard'}
    >
      <Outlet />
    </DashboardLayout>
  );
};

const rootRoute = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Login,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
  errorComponent: createQueryErrorComponent(),
  beforeLoad: ({ context, location }) => {
    if (!context.auth.authLoading && !context.auth.isAuthenticated) {
      throw redirect({
        to: '/',
        search: { redirect: location.href },
      });
    }
  },
});

const weeklyDigestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/weekly-digest',
  component: WeeklyDigest,
  errorComponent: createQueryErrorComponent(
    'Weekly digest unavailable',
    'We hit an error while loading your weekly digest data.',
  ),
  beforeLoad: ({ context, location }) => {
    if (!context.auth.authLoading && !context.auth.isAuthenticated) {
      throw redirect({
        to: '/',
        search: { redirect: location.href },
      });
    }
  },
});

const repoHealthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/repo-health',
  component: RepositoryHealth,
  errorComponent: createQueryErrorComponent(
    'Repository health unavailable',
    'We hit an error while loading repository health metrics.',
  ),
  beforeLoad: ({ context, location }) => {
    if (!context.auth.authLoading && !context.auth.isAuthenticated) {
      throw redirect({
        to: '/',
        search: { redirect: location.href },
      });
    }
  },
});

const routeTree = rootRoute.addChildren([loginRoute, dashboardRoute, weeklyDigestRoute, repoHealthRoute]);

export const router = createRouter({
  routeTree,
  context: undefined as unknown as MyRouterContext,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
    context: MyRouterContext;
  }
}
