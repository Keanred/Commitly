import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import ProgressBar from '../../components/ProgressBar';
import type { CommitsByHourData } from '../../hooks/useCommitMetrics';
type PeakHoursCardProps = {
  commitByHour: CommitsByHourData | null;
};

const blockTimeRanges: Record<string, string> = {
  Morning: '6 AM – 12 PM',
  Afternoon: '12 PM – 5 PM',
  Evening: '5 PM – 10 PM',
  Night: '10 PM – 6 AM',
};

const PeakHoursCard = (props: PeakHoursCardProps) => {
  const hourlyCommits = props.commitByHour?.commitByHour ?? {};

  const peakLabel = useMemo(() => {
    const entries = Object.entries(hourlyCommits).sort((a, b) => b[1] - a[1]);
    if (entries.length === 0) return 'No commit data yet.';
    const peak = entries[0][0];
    const range = blockTimeRanges[peak] ?? '';
    return `Peak productivity: ${peak} (${range})`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.commitByHour]);

  return (
    <Box
      sx={{
        gridColumn: { xs: 'span 12', lg: 'span 4' },
        bgcolor: 'surfaceContainer',
        borderRadius: 3,
        p: 3,
        borderLeft: '4px solid',
        borderColor: 'primary.main',
      }}
    >
      <Typography variant="overline" sx={{ color: 'onSurfaceVariant', mb: 3, display: 'block' }}>
        Peak Coding Hours
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Object.entries(hourlyCommits).map(([hour, percentage]) => (
          <ProgressBar key={hour} label={hour} percentage={percentage} />
        ))}
      </Box>
      <Typography
        variant="caption"
        sx={{
          color: 'onSurfaceVariant',
          fontStyle: 'italic',
          mt: 3,
          display: 'block',
        }}
      >
        {peakLabel}
      </Typography>
    </Box>
  );
};

export default PeakHoursCard;
