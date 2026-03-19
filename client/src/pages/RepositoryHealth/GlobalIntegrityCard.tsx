import { Box, Typography } from "@mui/material"
import ScoreRing from "../../components/ScoreRing"

const GlobalIntegrityCard = () => (
  <Box
    sx={{
      bgcolor: "surfaceContainerLow",
      borderRadius: 3,
      p: 4,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderLeft: 4,
      borderColor: "tertiary.main",
      boxShadow: 6,
    }}
  >
    <Box sx={{ maxWidth: 420 }}>
      <Typography
        sx={{
          color: "tertiary.main",
          fontFamily: "'Manrope'",
          fontSize: "1.125rem",
          fontWeight: 700,
          mb: 2,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        Global Integrity Score
      </Typography>
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
        <Typography
          sx={{
            fontSize: "4.5rem",
            fontFamily: "'Manrope'",
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          94
        </Typography>
        <Typography
          sx={{
            fontSize: "1.5rem",
            color: "onSurfaceVariant",
            fontWeight: 500,
          }}
        >
          /100
        </Typography>
      </Box>
      <Typography
        sx={{ mt: 2, color: "onSurfaceVariant", lineHeight: 1.6 }}
      >
        Your ecosystem is operating at peak efficiency.{" "}
        <Box component="span" sx={{ color: "tertiary.main" }}>
          3 repos
        </Box>{" "}
        require minor documentation updates to reach 100%.
      </Typography>
    </Box>
    <Box sx={{ display: { xs: "none", md: "block" } }}>
      <ScoreRing score={94} />
    </Box>
  </Box>
)

export default GlobalIntegrityCard
