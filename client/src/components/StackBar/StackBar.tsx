import { Box, Typography } from "@mui/material"

interface StackBarProps {
  label: string
  percentage: number
  color?: string
}

const StackBar = ({
  label,
  percentage,
  color = "primary.main",
}: StackBarProps) => (
  <Box>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        mb: 0.5,
        fontSize: "0.75rem",
      }}
    >
      <Typography sx={{ fontSize: "0.75rem", fontWeight: 500 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: "0.75rem", color: "onSurfaceVariant" }}>
        {percentage}%
      </Typography>
    </Box>
    <Box
      sx={{
        height: 6,
        width: "100%",
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
        }}
      />
    </Box>
  </Box>
)

export default StackBar
