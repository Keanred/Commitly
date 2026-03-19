import { alpha, Box } from "@mui/material"
import DashboardLayout from "../../components/DashboardLayout"
import SectionHeader from "../../components/SectionHeader"
import FilterSelect from "../../components/FilterSelect"
import MetricCard from "../../components/MetricCard"
import GlobalIntegrityCard from "./GlobalIntegrityCard"
import ActiveReposSection from "./ActiveReposSection"
import NeglectedReposSection from "./NeglectedReposSection"

const RepositoryHealth = () => (
  <DashboardLayout activeNav="Repo Health">
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <SectionHeader
        title="Repository Health"
        subtitle="Real-time architectural integrity and contribution velocity."
        trailing={
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <FilterSelect label="Filter Language">
              <option>All Languages</option>
              <option>TypeScript</option>
              <option>Rust</option>
              <option>Go</option>
            </FilterSelect>
            <FilterSelect label="Project Type">
              <option>Production</option>
              <option>Internal Tools</option>
              <option>Experimental</option>
            </FilterSelect>
          </Box>
        }
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "repeat(12, 1fr)" },
          gap: 3,
        }}
      >
        {/* Hero: Global Integrity Score */}
        <Box sx={{ gridColumn: { lg: "span 8" } }}>
          <GlobalIntegrityCard />
        </Box>

        {/* Side metrics */}
        <Box
          sx={{
            gridColumn: { lg: "span 4" },
            display: "grid",
            gridTemplateRows: "1fr 1fr",
            gap: 3,
          }}
        >
          <MetricCard
            label="Active Repos"
            value={42}
            status="+12% vs last month"
            statusColor="tertiary.main"
          />
          <MetricCard
            label="Stale Branches"
            value={128}
            status="Critical Action"
            statusColor="error.main"
            sx={(theme) => ({
              borderBottom: 4,
              borderColor: alpha(theme.palette.error.main, 0.3),
            })}
          />
        </Box>

        {/* Active Repositories */}
        <Box sx={{ gridColumn: { xs: "1 / -1", xl: "span 7" } }}>
          <ActiveReposSection />
        </Box>

        {/* Neglected Repositories */}
        <Box sx={{ gridColumn: { xs: "1 / -1", xl: "span 5" } }}>
          <NeglectedReposSection />
        </Box>
      </Box>
    </Box>
  </DashboardLayout>
)

export default RepositoryHealth
