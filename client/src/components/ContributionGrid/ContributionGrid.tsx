import { Box, Typography } from "@mui/material"
import { alpha } from "@mui/material/styles"
import { memo, useMemo } from "react"
import type { CommitHistoryCell } from "../../hooks/useCommitMetrics"

interface ContributionGridProps {
  cells?: CommitHistoryCell[]
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
}

const toDate = (dateStr: string) => new Date(dateStr + "T00:00:00")

const toKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const addDays = (date: Date, days: number): Date => {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

const DAY_LABELS: Array<{ index: number; label: string }> = [
  { index: 1, label: "Mon" },
  { index: 3, label: "Wed" },
  { index: 5, label: "Fri" },
]

type RenderCell = CommitHistoryCell & { isPadding: boolean }
type MonthLabelPlacement = { label: string; column: number; lane: 0 | 1 }

const CELL_SIZE = 11.5
const CELL_GAP = 4
const DAY_LABEL_COLUMN_WIDTH = 18
const DAY_LABEL_COLUMN_GAP = 6

const ContributionGrid = ({ cells }: ContributionGridProps) => {
  if (!cells || cells.length === 0) {
    return null
  }

  const { weeks, monthLabelByColumn } = useMemo(() => {
    const sorted = [...cells].sort((a, b) => a.date.localeCompare(b.date))
    const cellMap = new Map(sorted.map((cell) => [cell.date, cell]))
    const firstDate = toDate(sorted[0].date)
    const lastDate = toDate(sorted[sorted.length - 1].date)

    let visibleStart = new Date(firstDate)
    if (firstDate.getDate() !== 1) {
      const nextMonthStart = new Date(firstDate.getFullYear(), firstDate.getMonth() + 1, 1)
      if (nextMonthStart <= lastDate) {
        visibleStart = nextMonthStart
      }
    }

    const gridStart = addDays(visibleStart, -visibleStart.getDay())
    const gridEnd = addDays(lastDate, 6 - lastDate.getDay())

    const computedWeeks: RenderCell[][] = []
    let cursor = new Date(gridStart)

    while (cursor <= gridEnd) {
      const week: RenderCell[] = []
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const key = toKey(cursor)
        const isPadding = cursor < visibleStart
        const existing = cellMap.get(key)
        week.push(
          existing
            ? { ...existing, isPadding }
            : { date: key, count: 0, intensity: 0, isPadding },
        )
        cursor = addDays(cursor, 1)
      }
      computedWeeks.push(week)
    }

    const monthLabels: Array<{ label: string; column: number }> = []
    const seenColumns = new Set<number>()
    let labelCursor = new Date(visibleStart)
    while (labelCursor <= lastDate) {
      if (labelCursor.getDate() === 1) {
        const dayOffset = Math.floor((labelCursor.getTime() - gridStart.getTime()) / (1000 * 60 * 60 * 24))
        const column = Math.floor(dayOffset / 7)
        if (!seenColumns.has(column)) {
          monthLabels.push({
            label: labelCursor.toLocaleDateString("en-US", { month: "short" }),
            column,
          })
          seenColumns.add(column)
        }
      }
      labelCursor = addDays(labelCursor, 1)
    }

    if (monthLabels.length === 0 || monthLabels[0].column > 1) {
      monthLabels.unshift({
        label: visibleStart.toLocaleDateString("en-US", { month: "short" }),
        column: 0,
      })
    }

    const minColumnsPerLane = 2
    const monthLabelLayout: MonthLabelPlacement[] = []
    let lastLane0Column = -Infinity
    let lastLane1Column = -Infinity

    for (const label of monthLabels) {
      const canUseLane0 = label.column - lastLane0Column >= minColumnsPerLane
      const canUseLane1 = label.column - lastLane1Column >= minColumnsPerLane

      if (canUseLane0) {
        monthLabelLayout.push({ ...label, lane: 0 })
        lastLane0Column = label.column
        continue
      }

      if (canUseLane1) {
        monthLabelLayout.push({ ...label, lane: 1 })
        lastLane1Column = label.column
        continue
      }

      monthLabelLayout.push({ ...label, lane: 1 })
      lastLane1Column = label.column
    }

    return {
      weeks: computedWeeks,
      monthLabelByColumn: new Map(monthLabelLayout.map((label) => [label.column, label])),
    }
  }, [cells])

  const weekColumns = weeks.length
  const weekColumnsTemplate = {
    xs: `repeat(${weekColumns}, ${CELL_SIZE}px)`,
    md: `repeat(${weekColumns}, minmax(0, 1fr))`,
  }

  return (
    <Box
      sx={{
        overflowX: { xs: "auto", md: "hidden" },
        pb: 0.5,
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": { height: 5 },
      }}
    >
      <Box sx={{ width: "100%", minWidth: "max-content" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: weekColumnsTemplate,
            columnGap: `${CELL_GAP}px`,
            ml: `${DAY_LABEL_COLUMN_WIDTH + DAY_LABEL_COLUMN_GAP}px`,
            mb: 0.75,
            height: 24,
          }}
        >
          {weeks.map((_, column) => {
            const monthLabel = monthLabelByColumn.get(column)
            return (
              <Box key={`month-${column}`} sx={{ position: "relative" }}>
                {monthLabel ? (
                  <Typography
                    variant="caption"
                    sx={{
                      position: "absolute",
                      top: monthLabel.lane === 0 ? 0 : 10,
                      left: 0,
                      color: "onSurfaceVariant",
                      fontSize: "0.6rem",
                      lineHeight: 1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {monthLabel.label}
                  </Typography>
                ) : null}
              </Box>
            )
          })}
        </Box>

        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
          <Box
            sx={{
              width: DAY_LABEL_COLUMN_WIDTH,
              mr: `${DAY_LABEL_COLUMN_GAP}px`,
              display: "grid",
              gridTemplateRows: `repeat(7, ${CELL_SIZE}px)`,
              rowGap: `${CELL_GAP}px`,
            }}
          >
            {Array.from({ length: 7 }).map((_, dayIndex) => {
              const label = DAY_LABELS.find((day) => day.index === dayIndex)
              return (
                <Typography
                  key={`day-${dayIndex}`}
                  variant="caption"
                  sx={{
                    color: "onSurfaceVariant",
                    fontSize: "0.6rem",
                    lineHeight: 1,
                    visibility: label ? "visible" : "hidden",
                  }}
                >
                  {label?.label ?? ""}
                </Typography>
              )
            })}
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: weekColumnsTemplate,
              columnGap: `${CELL_GAP}px`,
              flex: 1,
            }}
          >
            {weeks.map((week, weekIndex) => (
              <Box
                key={`week-${weekIndex}`}
                sx={{
                  display: "grid",
                  gridTemplateRows: `repeat(7, ${CELL_SIZE}px)`,
                  rowGap: `${CELL_GAP}px`,
                }}
              >
                {week.map((cell, dayIndex) => (
                  cell.isPadding ? (
                    <Box
                      key={`${weekIndex}-${dayIndex}`}
                      sx={{
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        borderRadius: "2px",
                        bgcolor: "transparent",
                      }}
                    />
                  ) : (
                    <Box
                      key={`${weekIndex}-${dayIndex}`}
                      title={`${formatDate(cell.date)}: ${cell.count} commit${cell.count !== 1 ? "s" : ""}`}
                      sx={{
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        borderRadius: "2px",
                        bgcolor: (theme) =>
                          alpha(theme.palette.tertiary.main, Math.max(cell.intensity, 0.05)),
                        cursor: "pointer",
                      }}
                    />
                  )
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default memo(ContributionGrid)
