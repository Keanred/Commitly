import { Box } from "@mui/material"
import type { SxProps, Theme } from "@mui/material/styles"

interface IconProps {
  name: string
  filled?: boolean
  className?: string
  sx?: SxProps<Theme>
}

const Icon = ({ name, filled, className, sx }: IconProps) => (
  <Box
    component="span"
    className={`material-symbols-outlined${className ? ` ${className}` : ""}`}
    sx={[
      {
        verticalAlign: "middle",
        lineHeight: 1,
        ...(filled ? { fontVariationSettings: "'FILL' 1" } : {}),
      },
      ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
    ]}
  >
    {name}
  </Box>
)

export default Icon
