import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Badge from '../../components/Badge';
import SectionHeader from '../../components/SectionHeader';
import StatCard from '../../components/StatCard';
import type { WeeklyCommitData, WeeklyPRData, WeeklyQualityData } from '../../hooks/useCommitMetrics';

type WeeklyGlanceCardProps = {
  weeklyCommitData: WeeklyCommitData | null;
  weeklyPRData: WeeklyPRData | null;
  weeklyQualityData: WeeklyQualityData | null;
};

const WeeklyGlanceCard = (props: WeeklyGlanceCardProps) => {
  const delta = props.weeklyCommitData?.delta ?? 0;
  const lastWeek = props.weeklyCommitData?.lastWeek ?? 0;
  const thisWeek = props.weeklyCommitData?.thisWeek ?? 0;
  const velocity = lastWeek > 0 ? Math.round((delta / lastWeek) * 100) : 0;
  const weeklyCommits = thisWeek;
  const weeklyCommitTrend = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : 0;

  const prsMerged = props.weeklyPRData?.thisWeek ?? 0;
  const prsLastWeek = props.weeklyPRData?.lastWeek ?? 0;
  const prsTrend = prsLastWeek > 0 ? Math.round(((prsMerged - prsLastWeek) / prsLastWeek) * 100) : 0;

  const qualityScore = props.weeklyQualityData?.thisWeek ?? 0;
  const qualityLastWeek = props.weeklyQualityData?.lastWeek ?? 0;
  const qualityTrend = qualityLastWeek > 0 ? Math.round(((qualityScore - qualityLastWeek) / qualityLastWeek) * 100) : 0;
  return (
    <Box
      sx={{
        gridColumn: { xs: 'span 12', lg: 'span 7' },
        bgcolor: 'surfaceContainerLow',
        borderRadius: 3,
        p: 4,
        border: '1px solid',
        borderColor: (theme) => alpha(theme.palette.outline, 0.1),
      }}
    >
      <SectionHeader
        variant="h6"
        title="Last Week at a Glance"
        trailing={
          <Badge bgcolor="onTertiaryFixedVariant" color="tertiary.main" pill sx={{ fontSize: '10px' }}>
            {velocity >= 0 ? `+${velocity}% Velocity` : `${velocity}% Velocity`}
          </Badge>
        }
      />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 4,
        }}
      >
        <StatCard
          label="Commits"
          value={weeklyCommits}
          trend={{
            value: `${Math.abs(weeklyCommitTrend)}%`,
            direction: weeklyCommitTrend >= 0 ? 'up' : 'down',
          }}
        />
        <StatCard
          label="PRs Merged"
          value={prsMerged}
          trend={{
            value: `${Math.abs(prsTrend)}%`,
            direction: prsTrend >= 0 ? 'up' : 'down',
          }}
        />
        <StatCard
          label="Code Quality"
          value={`${qualityScore}%`}
          trend={{
            value: `${Math.abs(qualityTrend)}%`,
            direction: qualityTrend >= 0 ? 'up' : 'down',
          }}
        />
      </Box>
      <Box
        sx={{
          mt: 4,
          pt: 3,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex' }}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: 'surfaceBright',
                border: '2px solid',
                borderColor: 'surfaceContainerLow',
                ml: i > 0 ? -1 : 0,
              }}
            />
          ))}
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: 'surfaceBright',
              border: '2px solid',
              borderColor: 'surfaceContainerLow',
              ml: -1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 700,
            }}
          >
            +4
          </Box>
        </Box>
        <Typography
          component="button"
          sx={{
            color: 'primary.main',
            fontSize: '0.75rem',
            fontWeight: 700,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          View Team Activity
        </Typography>
      </Box>
    </Box>
  );
};

export default WeeklyGlanceCard;
