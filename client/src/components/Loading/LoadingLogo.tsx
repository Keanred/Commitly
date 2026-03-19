import { Box } from "@mui/material";

const LoadingLogo = () => (
  <Box sx={{ position: "relative", width: 192, height: 192, mb: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
    {/* Outer Pulse Rings */}
    <Box sx={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid", borderColor: "primary.main", opacity: 0.2, animation: "pulse-ring 3s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
    <Box sx={{ position: "absolute", inset: 16, borderRadius: "50%", border: "1px solid", borderColor: "primary.main", opacity: 0.1, animation: "pulse-ring 3s cubic-bezier(0.4, 0, 0.6, 1) infinite", animationDelay: "1s" }} />
    {/* Central Core */}
    <Box sx={{ position: "relative", width: 96, height: 96, borderRadius: 3, bgcolor: "surfaceContainerLow", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: 6, overflow: "hidden" }}>
      {/* Geometric Logo Pattern */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 0.5, transform: "rotate(45deg)" }}>
        <Box sx={{ width: 16, height: 16, bgcolor: "primary.main", borderRadius: 1, opacity: 0.8 }} />
        <Box sx={{ width: 16, height: 16, bgcolor: "tertiary.main", borderRadius: 1, opacity: 0.4 }} />
        <Box sx={{ width: 16, height: 16, bgcolor: "onPrimaryContainer.main", borderRadius: 1, opacity: 0.6 }} />
        <Box sx={{ width: 16, height: 16, bgcolor: "primary.light", borderRadius: 1, opacity: 0.9 }} />
      </Box>
      {/* Inner Scanner Glow */}
      <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #acc7ff0d, transparent)", pointerEvents: "none" }} />
    </Box>
    {/* Floating Data Particles */}
    <Box sx={{ position: "absolute", top: -16, right: -16, width: 8, height: 8, borderRadius: "50%", bgcolor: "tertiary.main", boxShadow: "0 0 10px #7bdb80" }} />
    <Box sx={{ position: "absolute", bottom: -32, left: -16, width: 6, height: 6, borderRadius: "50%", bgcolor: "primary.main", boxShadow: "0 0 8px #acc7ff" }} />
  </Box>
);

export default LoadingLogo;
