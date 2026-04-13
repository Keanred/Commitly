import type { CommitsByDayResponse } from '@commitly/schemas';
import { Box, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

// Outer pentagon vertices for each weekday (Mon–Fri)
const OUTER_POINTS = [
  [50, 5], // MON – top
  [95, 35], // TUE – right
  [80, 85], // WED – bottom-right
  [20, 85], // THU – bottom-left
  [5, 35], // FRI – left
] as const;

const CENTER = [50, 49] as const;

const LABELS = [
  { text: 'MON', top: 0, left: '50%', transform: 'translate(-50%, -16px)' },
  { text: 'TUE', top: '25%', right: 0, transform: 'translateX(16px)' },
  { text: 'WED', bottom: 0, right: 16, transform: 'translateY(16px)' },
  { text: 'THU', bottom: 0, left: 16, transform: 'translateY(16px)' },
  { text: 'FRI', top: '25%', left: 0, transform: 'translateX(-16px)' },
] as const;

// Day keys are normalized in transforms.ts to Monday-first (0 = Mon ... 6 = Sun).
const DAY_KEYS = [0, 1, 2, 3, 4];

function buildDataPolygon(commitByDay: Record<number, number>): string {
  return DAY_KEYS.map((key, i) => {
    const intensity = commitByDay[key] ?? 0;
    const x = CENTER[0] + intensity * (OUTER_POINTS[i][0] - CENTER[0]);
    const y = CENTER[1] + intensity * (OUTER_POINTS[i][1] - CENTER[1]);
    return `${x},${y}`;
  }).join(' ');
}

type ProductiveDaysCardProps = {
  commitByDay: CommitsByDayResponse | null;
};

const ProductiveDaysCard = ({ commitByDay }: ProductiveDaysCardProps) => {
  const theme = useTheme();
  const dataPoints = commitByDay ? buildDataPolygon(commitByDay.commitByDay) : undefined;

  return (
    <Box
      sx={{
        gridColumn: { xs: 'span 12', lg: 'span 5' },
        bgcolor: 'surfaceContainer',
        borderRadius: 3,
        p: 3,
      }}
    >
      <Typography variant="overline" sx={{ color: 'onSurfaceVariant', mb: 2, display: 'block' }}>
        Productive Days
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <Box sx={{ position: 'relative', width: 192, height: 192 }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <polygon
              points="50,5 95,35 80,85 20,85 5,35"
              fill="none"
              stroke={theme.palette.outlineVariant}
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
            <polygon
              points="50,20 85,45 70,75 30,75 15,45"
              fill="none"
              stroke={theme.palette.outlineVariant}
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
            {dataPoints && (
              <polygon
                points={dataPoints}
                fill={alpha(theme.palette.primary.main, 0.2)}
                stroke={theme.palette.primary.main}
                strokeWidth="2"
              />
            )}
          </svg>
          {LABELS.map(({ text, transform, ...pos }) => (
            <Box
              key={text}
              sx={{
                position: 'absolute',
                ...pos,
                transform,
                fontSize: '10px',
                fontWeight: 700,
                color: 'onSurface',
              }}
            >
              {text}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ProductiveDaysCard;
