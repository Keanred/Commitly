import { Box } from "@mui/material"
import DashboardLayout from "../../components/DashboardLayout"
import SectionHeader from "../../components/SectionHeader"
import NarrativeSummaryCard from "./NarrativeSummaryCard"
import ConsistencyScoreCard from "./ConsistencyScoreCard"
import TechStackPulseCard from "./TechStackPulseCard"
import TopContributionsCard from "./TopContributionsCard"
import PredictiveOutlookCard from "./PredictiveOutlookCard"

const WeeklyDigest = () => (
  <DashboardLayout activeNav="Weekly Digest">
    <Box component="section" sx={{ mb: 6 }}>
      <SectionHeader
        title="Weekly Narrative Digest"
        subtitle="March 11 — March 17, 2024. An algorithmic reconstruction of your engineering velocity and architectural impact."
      />
    </Box>

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: 4,
      }}
    >
      {/* Row 1: Narrative + Sidebar cards */}
      <NarrativeSummaryCard />

      <Box
        sx={{
          gridColumn: { xs: "span 12", lg: "span 4" },
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <ConsistencyScoreCard />
        <TechStackPulseCard />
      </Box>

      {/* Row 2: Contributions + Outlook */}
      <TopContributionsCard />
      <PredictiveOutlookCard />
    </Box>
  </DashboardLayout>
)

export default WeeklyDigest
