import { Box, Typography } from "@mui/material"
import Icon from "../../components/Icon"

const NarrativeSummaryCard = () => (
  <Box
    sx={{
      gridColumn: { xs: "span 12", lg: "span 8" },
      bgcolor: "surfaceContainerLow",
      p: 4,
      borderRadius: 3,
      borderLeft: "4px solid",
      borderColor: "primary.main",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Decorative background icon */}
    <Box
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        p: 2,
        opacity: 0.1,
      }}
    >
      <Icon name="auto_awesome" sx={{ fontSize: "6rem" }} />
    </Box>

    {/* Label */}
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
      <Typography
        sx={{
          color: "primary.main",
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        Executive Summary
      </Typography>
    </Box>

    {/* Narrative text */}
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        fontFamily: "'Manrope'",
        lineHeight: 1.7,
        fontSize: "1.25rem",
        color: "onSurface",
        opacity: 0.9,
      }}
    >
      <Typography sx={{ fontFamily: "inherit", fontSize: "inherit", lineHeight: "inherit" }}>
        This week, your focus pivoted sharply toward{" "}
        <Typography component="span" sx={{ color: "tertiary.main", fontFamily: "inherit", fontSize: "inherit" }}>
          infrastructure stability
        </Typography>
        . After Monday's surge in technical debt reduction, you successfully
        refactored the core authentication middleware—reducing latency by 14%.
      </Typography>
      <Typography sx={{ fontFamily: "inherit", fontSize: "inherit", lineHeight: "inherit" }}>
        Your contribution pattern suggests a "Deep Work" preference during
        mid-day blocks. Notably, you closed{" "}
        <Typography component="span" sx={{ color: "primary.main", fontFamily: "inherit", fontSize: "inherit" }}>
          14 high-priority PRs
        </Typography>
        , most of which focused on the new GraphQL orchestration layer. The
        team's velocity was positively influenced by your detailed documentation
        updates on Wednesday.
      </Typography>
      <Typography
        sx={{
          fontFamily: "inherit",
          fontSize: "1.125rem",
          lineHeight: "inherit",
          color: "onSurfaceVariant",
          fontStyle: "italic",
        }}
      >
        "You are currently pacing 20% faster than your rolling 4-week average."
      </Typography>
    </Box>
  </Box>
)

export default NarrativeSummaryCard
