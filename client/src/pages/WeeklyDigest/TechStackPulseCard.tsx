import { Box, Typography } from '@mui/material';
import StackBar from '../../components/StackBar';

const fallbackLanguages = [
  { label: 'TypeScript', percentage: 68, color: 'primary.main' },
  { label: 'Rust', percentage: 22, color: 'tertiary.main' },
  { label: 'Go', percentage: 10, color: 'secondary.main' },
];

const COLORS = ['primary.main', 'tertiary.main', 'secondary.main', 'error.main', 'warning.main'];

type TechStackPulseCardProps = {
  languages?: Array<{ label: string; percentage: number }>;
};

const TechStackPulseCard = ({ languages = fallbackLanguages }: TechStackPulseCardProps) => (
  <Box
    sx={{
      bgcolor: 'surfaceContainer',
      p: 3,
      borderRadius: 3,
      border: '1px solid',
      borderColor: 'outlineVariant',
      opacity: 0.9,
    }}
  >
    <Typography
      sx={{
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'onSurfaceVariant',
        mb: 3,
      }}
    >
      Tech Stack Pulse
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {languages.map((lang, index) => (
        <StackBar
          key={lang.label}
          label={lang.label}
          percentage={lang.percentage}
          color={COLORS[index % COLORS.length]}
        />
      ))}
    </Box>
  </Box>
);

export default TechStackPulseCard;
