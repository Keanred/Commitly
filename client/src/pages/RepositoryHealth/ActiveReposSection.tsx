import type { ActiveRepo } from '@commitly/schemas';
import { Box, Typography } from '@mui/material';
import HealthRepoCard from '../../components/HealthRepoCard';

interface ActiveReposSectionProps {
  repos: ActiveRepo[];
  loading?: boolean;
}

// eslint-disable-next-line complexity
const languageIcon = (language: string | null): string => {
  switch (language?.toLowerCase()) {
    case 'typescript':
    case 'javascript':
    case 'python':
    case 'java':
    case 'go':
    case 'rust':
    case 'c':
    case 'c++':
    case 'c#':
    case 'ruby':
    case 'swift':
    case 'kotlin':
    case 'php':
      return 'code';
    case 'html':
    case 'css':
    case 'scss':
      return 'web';
    case 'shell':
    case 'bash':
    case 'lua':
      return 'terminal';
    case 'sql':
      return 'database';
    default:
      return 'folder_open';
  }
};

const healthPercentByStatus: Record<ActiveRepo['status'], number> = {
  healthy: 92,
  maintenance: 64,
  failing: 28,
};

const ActiveReposSection = ({ repos, loading = false }: ActiveReposSectionProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 1,
      }}
    >
      <Typography
        sx={{
          fontSize: '0.875rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'onSurfaceVariant',
        }}
      >
        Active Repositories
      </Typography>
      <Typography
        component="button"
        sx={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'primary.main',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        View All
      </Typography>
    </Box>
    {(() => {
      if (loading) {
        return (
          <Typography sx={{ color: 'onSurfaceVariant', fontSize: '0.875rem' }}>
            Loading repository activity...
          </Typography>
        );
      }

      if (repos.length === 0) {
        return (
          <Typography sx={{ color: 'onSurfaceVariant', fontSize: '0.875rem' }}>
            No repositories matched the selected filters.
          </Typography>
        );
      }

      return repos.map((repo) => (
        <HealthRepoCard
          key={repo.name}
          icon={languageIcon(repo.language)}
          name={repo.name}
          language={repo.language ?? 'Unknown'}
          lastCommit={`Last commit: ${repo.lastActivity}`}
          healthPercent={healthPercentByStatus[repo.status]}
        />
      ));
    })()}
  </Box>
);

export default ActiveReposSection;
