import { Box, Typography } from "@mui/material"
import type { ReactNode } from "react"
import type { Variant } from "@mui/material/styles/createTypography"

interface SectionHeaderProps {
  title: string
  subtitle?: ReactNode
  trailing?: ReactNode
  variant?: Variant
}

const SectionHeader = ({
  title,
  subtitle,
  trailing,
  variant = "h4",
}: SectionHeaderProps) => (
  <Box
    sx={{
      display: "flex",
      alignItems: { xs: "flex-start", md: "flex-end" },
      justifyContent: "space-between",
      flexDirection: { xs: "column", md: "row" },
      gap: 2,
      mb: 3,
    }}
  >
    <Box>
      <Typography
        variant={variant}
        sx={{
          fontFamily: "'Manrope'",
          fontWeight: variant === "h6" ? 700 : 800,
          letterSpacing: variant === "h6" ? undefined : "-0.02em",
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ color: "onSurfaceVariant" }}>
          {subtitle}
        </Typography>
      )}
    </Box>
    {trailing && <Box>{trailing}</Box>}
  </Box>
)

export default SectionHeader
