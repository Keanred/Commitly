import { Box } from "@mui/material"
import { alpha } from "@mui/material/styles"

interface ContributionGridProps {
  cells?: number[]
}

const DEFAULT_CELLS = [
  0.2, 0.4, 1, 0.1, 0.6, 1, 0.8, 0.2, 1, 0.4, 1, 0.6, 0.2, 1, 0.4, 0.8,
  0.1, 0.6, 1, 0.2, 0.8, 1, 0.4, 0.6, 0.2, 1, 0.4, 0.8, 0.1, 0.6, 1, 0.2,
  0.8, 1, 0.4, 0.6, 0.2, 1, 0.4, 0.8, 0.1, 0.6, 1, 0.2, 0.8, 1, 0.4, 0.6,
  0.2, 1,
]

const ContributionGrid = ({ cells = DEFAULT_CELLS }: ContributionGridProps) => {(
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
    {cells.map((intensity, i) => (
      <Box
        key={i}
        sx={{
          width: 12,
          height: 12,
          borderRadius: "2px",
          bgcolor: (theme) => alpha(theme.palette.tertiary.main, intensity),
        }}
      />
    ))}
  </Box>
)}

export default ContributionGrid
