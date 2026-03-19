import { Box, Typography } from "@mui/material"
import { alpha, useTheme } from "@mui/material/styles"

const LABELS = [
  { text: "MON", top: 0, left: "50%", transform: "translate(-50%, -16px)" },
  { text: "TUE", top: "25%", right: 0, transform: "translateX(16px)" },
  { text: "WED", bottom: 0, right: 16, transform: "translateY(16px)" },
  { text: "THU", bottom: 0, left: 16, transform: "translateY(16px)" },
  { text: "FRI", top: "25%", left: 0, transform: "translateX(-16px)" },
] as const

const ProductiveDaysCard = () => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        gridColumn: { xs: "span 12", lg: "span 5" },
        bgcolor: "surfaceContainer",
        borderRadius: 3,
        p: 3,
      }}
    >
      <Typography
        variant="overline"
        sx={{ color: "onSurfaceVariant", mb: 2, display: "block" }}
      >
        Productive Days
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <Box sx={{ position: "relative", width: 192, height: 192 }}>
          <svg
            viewBox="0 0 100 100"
            style={{ width: "100%", height: "100%" }}
          >
            <polygon
              points="50,5 95,35 80,85 20,85 5,35"
              fill="none"
              stroke={theme.palette.outlineVariant}
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
            <polygon
              points="50,20 85,45 70,75 30,75 15,45"
              fill="none"
              stroke={theme.palette.outlineVariant}
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
            <polygon
              points="50,10 90,40 70,80 40,70 10,30"
              fill={alpha(theme.palette.primary.main, 0.2)}
              stroke={theme.palette.primary.main}
              strokeWidth="2"
            />
          </svg>
          {LABELS.map(({ text, transform, ...pos }) => (
            <Box
              key={text}
              sx={{
                position: "absolute",
                ...pos,
                transform,
                fontSize: "10px",
                fontWeight: 700,
                color: "onSurface",
              }}
            >
              {text}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default ProductiveDaysCard
