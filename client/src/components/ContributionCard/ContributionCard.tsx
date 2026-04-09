import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import Icon from '../Icon';

interface ContributionCardProps {
  icon: string;
  iconBgColor?: string;
  iconColor?: string;
  title: string;
  repo: string;
  repoOrg?: string;
  trailing?: ReactNode;
}

const ContributionCard = ({
  icon,
  iconBgColor = 'primaryContainer',
  iconColor = 'primary.main',
  title,
  repo,
  repoOrg = 'commitly-ai',
  trailing,
}: ContributionCardProps) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      p: 2,
      borderRadius: 2,
      bgcolor: 'surfaceContainer',
      transition: 'background-color 0.2s',
      '&:hover': { bgcolor: 'surfaceContainerHigh' },
    }}
  >
    <Box
      sx={{
        width: 40,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: iconBgColor,
        borderRadius: 1,
        color: iconColor,
        flexShrink: 0,
      }}
    >
      <Icon name={icon} />
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        sx={{
          fontFamily: "'Manrope'",
          fontWeight: 700,
          fontSize: '0.875rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </Typography>
      <Typography variant="caption" sx={{ color: 'onSurfaceVariant', mt: 0.25 }}>
        {repoOrg} /{' '}
        <Typography component="span" variant="caption" sx={{ color: 'primary.main' }}>
          {repo}
        </Typography>
      </Typography>
    </Box>
    {trailing && <Box sx={{ flexShrink: 0, textAlign: 'right' }}>{trailing}</Box>}
  </Box>
);

export default ContributionCard;
