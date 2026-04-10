import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { useEffect } from 'react';
import { AuthProvider } from './AuthProvider';
import { queryClient } from './queryClient';
import { router } from './router';

import { useAuth } from './AuthContext';

const AppInner = () => {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.authLoading) {
      router.invalidate();
    }
  }, [auth.authLoading]);

  return <RouterProvider router={router} context={{ auth }} />;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
