import { Box, Tooltip } from "@mui/material"
import { alpha } from "@mui/material/styles"
import type { CommitHistoryCell } from "../../hooks/useCommitMetrics"

interface ContributionGridProps {
  cells?: CommitHistoryCell[]
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
}

const ContributionGrid = ({ cells }: ContributionGridProps) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
    {cells?.map((cell, i) => (
      <Tooltip
        key={i}
        title={`${formatDate(cell.date)}: ${cell.count} commit${cell.count !== 1 ? "s" : ""}`}
        arrow
        placement="top"
      >
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: "2px",
            bgcolor: (theme) =>
              alpha(theme.palette.tertiary.main, Math.max(cell.intensity, 0.05)),
            cursor: "pointer",
          }}
        />
      </Tooltip>
    ))}
  </Box>
)

export default ContributionGrid
