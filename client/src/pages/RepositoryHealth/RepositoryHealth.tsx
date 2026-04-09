import { alpha, Box, Button } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import FilterSelect from '../../components/FilterSelect';
import MetricCard from '../../components/MetricCard';
import SectionHeader from '../../components/SectionHeader';
import { useActiveRepos, useStaleBranches } from '../../hooks/useRepoMetrics';
import ActiveReposSection from './ActiveReposSection';
import GlobalIntegrityCard from './GlobalIntegrityCard';
import NeglectedReposSection from './NeglectedReposSection';

const DEFAULT_LANGUAGE_FILTER = 'All Languages';
const DEFAULT_STATE_FILTER = 'All';

const getInitialFilterValue = (key: string, fallback: string): string => {
  if (typeof window === 'undefined') return fallback;
  const value = new URLSearchParams(window.location.search).get(key);
  return value ?? fallback;
};

const stateFilterToStatus = (state: string): 'healthy' | 'maintenance' | 'failing' | null => {
  if (state === 'Stable') return 'healthy';
  if (state === 'Watchlist') return 'maintenance';
  if (state === 'Critical') return 'failing';
  return null;
};

const RepositoryHealth = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(() =>
    getInitialFilterValue('lang', DEFAULT_LANGUAGE_FILTER),
  );
  const [selectedState, setSelectedState] = useState(() => getInitialFilterValue('state', DEFAULT_STATE_FILTER));

  const { data: activeRepos, loading: activeReposLoading } = useActiveRepos();
  const { data: staleBranches, loading: staleBranchesLoading } = useStaleBranches();

  const languageOptions = useMemo(() => {
    const names = Array.from(
      new Set((activeRepos ?? []).map((repo) => repo.language).filter((language): language is string => !!language)),
    ).sort();
    return [DEFAULT_LANGUAGE_FILTER, ...names];
  }, [activeRepos]);

  useEffect(() => {
    if (selectedLanguage !== DEFAULT_LANGUAGE_FILTER && !languageOptions.includes(selectedLanguage)) {
      setSelectedLanguage(DEFAULT_LANGUAGE_FILTER);
    }
  }, [languageOptions, selectedLanguage]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);

    if (selectedLanguage === DEFAULT_LANGUAGE_FILTER) url.searchParams.delete('lang');
    else url.searchParams.set('lang', selectedLanguage);

    if (selectedState === DEFAULT_STATE_FILTER) url.searchParams.delete('state');
    else url.searchParams.set('state', selectedState);

    window.history.replaceState(null, '', `${url.pathname}${url.search}`);
  }, [selectedLanguage, selectedState]);

  const statusFilter = stateFilterToStatus(selectedState);
  const filteredRepos = (activeRepos ?? []).filter((repo) => {
    const matchesLanguage = selectedLanguage === DEFAULT_LANGUAGE_FILTER || repo.language === selectedLanguage;
    const matchesStatus = !statusFilter || repo.status === statusFilter;
    return matchesLanguage && matchesStatus;
  });

  const neglectedRepos = filteredRepos
    .filter((repo) => repo.status === 'failing')
    .sort((a, b) => {
      const aDays = Number(a.lastActivity.match(/(\d+)d/)?.[1] ?? 0);
      const bDays = Number(b.lastActivity.match(/(\d+)d/)?.[1] ?? 0);
      return bDays - aDays;
    })
    .slice(0, 6);

  const activeCount = filteredRepos.filter((repo) => repo.status === 'healthy').length;
  const staleBranchCount = Object.values(staleBranches ?? {}).reduce((sum, branches) => sum + branches.length, 0);
  const hasActiveFilters = selectedLanguage !== DEFAULT_LANGUAGE_FILTER || selectedState !== DEFAULT_STATE_FILTER;

  const resetFilters = () => {
    setSelectedLanguage(DEFAULT_LANGUAGE_FILTER);
    setSelectedState(DEFAULT_STATE_FILTER);
  };

  return (
    <>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <SectionHeader
          title="Repository Health"
          subtitle="Real-time architectural integrity and contribution velocity."
          trailing={
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
              <FilterSelect
                label="Filter Language"
                value={selectedLanguage}
                onChange={(value) => setSelectedLanguage(value)}
              >
                {languageOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </FilterSelect>
              <FilterSelect
                label="Repository State"
                value={selectedState}
                onChange={(value) => setSelectedState(value)}
              >
                <option>All</option>
                <option>Stable</option>
                <option>Watchlist</option>
                <option>Critical</option>
              </FilterSelect>
              <Button
                size="small"
                variant="text"
                onClick={resetFilters}
                disabled={!hasActiveFilters}
                sx={{
                  minWidth: 'auto',
                  px: 1,
                  color: hasActiveFilters ? 'primary.main' : 'onSurfaceVariant',
                }}
              >
                Clear Filters
              </Button>
            </Box>
          }
        />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'repeat(12, 1fr)' },
            gap: 3,
          }}
        >
          {/* Hero: Global Integrity Score */}
          <Box sx={{ gridColumn: { lg: 'span 8' } }}>
            <GlobalIntegrityCard />
          </Box>
          {/* Side metrics */}
          <Box
            sx={{
              gridColumn: { lg: 'span 4' },
              display: 'grid',
              gridTemplateRows: '1fr 1fr',
              gap: 3,
            }}
          >
            <MetricCard
              label="Active Repos"
              value={activeReposLoading ? '--' : activeCount}
              status={`${filteredRepos.length} visible`}
              statusColor="primary.main"
            />
            <MetricCard
              label="Stale Branches"
              value={staleBranchesLoading ? '--' : staleBranchCount}
              status={staleBranchCount > 0 ? 'Critical Action' : 'Healthy'}
              statusColor="error.main"
              sx={(theme) => ({
                borderBottom: 4,
                borderColor: alpha(theme.palette.error.main, 0.3),
              })}
            />
          </Box>
          {/* Active Repositories */}
          <Box sx={{ gridColumn: { xs: '1 / -1', xl: 'span 7' } }}>
            <ActiveReposSection repos={filteredRepos.slice(0, 8)} loading={activeReposLoading} />
          </Box>
          {/* Neglected Repositories */}
          <Box sx={{ gridColumn: { xs: '1 / -1', xl: 'span 5' } }}>
            <NeglectedReposSection
              neglectedRepos={neglectedRepos}
              staleBranches={staleBranches ?? null}
              loading={activeReposLoading || staleBranchesLoading}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default RepositoryHealth;
