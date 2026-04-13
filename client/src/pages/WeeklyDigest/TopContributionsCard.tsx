import { Box, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import Badge from '../../components/Badge';
import ContributionCard from '../../components/ContributionCard';
import Icon from '../../components/Icon';
import SectionHeader from '../../components/SectionHeader';

const fallbackContributions = [
  { title: 'feat: implementation of distributed cache', repo: 'engine-core', repoOrg: 'commitly-ai', impact: 1240 },
  {
    title: 'docs: architectural decision records (ADR-04)',
    repo: 'docs-main',
    repoOrg: 'commitly-ai',
    impact: 84,
  },
  {
    title: 'fix: race condition in socket multiplexer',
    repo: 'network-layer',
    repoOrg: 'commitly-ai',
    impact: 560,
  },
];

type TopContributionsCardProps = {
  contributions?: Array<{ title: string; repo: string; repoOrg: string; impact: number }>;
};

const contributionIcon = (title: string): string => {
  const lower = title.toLowerCase();
  if (lower.startsWith('feat')) return 'rebase';
  if (lower.startsWith('fix')) return 'bug_report';
  if (lower.startsWith('docs')) return 'terminal';
  return 'code';
};

const TopContributionsCard = ({ contributions = fallbackContributions }: TopContributionsCardProps) => {
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
        {contributions.map((item) => {
          const isFix = item.title.toLowerCase().startsWith('fix');
          const badgeBg = isFix ? alpha(theme.palette.errorContainer, 0.4) : theme.palette.tertiaryContainer;
          const badgeColor = isFix ? theme.palette.error.main : theme.palette.tertiary.main;

          return (
            <ContributionCard
              key={`${item.repoOrg}/${item.repo}:${item.title}`}
              icon={contributionIcon(item.title)}
              iconBgColor={isFix ? alpha(theme.palette.errorContainer, 0.2) : 'primaryContainer'}
              iconColor={isFix ? 'error.main' : 'primary.main'}
              title={item.title}
              repo={item.repo}
              repoOrg={item.repoOrg}
              trailing={
                <Badge bgcolor={badgeBg} color={badgeColor}>
                  +{item.impact.toLocaleString()}
                </Badge>
              }
            />
          );
        })}
        {contributions.length === 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'onSurfaceVariant' }}>
            <Icon name="info" sx={{ fontSize: '1rem' }} />
            <Typography variant="body2">No commit contributions found for this week yet.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TopContributionsCard;
