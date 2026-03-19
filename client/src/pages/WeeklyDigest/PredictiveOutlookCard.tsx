import { Box, Typography } from "@mui/material"
import { alpha, useTheme } from "@mui/material/styles"
import Icon from "../../components/Icon"
import BulletItem from "../../components/BulletItem"

const PredictiveOutlookCard = () => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        gridColumn: { xs: "span 12", lg: "span 5" },
        background: `linear-gradient(135deg, ${theme.palette.surfaceContainer}, ${theme.palette.surfaceContainerLowest})`,
        p: 4,
        borderRadius: 3,
        position: "relative",
        overflow: "hidden",
        border: "1px solid",
        borderColor: alpha(theme.palette.primary.main, 0.1),
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Icon name="insights" sx={{ color: "primary.main" }} />
          <Typography
            variant="h6"
            sx={{ fontFamily: "'Manrope'", fontWeight: 700 }}
          >
            Predictive Outlook
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <BulletItem color="primary.main">
            Anticipated spike in{" "}
            <Typography
              component="span"
              sx={{ color: "onSurface", fontWeight: 600, fontSize: "inherit" }}
            >
              Code Review overhead
            </Typography>{" "}
            starting Tuesday as the 'engine-core' PRs move to final approval.
          </BulletItem>

          <BulletItem color="tertiary.main">
            Opportunity for{" "}
            <Typography
              component="span"
              sx={{ color: "onSurface", fontWeight: 600, fontSize: "inherit" }}
            >
              Refactoring Flow
            </Typography>{" "}
            detected in the 'data-viz' module. Estimated effort: 4 hours.
          </BulletItem>

          {/* Confidence Interval */}
          <Box
            sx={{
              pt: 2,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "onSurfaceVariant",
                }}
              >
                Confidence Interval
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "primary.main",
                }}
              >
                82% Accurate
              </Typography>
            </Box>
            <Box
              sx={{
                height: 4,
                width: "100%",
                bgcolor: "surfaceContainerHigh",
                borderRadius: 50,
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  bgcolor: "primary.main",
                  borderRadius: 50,
                  width: "82%",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Decorative glow */}
      <Box
        sx={{
          position: "absolute",
          bottom: -40,
          right: -40,
          width: 160,
          height: 160,
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          filter: "blur(80px)",
          borderRadius: "50%",
        }}
      />
    </Box>
  )
}

export default PredictiveOutlookCard
