import { Box, Typography } from "@mui/material"
import type { SxProps, Theme } from "@mui/material/styles"

interface MetricCardProps {
  label: string
  value: string | number
  status?: string
  statusColor?: string
  sx?: SxProps<Theme>
}

const MetricCard = ({
  label,
  value,
  status,
  statusColor = "onSurfaceVariant",
  sx,
}: MetricCardProps) => (
  <Box
    sx={[
      {
        bgcolor: "surfaceContainer",
        borderRadius: 3,
        p: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      },
      ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
    ]}
  >
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 0.5,
      }}
    >
      <Typography
        sx={{
          fontSize: "0.75rem",
          fontWeight: 700,
          color: "onSurfaceVariant",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
      {status && (
        <Typography
          sx={{
            fontSize: "0.75rem",
            fontWeight: 700,
            color: statusColor,
          }}
        >
          {status}
        </Typography>
      )}
    </Box>
    <Typography
      sx={{
        fontSize: "1.875rem",
        fontFamily: "'Manrope'",
        fontWeight: 700,
        color: "onSurface",
      }}
    >
      {value}
    </Typography>
  </Box>
)

export default MetricCard
