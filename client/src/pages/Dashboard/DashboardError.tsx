import { Alert, Box, Button, Typography } from '@mui/material';
import { useRouter } from '@tanstack/react-router';

interface DashboardErrorProps {
  error: unknown;
  onRetry?: () => void;
  title?: string;
  description?: string;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'We could not load your dashboard data. Please try again.';
};

const DashboardError = ({
  error,
  onRetry,
  title = 'Dashboard unavailable',
  description = 'We hit an error while loading your latest metrics snapshot.',
}: DashboardErrorProps) => {
  const router = useRouter();

  const retry = async () => {
    onRetry?.();
    await router.invalidate();
  };

  return (
    <Box sx={{ maxWidth: 760, mx: 'auto', mt: 6 }}>
      <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography sx={{ color: 'onSurfaceVariant', mb: 3 }}>{description}</Typography>

      <Alert severity="error" sx={{ mb: 3 }}>
        {getErrorMessage(error)}
      </Alert>

      <Button variant="contained" onClick={() => void retry()}>
        Retry
      </Button>
    </Box>
  );
};

export default DashboardError;
