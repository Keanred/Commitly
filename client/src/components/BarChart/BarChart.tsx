import { Box, Typography } from "@mui/material"
import { alpha } from "@mui/material/styles"

interface BarChartBar {
  value: number
  label: string
}

interface BarChartProps {
  bars: BarChartBar[]
  height?: number
  color?: string
  activeIndices?: number[]
}

const BarChart = ({
  bars,
  height = 64,
  color = "tertiary.main",
  activeIndices,
}: BarChartProps) => (
  <Box>
    <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, height }}>
      {bars.map((bar, i) => {
        const isActive =
          activeIndices == null || activeIndices.includes(i)
        return (
          <Box
            key={i}
            sx={{
              width: "100%",
              height: `${bar.value}%`,
              bgcolor: (theme) => {
                const resolved =
                  color === "tertiary.main"
                    ? theme.palette.tertiary.main
                    : color === "primary.main"
                      ? theme.palette.primary.main
                      : color
                return isActive ? resolved : alpha(resolved, 0.2)
              },
              borderTopLeftRadius: 2,
              borderTopRightRadius: 2,
            }}
          />
        )
      })}
    </Box>
    <Box
      sx={{
        mt: 1,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {bars.map((bar, i) => (
        <Typography
          key={i}
          sx={{
            fontSize: "10px",
            color: "onSurfaceVariant",
            opacity: 0.5,
            textAlign: "center",
            width: "100%",
          }}
        >
          {bar.label}
        </Typography>
      ))}
    </Box>
  </Box>
)

export default BarChart
