import { Box, Typography } from '@mui/material';
import ProgressBar from '../../components/ProgressBar';
import type { CommitsByHourData } from '../../hooks/useCommitMetrics';
type PeakHoursCardProps = {
  commitByHour: CommitsByHourData | null;
};
const PeakHoursCard = (props: PeakHoursCardProps) => {
  const hourlyCommits = props.commitByHour?.commitByHour ?? {};
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
        {Object.entries(hourlyCommits).map(([hour, count]) => (
          <ProgressBar key={hour} label={hour} percentage={count} />
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
        Most active during &quot;Deep Focus&quot; night windows.
      </Typography>
    </Box>
  );
};

export default PeakHoursCard;
