import { Box, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import Badge from '../../components/Badge';
import ContributionCard from '../../components/ContributionCard';
import Icon from '../../components/Icon';
import SectionHeader from '../../components/SectionHeader';

const TopContributionsCard = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        gridColumn: { xs: 'span 12', lg: 'span 7' },
        bgcolor: 'surfaceContainerLow',
        p: 4,
        borderRadius: 3,
      }}
    >
      <SectionHeader
        variant="h6"
        title="Top Contributions"
        trailing={
          <Typography
            component="button"
            sx={{
              color: 'primary.main',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            View All Activity
          </Typography>
        }
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <ContributionCard
          icon="rebase"
          iconBgColor="primaryContainer"
          iconColor="primary.main"
          title="feat: implementation of distributed cache"
          repo="engine-core"
          trailing={
            <Badge bgcolor={theme.palette.tertiaryContainer} color={theme.palette.tertiary.main}>
              +1,240
            </Badge>
          }
        />
        <ContributionCard
          icon="terminal"
          iconBgColor="surfaceContainerHighest"
          iconColor="onSurfaceVariant"
          title="docs: architectural decision records (ADR-04)"
          repo="docs-main"
          trailing={
            <Icon
              name="arrow_forward"
              sx={{
                fontSize: '0.875rem',
                color: 'onSurfaceVariant',
                opacity: 0.4,
              }}
            />
          }
        />
        <ContributionCard
          icon="bug_report"
          iconBgColor={alpha(theme.palette.errorContainer, 0.2)}
          iconColor="error.main"
          title="fix: race condition in socket multiplexer"
          repo="network-layer"
          trailing={
            <Badge bgcolor={alpha(theme.palette.errorContainer, 0.4)} color={theme.palette.error.main}>
              Critical
            </Badge>
          }
        />
      </Box>
    </Box>
  );
};

export default TopContributionsCard;
