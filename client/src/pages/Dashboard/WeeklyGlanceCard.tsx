import { Box, Typography } from "@mui/material"
import { alpha } from "@mui/material/styles"
import StatCard from "../../components/StatCard"
import Badge from "../../components/Badge"
import SectionHeader from "../../components/SectionHeader"

const WeeklyGlanceCard = () => (
  <Box
    sx={{
      gridColumn: { xs: "span 12", lg: "span 7" },
      bgcolor: "surfaceContainerLow",
      borderRadius: 3,
      p: 4,
      border: "1px solid",
      borderColor: (theme) => alpha(theme.palette.outline, 0.1),
    }}
  >
    <SectionHeader
      variant="h6"
      title="Last Week at a Glance"
      trailing={
        <Badge
          bgcolor="onTertiaryFixedVariant"
          color="tertiary.main"
          pill
          sx={{ fontSize: "10px" }}
        >
          +12% Velocity
        </Badge>
      }
    />
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 4,
      }}
    >
      <StatCard
        label="Commits"
        value={142}
        trend={{ value: "8.2%", direction: "up" }}
      />
      <StatCard
        label="PRs Merged"
        value={28}
        trend={{ value: "12%", direction: "up" }}
      />
      <StatCard
        label="Code Quality"
        value="94%"
        trend={{ value: "2.1%", direction: "down" }}
      />
    </Box>
    <Box
      sx={{
        mt: 4,
        pt: 3,
        borderTop: "1px solid",
        borderColor: "divider",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box sx={{ display: "flex" }}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              bgcolor: "surfaceBright",
              border: "2px solid",
              borderColor: "surfaceContainerLow",
              ml: i > 0 ? -1 : 0,
            }}
          />
        ))}
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            bgcolor: "surfaceBright",
            border: "2px solid",
            borderColor: "surfaceContainerLow",
            ml: -1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            fontWeight: 700,
          }}
        >
          +4
        </Box>
      </Box>
      <Typography
        component="button"
        sx={{
          color: "primary.main",
          fontSize: "0.75rem",
          fontWeight: 700,
          background: "none",
          border: "none",
          cursor: "pointer",
          "&:hover": { textDecoration: "underline" },
        }}
      >
        View Team Activity
      </Typography>
    </Box>
  </Box>
)

export default WeeklyGlanceCard
