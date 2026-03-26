import { Box, Typography } from "@mui/material"
import ScoreRing from "../../components/ScoreRing"
import { useGlobalIntegrity } from "../../hooks/useRepoMetrics"

const GlobalIntegrityCard = () => {
  const { data, loading, error } = useGlobalIntegrity()
  const score = data?.score ?? 0

  let summary = "Loading repository health metrics..."
  if (error) {
    summary = "Unable to load integrity metrics right now."
  } else if (data) {
    summary = data.summary
  }

  return (
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
            {loading ? "--" : score}
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
        <Typography sx={{ mt: 2, color: "onSurfaceVariant", lineHeight: 1.6 }}>
          {summary}
        </Typography>
      </Box>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <ScoreRing score={score} />
      </Box>
    </Box>
  )
}

export default GlobalIntegrityCard
