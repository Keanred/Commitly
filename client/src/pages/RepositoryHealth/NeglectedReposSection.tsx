import type { ActiveRepo, StaleBranchesResponse } from '@commitly/schemas';
import { alpha, Box, Typography } from '@mui/material';
import Icon from '../../components/Icon';
import StatusListItem from '../../components/StatusListItem';

interface NeglectedReposSectionProps {
  neglectedRepos: ActiveRepo[];
  staleBranches: StaleBranchesResponse | null;
  loading?: boolean;
}

const parseLastActivityDays = (lastActivity: string): number | null => {
  const normalized = lastActivity.toLowerCase().trim();
  const match = normalized.match(/(\d+)\s*([mhd])/);
  if (!match) return null;
  const value = Number(match[1]);
  const unit = match[2];
  if (unit === 'm') return value / (60 * 24);
  if (unit === 'h') return value / 24;
  return value;
};

const formatDaysSilent = (lastActivity: string): string => {
  const days = parseLastActivityDays(lastActivity);
  if (days === null) return 'Stale';
  if (days < 1) return '<1 Day Silent';
  return `${Math.max(1, Math.round(days))} Days Silent`;
};

const formatBranchAge = (lastCommitDate: string | null): string => {
  if (!lastCommitDate) return 'Unknown';
  const diffMs = Date.now() - new Date(lastCommitDate).getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / 86400000));
  if (diffDays >= 365) return `${(diffDays / 365).toFixed(1)} yrs`;
  if (diffDays >= 30) return `${Math.floor(diffDays / 30)} mos`;
  return `${diffDays} days`;
};

const NeglectedReposSection = ({ neglectedRepos, staleBranches, loading = false }: NeglectedReposSectionProps) => {
  const staleBranchRows = Object.entries(staleBranches ?? {})
    .flatMap(([repoName, branches]) =>
      branches.map((branch) => ({
        name: `${repoName}:${branch.branch}`,
        age: formatBranchAge(branch.lastCommitDate),
      })),
    )
    .sort((a, b) => {
      const aDays = Number(a.age.match(/(\d+)/)?.[1] ?? 0);
      const bDays = Number(b.age.match(/(\d+)/)?.[1] ?? 0);
      return bDays - aDays;
    })
    .slice(0, 6);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Neglected header */}
      <Typography
        sx={{
          fontSize: '0.875rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'error.main',
          mb: 1,
        }}
      >
        Neglected (&gt;3 Months)
      </Typography>

      {/* Neglected repos list */}
      <Box
        sx={{
          bgcolor: 'surfaceContainerLow',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        {(() => {
          if (loading) {
            return (
              <Typography sx={{ p: 2, color: 'onSurfaceVariant', fontSize: '0.875rem' }}>
                Loading neglected repositories...
              </Typography>
            );
          }

          if (neglectedRepos.length === 0) {
            return (
              <Typography sx={{ p: 2, color: 'onSurfaceVariant', fontSize: '0.875rem' }}>
                No neglected repositories above the threshold.
              </Typography>
            );
          }

          return neglectedRepos.map((repo, i) => (
            <Box
              key={repo.name}
              sx={(theme) => ({
                bgcolor: alpha(theme.palette.error.main, 0.05),
                ...(i < neglectedRepos.length - 1 && {
                  borderBottom: 1,
                  borderColor: alpha(theme.palette.outlineVariant, 0.1),
                }),
              })}
            >
              <StatusListItem label={repo.name} status={formatDaysSilent(repo.lastActivity)} pulse={i === 0} />
            </Box>
          ));
        })()}
      </Box>

      {/* Stale Branches */}
      <Box sx={{ mt: 4 }}>
        <Typography
          sx={{
            fontSize: '0.875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'onSurfaceVariant',
            mb: 2,
          }}
        >
          Stale Branches
        </Typography>
        <Box sx={{ bgcolor: 'surfaceContainer', borderRadius: 3, p: 0.5 }}>
          <Box component="table" sx={{ width: '100%', textAlign: 'left' }}>
            <Box component="thead">
              <Box component="tr" sx={{ color: 'text.disabled' }}>
                <Box
                  component="th"
                  sx={{
                    px: 2,
                    py: 1.5,
                    fontSize: '10px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                  }}
                >
                  Branch Name
                </Box>
                <Box
                  component="th"
                  sx={{
                    px: 2,
                    py: 1.5,
                    fontSize: '10px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                  }}
                >
                  Age
                </Box>
                <Box
                  component="th"
                  sx={{
                    px: 2,
                    py: 1.5,
                    fontSize: '10px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    textAlign: 'right',
                  }}
                >
                  Action
                </Box>
              </Box>
            </Box>
            <Box component="tbody">
              {staleBranchRows.map((branch) => (
                <Box
                  component="tr"
                  key={branch.name}
                  sx={{
                    color: 'onSurface',
                    '&:hover': { bgcolor: 'surfaceContainerHigh' },
                    transition: 'background-color 0.15s',
                  }}
                >
                  <Box
                    component="td"
                    sx={{
                      px: 2,
                      py: 1.5,
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                    }}
                  >
                    {branch.name}
                  </Box>
                  <Box component="td" sx={{ px: 2, py: 1.5, fontSize: '0.75rem' }}>
                    {branch.age}
                  </Box>
                  <Box component="td" sx={{ px: 2, py: 1.5, textAlign: 'right' }}>
                    <Box
                      component="button"
                      sx={{
                        background: 'none',
                        border: 'none',
                        color: 'primary.main',
                        cursor: 'pointer',
                        p: 0,
                        '&:hover': { color: 'text.primary' },
                      }}
                    >
                      <Icon name="delete" sx={{ fontSize: '1.125rem' }} />
                    </Box>
                  </Box>
                </Box>
              ))}
              {!loading && staleBranchRows.length === 0 ? (
                <Box component="tr">
                  <Box component="td" colSpan={3} sx={{ px: 2, py: 2, color: 'onSurfaceVariant', fontSize: '0.75rem' }}>
                    No stale branches found.
                  </Box>
                </Box>
              ) : null}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NeglectedReposSection;
