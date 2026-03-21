import { Alert, Avatar, Box, Button, Snackbar, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useCallback, useState } from 'react';
import { useAuth } from '../../AuthContext';
import { useRouter } from '@tanstack/react-router';
import Badge from '../../components/Badge';
import DashboardLayout from '../../components/DashboardLayout';
import RepoCard from '../../components/RepoCard';
import SectionHeader from '../../components/SectionHeader';
import { useDashboardData } from '../../hooks/useDashboardData';
import LoadingScreen from '../LoadingScreen';
import CommitStreakCard from './CommitStreakCard';
import PeakHoursCard from './PeakHoursCard';
import ProductiveDaysCard from './ProductiveDaysCard';
import WeeklyGlanceCard from './WeeklyGlanceCard';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { authUser, authLoading, authError, logout } = useAuth();
  const router = useRouter();
  const { streak, commitByHour, commitByDay, weeklyCommitData, weeklyPRData, weeklyQualityData, commitHistory, isDashboardLoading, error } =
    useDashboardData();
  const isLoading = authLoading || isDashboardLoading;

  const [dismissed, setDismissed] = useState(false);
  const hasError = !!(error || authError);
  const toastOpen = hasError && !dismissed;
  const toastMessage = error?.message || authError?.message;

  const handleClose = useCallback(() => setDismissed(true), []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <DashboardLayout avatarUrl={authUser?.avatar_url ?? undefined}>
      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity="error" variant="filled">
          {toastMessage}
        </Alert>
      </Snackbar>
      {/* Engineering Overview */}
      <Box component="section" sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar src={authUser?.avatar_url ?? undefined} sx={{ width: 48, height: 48 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Welcome back, {authUser?.name || authUser?.login}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Here's your engineering overview
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={async () => {
              await logout();
              router.navigate({ to: '/' });
            }}
            sx={{ ml: 'auto' }}
          >
            Logout
          </Button>
        </Box>
        <SectionHeader
          title="Engineering Overview"
          subtitle={
            <>
              Real-time performance metrics for{' '}
              <Typography component="span" sx={{ color: 'primary.main', fontFamily: 'monospace' }}>
                commitly-core
              </Typography>
            </>
          }
          trailing={
            <Badge
              sx={{
                border: '1px solid',
                borderColor: alpha(theme.palette.outline, 0.2),
              }}
            >
              LAST 7 DAYS
            </Badge>
          }
        />

        {/* Bento Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 3,
          }}
        >
          <CommitStreakCard commitStreak={streak} commitHistory={commitHistory} />
          <PeakHoursCard commitByHour={commitByHour} />
          <ProductiveDaysCard commitByDay={commitByDay} />
          <WeeklyGlanceCard weeklyCommitData={weeklyCommitData} weeklyPRData={weeklyPRData} weeklyQualityData={weeklyQualityData} />
        </Box>
      </Box>

      {/* Active Repositories */}
      <Box component="section">
        <SectionHeader
          title="Active Repositories"
          variant="h6"
          trailing={
            <Typography
              component="button"
              sx={{
                color: 'onSurfaceVariant',
                fontSize: '0.875rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s',
                '&:hover': { color: 'onSurface' },
              }}
            >
              Manage Fleet
            </Typography>
          }
        />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          <RepoCard
            icon="folder_open"
            status="healthy"
            name="commitly-web-client"
            description="React + Tailwind UI Layer"
            branch="main"
            lastActivity="2m ago"
          />
          <RepoCard
            icon="terminal"
            status="maintenance"
            name="api-gateway-service"
            description="Rust-based high speed proxy"
            branch="staging"
            lastActivity="1h ago"
          />
          <RepoCard
            icon="database"
            status="failing"
            name="data-lake-indexer"
            description="Vector DB sync routines"
            branch="feat/async-v2"
            lastActivity="8m ago"
          />
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default Dashboard;
