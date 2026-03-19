import { Box } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import Icon from "../Icon"

interface ScoreRingProps {
  score: number
  max?: number
  size?: number
  thickness?: number
  color?: string
  icon?: string
}

const ScoreRing = ({
  score,
  max = 100,
  size = 192,
  thickness = 12,
  color = "tertiary.main",
  icon = "verified",
}: ScoreRingProps) => {
  const theme = useTheme()
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - score / max)

  return (
    <Box
      sx={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width={size}
        height={size}
        style={{ position: "absolute", transform: "rotate(-90deg)" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={theme.palette.surfaceContainerHighest}
          strokeWidth={thickness}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
          stroke="currentColor"
        />
      </svg>
      <Box sx={{ color, position: "relative", zIndex: 1 }}>
        <Icon name={icon} sx={{ fontSize: "3rem" }} />
      </Box>
    </Box>
  )
}

export default ScoreRing
