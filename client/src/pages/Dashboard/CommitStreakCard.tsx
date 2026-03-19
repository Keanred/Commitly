import { Box, Typography } from "@mui/material"
import ContributionGrid from "../../components/ContributionGrid"
import Icon from "../../components/Icon"

const CommitStreakCard = () => (
  <Box
    sx={{
      gridColumn: { xs: "span 12", lg: "span 8" },
      bgcolor: "surfaceContainerLow",
      borderRadius: 3,
      p: 3,
      position: "relative",
      overflow: "hidden",
      "&:hover .streak-icon": { opacity: 0.2 },
    }}
  >
    <Box sx={{ position: "relative", zIndex: 1 }}>
      <Typography
        variant="overline"
        sx={{ color: "onSurfaceVariant", mb: 2, display: "block" }}
      >
        Current Commit Streak
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          gap: 1,
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: "3rem",
            fontFamily: "'Manrope'",
            fontWeight: 900,
            color: "primary.main",
            lineHeight: 1,
          }}
        >
          14
        </Typography>
        <Typography sx={{ color: "onSurfaceVariant", fontWeight: 500 }}>
          Days active
        </Typography>
      </Box>
      <ContributionGrid />
    </Box>
    <Box
      className="streak-icon"
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        p: 4,
        opacity: 0.1,
        transition: "opacity 0.3s",
      }}
    >
      <Icon name="local_fire_department" filled sx={{ fontSize: "9rem" }} />
    </Box>
  </Box>
)

export default CommitStreakCard
