import { Box, Typography } from "@mui/material"
import Icon from "../Icon"

interface StatCardProps {
  label: string
  value: string | number
  trend?: {
    value: string
    direction: "up" | "down"
  }
}

const StatCard = ({ label, value, trend }: StatCardProps) => {
  const trendColor =
    trend?.direction === "up" ? "tertiary.main" : "error.main"
  const trendIcon =
    trend?.direction === "up" ? "trending_up" : "trending_down"

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Typography
        variant="caption"
        sx={{ color: "onSurfaceVariant", fontWeight: 500 }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: "1.5rem",
          fontFamily: "'Manrope'",
          fontWeight: 900,
          color: "onSurface",
        }}
      >
        {value}
      </Typography>
      {trend && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            color: trendColor,
          }}
        >
          <Icon name={trendIcon} sx={{ fontSize: 12 }} />
          <Typography sx={{ fontSize: "10px", fontWeight: 700 }}>
            {trend.value}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default StatCard
