import { Box, Typography } from "@mui/material"
import type { ReactNode } from "react"

interface FilterSelectProps {
  label: string
  children: ReactNode
}

const FilterSelect = ({ label, children }: FilterSelectProps) => (
  <Box
    sx={{
      bgcolor: "surfaceContainer",
      px: 2,
      py: 1,
      borderRadius: 2,
      display: "flex",
      alignItems: "center",
      gap: 1.5,
    }}
  >
    <Typography
      sx={{
        fontSize: "0.75rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: "onSurfaceVariant",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Typography>
    <Box
      component="select"
      sx={{
        bgcolor: "transparent",
        border: "none",
        fontSize: "0.875rem",
        fontWeight: 600,
        color: "primary.main",
        outline: "none",
        cursor: "pointer",
        p: 0,
        "& option": { bgcolor: "surfaceContainer", color: "onSurface" },
      }}
    >
      {children}
    </Box>
  </Box>
)

export default FilterSelect
