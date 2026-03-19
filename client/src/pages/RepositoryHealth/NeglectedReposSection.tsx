import { alpha, Box, Typography } from "@mui/material"
import StatusListItem from "../../components/StatusListItem"
import Icon from "../../components/Icon"

const neglectedRepos = [
  { label: "legacy-auth-service", status: "214 Days Silent", pulse: true },
  { label: "docs-internal-v1", status: "102 Days Silent", pulse: false },
]

const staleBranches = [
  { name: "feature/old-ui-refactor", age: "1.2 yrs" },
  { name: "fix/legacy-db-patch", age: "8 mos" },
  { name: "experiment/wasm-test", age: "5 mos" },
]

const NeglectedReposSection = () => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    {/* Neglected header */}
    <Typography
      sx={{
        fontSize: "0.875rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "error.main",
        mb: 1,
      }}
    >
      Neglected (&gt;3 Months)
    </Typography>

    {/* Neglected repos list */}
    <Box
      sx={{
        bgcolor: "surfaceContainerLow",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {neglectedRepos.map((repo, i) => (
        <Box
          key={repo.label}
          sx={(theme) => ({
            bgcolor: alpha(theme.palette.error.main, 0.05),
            ...(i < neglectedRepos.length - 1 && {
              borderBottom: 1,
              borderColor: alpha(theme.palette.outlineVariant, 0.1),
            }),
          })}
        >
          <StatusListItem {...repo} />
        </Box>
      ))}
    </Box>

    {/* Stale Branches */}
    <Box sx={{ mt: 4 }}>
      <Typography
        sx={{
          fontSize: "0.875rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "onSurfaceVariant",
          mb: 2,
        }}
      >
        Stale Branches
      </Typography>
      <Box sx={{ bgcolor: "surfaceContainer", borderRadius: 3, p: 0.5 }}>
        <Box component="table" sx={{ width: "100%", textAlign: "left" }}>
          <Box component="thead">
            <Box component="tr" sx={{ color: "text.disabled" }}>
              <Box
                component="th"
                sx={{
                  px: 2,
                  py: 1.5,
                  fontSize: "10px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                }}
              >
                Branch Name
              </Box>
              <Box
                component="th"
                sx={{
                  px: 2,
                  py: 1.5,
                  fontSize: "10px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                }}
              >
                Age
              </Box>
              <Box
                component="th"
                sx={{
                  px: 2,
                  py: 1.5,
                  fontSize: "10px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  textAlign: "right",
                }}
              >
                Action
              </Box>
            </Box>
          </Box>
          <Box component="tbody">
            {staleBranches.map((branch) => (
              <Box
                component="tr"
                key={branch.name}
                sx={{
                  color: "onSurface",
                  "&:hover": { bgcolor: "surfaceContainerHigh" },
                  transition: "background-color 0.15s",
                }}
              >
                <Box
                  component="td"
                  sx={{
                    px: 2,
                    py: 1.5,
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                  }}
                >
                  {branch.name}
                </Box>
                <Box
                  component="td"
                  sx={{ px: 2, py: 1.5, fontSize: "0.75rem" }}
                >
                  {branch.age}
                </Box>
                <Box
                  component="td"
                  sx={{ px: 2, py: 1.5, textAlign: "right" }}
                >
                  <Box
                    component="button"
                    sx={{
                      background: "none",
                      border: "none",
                      color: "primary.main",
                      cursor: "pointer",
                      p: 0,
                      "&:hover": { color: "text.primary" },
                    }}
                  >
                    <Icon name="delete" sx={{ fontSize: "1.125rem" }} />
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
)

export default NeglectedReposSection
