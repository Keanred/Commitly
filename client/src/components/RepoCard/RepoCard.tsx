import { Box, Typography } from "@mui/material"
import { alpha } from "@mui/material/styles"
import Icon from "../Icon"

type RepoStatus = "healthy" | "maintenance" | "failing"

interface RepoCardProps {
  icon: string
  status: RepoStatus
  name: string
  description: string
  branch: string
  lastActivity: string
}

const statusConfig: Record<
  RepoStatus,
  { label: string; bgcolor: string; color: string }
> = {
  healthy: {
    label: "Healthy",
    bgcolor: "tertiaryContainer",
    color: "tertiary.main",
  },
  maintenance: {
    label: "Maintenance",
    bgcolor: "surfaceContainerHigh",
    color: "onSurfaceVariant",
  },
  failing: {
    label: "Failing Tests",
    bgcolor: "errorContainer",
    color: "onErrorContainer",
  },
}

const RepoCard = ({
  icon,
  status,
  name,
  description,
  branch,
  lastActivity,
}: RepoCardProps) => {
  const config = statusConfig[status]
  const isFailing = status === "failing"

  return (
    <Box
      sx={{
        bgcolor: "surfaceContainerLowest",
        p: 2.5,
        borderRadius: 3,
        border: "1px solid",
        borderColor: (theme) => alpha(theme.palette.outline, 0.15),
        cursor: "pointer",
        transition: "all 0.2s",
        "&:hover": {
          borderColor: (theme) => alpha(theme.palette.primary.main, 0.4),
        },
        "& .repo-icon": { transition: "transform 0.2s" },
        "&:hover .repo-icon": { transform: "scale(1.1)" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Icon
          name={icon}
          className="repo-icon"
          sx={{ color: "primary.main" }}
        />
        <Box
          sx={{
            bgcolor: config.bgcolor,
            color: config.color,
            px: 1,
            py: 0.25,
            borderRadius: 0.5,
            fontSize: "10px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
          }}
        >
          {config.label}
        </Box>
      </Box>
      <Typography
        variant="body1"
        sx={{ fontWeight: 700, color: "onSurface", mb: 0.5 }}
      >
        {name}
      </Typography>
      <Typography
        variant="caption"
        sx={{ color: "onSurfaceVariant", display: "block", mb: 2 }}
      >
        {description}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "10px",
          fontFamily: "monospace",
          color: isFailing ? "error.main" : "onSurfaceVariant",
        }}
      >
        <span>{branch}</span>
        <span>{lastActivity}</span>
      </Box>
    </Box>
  )
}

export default RepoCard
