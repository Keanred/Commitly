import { Box, Typography } from "@mui/material"

interface ProgressBarProps {
  label: string
  percentage: number
  color?: string
}

const ProgressBar = ({
  label,
  percentage,
  color = "primary.main",
}: ProgressBarProps) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
    <Typography
      sx={{
        width: 48,
        fontSize: "0.75rem",
        fontFamily: "monospace",
        color: "onSurfaceVariant",
        flexShrink: 0,
      }}
    >
      {label}
    </Typography>
    <Box
      sx={{
        flex: 1,
        height: 12,
        bgcolor: "surfaceContainerHigh",
        borderRadius: 50,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          height: "100%",
          bgcolor: color,
          width: `${percentage}%`,
          borderRadius: 50,
        }}
      />
    </Box>
    <Typography
      sx={{
        fontSize: "0.75rem",
        fontWeight: 700,
        color,
        minWidth: 32,
        textAlign: "right",
      }}
    >
      {percentage}%
    </Typography>
  </Box>
)

export default ProgressBar
