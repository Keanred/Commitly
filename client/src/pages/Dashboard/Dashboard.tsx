import { Box, Typography } from "@mui/material"
import { alpha, useTheme } from "@mui/material/styles"
import DashboardLayout from "../../components/DashboardLayout"
import RepoCard from "../../components/RepoCard"
import SectionHeader from "../../components/SectionHeader"
import Badge from "../../components/Badge"
import CommitStreakCard from "./CommitStreakCard"
import PeakHoursCard from "./PeakHoursCard"
import ProductiveDaysCard from "./ProductiveDaysCard"
import WeeklyGlanceCard from "./WeeklyGlanceCard"
import { useAuth } from "../../AuthContext"
import LoadingScreen from "../LoadingScreen"

const Dashboard: React.FC = () => {
  const theme = useTheme()
  const { user, loading, error } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }
  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error">
          Error loading user data: {error.message}
        </Typography>
      </Box>
    )
  }

  return (
  <DashboardLayout>
    {/* Engineering Overview */}
    <Box component="section" sx={{ mb: 6 }}>
      <SectionHeader
        title="Engineering Overview"
        subtitle={
          <>
            Real-time performance metrics for{" "}
            <Typography
              component="span"
              sx={{ color: "primary.main", fontFamily: "monospace" }}
            >
              commitly-core
            </Typography>
          </>
        }
        trailing={
          <Badge
            sx={{
              border: "1px solid",
              borderColor: alpha(theme.palette.outline, 0.2),
            }}
          >
            LAST 7 DAYS
          </Badge>
        }
      />

      {/* Bento Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: 3,
        }}
      >
        <CommitStreakCard />
        <PeakHoursCard />
        <ProductiveDaysCard />
        <WeeklyGlanceCard />
      </Box>
    </Box>

    {/* Active Repositories */}
    <Box component="section">
      <SectionHeader
        title="Active Repositories"
        variant="h6"
        trailing={
          <Typography
            component="button"
            sx={{
              color: "onSurfaceVariant",
              fontSize: "0.875rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              transition: "color 0.2s",
              "&:hover": { color: "onSurface" },
            }}
          >
            Manage Fleet
          </Typography>
        }
      />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 3,
        }}
      >
        <RepoCard
          icon="folder_open"
          status="healthy"
          name="commitly-web-client"
          description="React + Tailwind UI Layer"
          branch="main"
          lastActivity="2m ago"
        />
        <RepoCard
          icon="terminal"
          status="maintenance"
          name="api-gateway-service"
          description="Rust-based high speed proxy"
          branch="staging"
          lastActivity="1h ago"
        />
        <RepoCard
          icon="database"
          status="failing"
          name="data-lake-indexer"
          description="Vector DB sync routines"
          branch="feat/async-v2"
          lastActivity="8m ago"
        />
      </Box>
    </Box>
  </DashboardLayout>
  )
}

export default Dashboard
