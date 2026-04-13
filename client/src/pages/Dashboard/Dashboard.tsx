import { Alert, Avatar, Box, Snackbar, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../AuthContext';
import Badge from '../../components/Badge';
import RepoCard from '../../components/RepoCard';
import SectionHeader from '../../components/SectionHeader';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useSyncData } from '../../hooks/useSyncData';
import LoadingScreen from '../LoadingScreen';
import CommitStreakCard from './CommitStreakCard';
import PeakHoursCard from './PeakHoursCard';
import ProductiveDaysCard from './ProductiveDaysCard';
import WeeklyGlanceCard from './WeeklyGlanceCard';

// eslint-disable-next-line complexity
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

// eslint-disable-next-line complexity
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
  } = useDashboardData();
  const { sync, syncing, progress, error: syncError } = useSyncData();

  const [dismissed, setDismissed] = useState(false);
  const [syncAttempted, setSyncAttempted] = useState(false);

  const hasAnyDashboardData = useMemo(() => {
    const hasActiveRepos = (activeRepos?.length ?? 0) > 0;
    const hasStreak = (streak?.currentStreak ?? 0) > 0 || (streak?.longestStreak ?? 0) > 0;
    const hasWeeklyData = [weeklyCommitData, weeklyPRData, weeklyQualityData].some(
      (entry) => (entry?.thisWeek ?? 0) > 0 || (entry?.lastWeek ?? 0) > 0,
    );
    const hasHourlyActivity = Object.values(commitByHour?.commitByHour ?? {}).some((value) => value > 0);
    const hasDailyActivity = Object.values(commitByDay?.commitByDay ?? {}).some((value) => value > 0);

    return hasActiveRepos || hasStreak || hasWeeklyData || hasHourlyActivity || hasDailyActivity;
  }, [activeRepos, streak, weeklyCommitData, weeklyPRData, weeklyQualityData, commitByHour, commitByDay]);

  useEffect(() => {
    if (!authLoading && !isDashboardLoading && !syncing && !syncAttempted && !hasAnyDashboardData) {
      setSyncAttempted(true);
      sync();
    }
  }, [authLoading, isDashboardLoading, syncing, syncAttempted, hasAnyDashboardData, sync]);

  const syncStatus = useMemo(() => {
    switch (progress.currentStep) {
      case 'repos':
        return 'Syncing repositories';
      case 'commits':
        return 'Syncing commits';
      case 'languages':
        return 'Syncing languages';
      case 'branches':
        return 'Syncing branches';
      default:
        return 'Syncing GitHub data';
    }
  }, [progress.currentStep]);

  const syncLoadProgress = useMemo(() => {
    const totalSteps = 4;
    const completed = progress.completedSteps.length;
    const inStepBonus = progress.currentStep ? 12 : 0;
    const value = Math.round((completed / totalSteps) * 100 + inStepBonus);
    return Math.max(10, Math.min(100, value));
  }, [progress.completedSteps.length, progress.currentStep]);

  const isLoading = authLoading || isDashboardLoading || syncing;
  let syncErrorMessage: string | null = null;
  if (syncError instanceof Error) {
    syncErrorMessage = syncError.message;
  } else if (syncError) {
    syncErrorMessage = 'Failed to sync data';
  }

  const hasError = !!authError || !!syncError;
  const toastOpen = hasError && !dismissed;
  const toastMessage = authError?.message ?? syncErrorMessage;

  const handleClose = useCallback(() => setDismissed(true), []);

  if (isLoading) {
    let status = dashboardLoadingStep;
    let progressValue = dashboardLoadProgress;

    if (authLoading) {
      status = 'Verifying authentication session';
      progressValue = 15;
    } else if (syncing) {
      status = syncStatus;
      progressValue = syncLoadProgress;
    }

    return <LoadingScreen progress={progressValue} status={status} />;
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
