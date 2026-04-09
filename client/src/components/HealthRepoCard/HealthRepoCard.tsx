import { Box, Typography } from '@mui/material';
import Badge from '../Badge';
import Icon from '../Icon';

interface HealthRepoCardProps {
  icon: string;
  iconBgColor?: string;
  iconColor?: string;
  name: string;
  language: string;
  languageColor?: string;
  lastCommit: string;
  healthPercent: number;
}

const HealthRepoCard = ({
  icon,
  iconBgColor = 'primaryContainer',
  iconColor = 'primary.main',
  name,
  language,
  languageColor = 'primary.main',
  lastCommit,
  healthPercent,
}: HealthRepoCardProps) => (
  <Box
    sx={{
      bgcolor: 'surfaceContainerLow',
      p: 2.5,
      borderRadius: 3,
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      transition: 'background-color 0.2s',
      '&:hover': { bgcolor: 'surfaceContainer' },
    }}
  >
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: 2,
        bgcolor: iconBgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: iconColor,
        flexShrink: 0,
      }}
    >
      <Icon name={icon} />
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Typography sx={{ fontWeight: 700, color: 'onSurface' }}>{name}</Typography>
        <Badge bgcolor="surfaceBright" color={languageColor}>
          {language}
        </Badge>
      </Box>
      <Typography variant="caption" sx={{ color: 'onSurfaceVariant' }}>
        {lastCommit}
      </Typography>
    </Box>
    <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
      <Box
        sx={{
          height: 8,
          width: 96,
          bgcolor: 'surfaceContainerHighest',
          borderRadius: 50,
          overflow: 'hidden',
          mb: 1,
        }}
      >
        <Box
          sx={{
            height: '100%',
            bgcolor: 'tertiary.main',
            width: `${healthPercent}%`,
            borderRadius: 50,
          }}
        />
      </Box>
      <Typography
        sx={{
          fontSize: '10px',
          fontWeight: 700,
          color: 'onSurfaceVariant',
          textTransform: 'uppercase',
        }}
      >
        Health {healthPercent}%
      </Typography>
    </Box>
  </Box>
);

export default HealthRepoCard;
