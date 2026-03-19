import { Box, Typography } from "@mui/material"

interface StatusListItemProps {
  label: string
  status: string
  statusColor?: string
  pulse?: boolean
}

const StatusListItem = ({
  label,
  status,
  statusColor = "error.main",
  pulse = false,
}: StatusListItemProps) => (
  <Box
    sx={{
      p: 2,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          bgcolor: statusColor,
          ...(pulse && {
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            "@keyframes pulse": {
              "0%, 100%": { opacity: 1 },
              "50%": { opacity: 0.5 },
            },
          }),
        }}
      />
      <Typography sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
        {label}
      </Typography>
    </Box>
    <Typography
      sx={{
        fontSize: "10px",
        fontWeight: 900,
        color: statusColor,
        textTransform: "uppercase",
      }}
    >
      {status}
    </Typography>
  </Box>
)

export default StatusListItem
