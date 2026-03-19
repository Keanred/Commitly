import { Box, Typography } from "@mui/material"
import HealthRepoCard from "../../components/HealthRepoCard"

const repos = [
  {
    icon: "code",
    iconBgColor: "primaryContainer",
    iconColor: "primary.main",
    name: "commitly-core-engine",
    language: "Rust",
    languageColor: "tertiary.main",
    lastCommit: "Last commit: 14 mins ago by @arch_linux_dev",
    healthPercent: 92,
  },
  {
    icon: "terminal",
    iconBgColor: "surfaceContainerHigh",
    iconColor: "onSurfaceVariant",
    name: "analytics-dash-v3",
    language: "TypeScript",
    languageColor: "primary.main",
    lastCommit: "Last commit: 3 hours ago by @sarah_codes",
    healthPercent: 88,
  },
  {
    icon: "api",
    iconBgColor: "surfaceContainerHigh",
    iconColor: "onSurfaceVariant",
    name: "public-api-gateway",
    language: "Go",
    languageColor: "secondary.main",
    lastCommit: "Last commit: 6 hours ago by @engineer_prime",
    healthPercent: 96,
  },
]

const ActiveReposSection = () => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 1,
      }}
    >
      <Typography
        sx={{
          fontSize: "0.875rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "onSurfaceVariant",
        }}
      >
        Active Repositories
      </Typography>
      <Typography
        component="button"
        sx={{
          fontSize: "0.75rem",
          fontWeight: 700,
          color: "primary.main",
          background: "none",
          border: "none",
          cursor: "pointer",
          "&:hover": { textDecoration: "underline" },
        }}
      >
        View All
      </Typography>
    </Box>
    {repos.map((repo) => (
      <HealthRepoCard key={repo.name} {...repo} />
    ))}
  </Box>
)

export default ActiveReposSection
