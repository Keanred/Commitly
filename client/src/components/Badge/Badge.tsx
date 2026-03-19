import { Box } from "@mui/material"
import type { ReactNode } from "react"
import type { SxProps, Theme } from "@mui/material/styles"

interface BadgeProps {
  children: ReactNode
  bgcolor?: string
  color?: string
  pill?: boolean
  sx?: SxProps<Theme>
}

const Badge = ({
  children,
  bgcolor = "surfaceContainerHigh",
  color = "onSurfaceVariant",
  pill = false,
  sx,
}: BadgeProps) => (
  <Box
    component="span"
    sx={[
      {
        display: "inline-block",
        px: 1,
        py: 0.25,
        borderRadius: pill ? 50 : 0.5,
        bgcolor,
        color,
        fontSize: "0.75rem",
        fontWeight: 700,
      },
      ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
    ]}
  >
    {children}
  </Box>
)

export default Badge
