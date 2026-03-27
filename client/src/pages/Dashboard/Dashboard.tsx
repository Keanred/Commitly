import { Alert, Avatar, Box, Snackbar, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useCallback, useState } from 'react';
import { useAuth } from '../../AuthContext';
import Badge from '../../components/Badge';
import RepoCard from '../../components/RepoCard';
import SectionHeader from '../../components/SectionHeader';
import { useDashboardData } from '../../hooks/useDashboardData';
import LoadingScreen from '../LoadingScreen';
import CommitStreakCard from './CommitStreakCard';
import PeakHoursCard from './PeakHoursCard';
import ProductiveDaysCard from './ProductiveDaysCard';
import WeeklyGlanceCard from './WeeklyGlanceCard';

const languageIcon = (language: string | null): string => {
  switch (language?.toLowerCase()) {
    case 'typescript':
    case 'javascript':
    case 'python':
    case 'java':
    case 'go':
    case 'rust':
    case 'c':
    case 'c++':
    case 'c#':
    case 'ruby':
    case 'swift':
    case 'kotlin':
    case 'php':
      return 'code';
    case 'html':
    case 'css':
    case 'scss':
      return 'web';
    case 'shell':
    case 'bash':
    case 'lua':
      return 'terminal';
    case 'sql':
      return 'database';
    default:
      return 'folder_open';
  }
};

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { authUser, authLoading, authError } = useAuth();
  const {
    streak,
    commitByHour,
    commitByDay,
    weeklyCommitData,
    weeklyPRData,
    weeklyQualityData,
    commitHistory,
    activeRepos,
    isDashboardLoading,
    dashboardLoadProgress,
    dashboardLoadingStep,
    error,
  } = useDashboardData();
  const isLoading = authLoading || isDashboardLoading;

  const [dismissed, setDismissed] = useState(false);
  const hasError = !!(error || authError);
  const toastOpen = hasError && !dismissed;
  const toastMessage = error?.message || authError?.message;

  const handleClose = useCallback(() => setDismissed(true), []);

  if (isLoading) {
    const status = authLoading ? 'Verifying authentication session' : dashboardLoadingStep;
    return <LoadingScreen progress={dashboardLoadProgress} status={status} />;
  }

  return (
    <>
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
          <WeeklyGlanceCard
            weeklyCommitData={weeklyCommitData}
            weeklyPRData={weeklyPRData}
            weeklyQualityData={weeklyQualityData}
          />
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
          {activeRepos?.slice(0, 6).map((repo) => (
            <RepoCard
              key={repo.name}
              icon={languageIcon(repo.language)}
              status={repo.status}
              name={repo.name}
              description={repo.description}
              branch={repo.branch}
              lastActivity={repo.lastActivity}
            />
          ))}
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
