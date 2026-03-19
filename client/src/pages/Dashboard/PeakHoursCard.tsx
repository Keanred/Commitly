import { Box, Typography } from "@mui/material"
import ProgressBar from "../../components/ProgressBar"

const PeakHoursCard = () => (
  <Box
    sx={{
      gridColumn: { xs: "span 12", lg: "span 4" },
      bgcolor: "surfaceContainer",
      borderRadius: 3,
      p: 3,
      borderLeft: "4px solid",
      borderColor: "primary.main",
    }}
  >
    <Typography
      variant="overline"
      sx={{ color: "onSurfaceVariant", mb: 3, display: "block" }}
    >
      Peak Coding Hours
    </Typography>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <ProgressBar label="10PM" percentage={85} />
      <ProgressBar label="11PM" percentage={95} />
      <ProgressBar label="12AM" percentage={70} />
      <ProgressBar label="01AM" percentage={40} color="onPrimaryContainer" />
    </Box>
    <Typography
      variant="caption"
      sx={{
        color: "onSurfaceVariant",
        fontStyle: "italic",
        mt: 3,
        display: "block",
      }}
    >
      Most active during &quot;Deep Focus&quot; night windows.
    </Typography>
  </Box>
)

export default PeakHoursCard
