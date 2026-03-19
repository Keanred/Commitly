import { Box, Typography } from "@mui/material"
import { Link } from "@tanstack/react-router"
import Icon from "../Icon"

export interface MobileNavItem {
  icon: string
  label: string
  href?: string
  active?: boolean
}

interface MobileNavProps {
  items?: MobileNavItem[]
}

const MobileNav = ({ items = [] }: MobileNavProps) => (
  <Box
    component="nav"
    sx={{
      display: { xs: "flex", md: "none" },
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      bgcolor: "background.default",
      borderTop: "1px solid",
      borderColor: "divider",
      px: 3,
      py: 1.5,
      justifyContent: "space-between",
      alignItems: "center",
      zIndex: 50,
    }}
  >
    {items.map((item) => (
      <Box
        key={item.label}
        component={item.href ? Link : "a"}
        {...(item.href ? { to: item.href } : { href: "#" })}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textDecoration: "none",
          color: item.active ? "primary.main" : "text.primary",
          opacity: item.active ? 1 : 0.5,
        }}
      >
        <Icon name={item.icon} />
        <Typography
          sx={{
            fontSize: "10px",
            fontWeight: item.active ? 700 : 400,
            mt: 0.5,
          }}
        >
          {item.label}
        </Typography>
      </Box>
    ))}
  </Box>
)

export default MobileNav
