import { Box, Typography } from '@mui/material';
import BarChart from '../../components/BarChart';

const fallbackBars = [
  { value: 60, label: 'MON' },
  { value: 40, label: 'TUE' },
  { value: 95, label: 'WED' },
  { value: 70, label: 'THU' },
  { value: 100, label: 'FRI' },
  { value: 30, label: 'SAT' },
  { value: 50, label: 'SUN' },
];

type ConsistencyScoreCardProps = {
  score?: number;
  bars?: Array<{ value: number; label: string }>;
};

const ConsistencyScoreCard = ({ score = 0, bars = fallbackBars }: ConsistencyScoreCardProps) => (
  <Box
    sx={{
      bgcolor: 'surfaceContainerLow',
      p: 3,
      borderRadius: 3,
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        mb: 4,
      }}
    >
      <Typography
        sx={{
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'onSurfaceVariant',
        }}
      >
        Consistency Score
      </Typography>
      <Typography
        sx={{
          color: 'tertiary.main',
          fontFamily: "'Manrope'",
          fontSize: '1.875rem',
          fontWeight: 900,
        }}
      >
        {score}
      </Typography>
    </Box>
    <BarChart bars={bars} />
  </Box>
);

export default ConsistencyScoreCard;
