import { Box, InputBase, IconButton, Button } from "@mui/material"
import { alpha } from "@mui/material/styles"
import { useRouter } from "@tanstack/react-router"
import { useAuth } from "../../AuthContext"
import Icon from "../Icon"

interface HeaderProps {
  avatarUrl?: string
}

const Header = ({ avatarUrl }: HeaderProps) => {
  const { logout } = useAuth()
  const router = useRouter()

  return (
  <Box
    component="header"
    sx={{
      position: "sticky",
      top: 0,
      zIndex: 30,
      bgcolor: "background.default",
      borderBottom: "1px solid",
      borderColor: "divider",
      px: 3,
      py: 1.5,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    {/* Search */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        bgcolor: "surfaceContainer",
        px: 2,
        py: 1,
        borderRadius: 50,
        width: 384,
        maxWidth: "100%",
      }}
    >
      <Icon
        name="search"
        sx={{ color: "onSurfaceVariant", mr: 1, fontSize: 18 }}
      />
      <InputBase
        placeholder="Search repositories..."
        sx={{
          flex: 1,
          fontSize: "0.875rem",
          color: "onSurface",
          "& input::placeholder": { color: "onSurfaceVariant", opacity: 0.5 },
        }}
      />
    </Box>

    {/* Actions */}
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <IconButton
        sx={{
          color: "text.primary",
          opacity: 0.7,
          "&:hover": { bgcolor: "surfaceContainerHigh" },
          "&:active": { transform: "scale(0.9)" },
        }}
      >
        <Icon name="notifications" />
      </IconButton>
      <IconButton
        sx={{
          color: "text.primary",
          opacity: 0.7,
          "&:hover": { bgcolor: "surfaceContainerHigh" },
          "&:active": { transform: "scale(0.9)" },
        }}
      >
        <Icon name="settings" />
      </IconButton>
      {avatarUrl && (
        <Box
          component="img"
          src={avatarUrl}
          alt="User avatar"
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            objectFit: "cover",
            border: "1px solid",
            borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
            boxShadow: (theme) =>
              `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        />
      )}
      <Button
        variant="outlined"
        size="small"
        onClick={async () => {
          await logout()
          router.navigate({ to: '/' })
        }}
      >
        Logout
      </Button>
    </Box>
  </Box>
  )
}

export default Header
