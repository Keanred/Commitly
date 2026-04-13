import { Box } from '@mui/material';
import SectionHeader from '../../components/SectionHeader';
import { useWeeklyDigestData } from '../../hooks/useWeeklyDigestData';
import ConsistencyScoreCard from './ConsistencyScoreCard';
import NarrativeSummaryCard from './NarrativeSummaryCard';
import PredictiveOutlookCard from './PredictiveOutlookCard';
import TechStackPulseCard from './TechStackPulseCard';
import TopContributionsCard from './TopContributionsCard';

const formatWeekDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const WeeklyDigest = () => {
  const { data } = useWeeklyDigestData();
  const weekRange = data
    ? `${formatWeekDate(data.weekStart)} - ${formatWeekDate(data.weekEnd)}`
    : 'Weekly digest is preparing your latest coding signals.';
  const subtitle = `${weekRange}. An algorithmic reconstruction of your engineering velocity and architectural impact.`;

  return (
    <>
      <Box component="section" sx={{ mb: 6 }}>
        <SectionHeader title="Weekly Narrative Digest" subtitle={subtitle} />
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 4,
        }}
      >
        {/* Row 1: Narrative + Sidebar cards */}
        <NarrativeSummaryCard />
        <Box
          sx={{
            gridColumn: { xs: 'span 12', lg: 'span 4' },
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <ConsistencyScoreCard score={data?.consistencyScore} bars={data?.consistencyBars} />
          <TechStackPulseCard languages={data?.techStackPulse} />
        </Box>
        {/* Row 2: Contributions + Outlook */}
        <TopContributionsCard contributions={data?.topContributions} />
        <PredictiveOutlookCard />
      </Box>
    </>
  );
};

export default WeeklyDigest;
