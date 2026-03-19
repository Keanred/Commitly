import { Box } from "@mui/material";

const LoadingProgressBar = () => (
  <Box sx={{ width: '100%', height: 8, bgcolor: 'surfaceContainerHighest', borderRadius: 2, overflow: 'hidden', mb: 4, position: 'relative' }}>
    <Box sx={{ height: '100%', bgcolor: 'primary.main', width: '65%', borderRadius: 2, position: 'relative' }}>
      {/* Scan line effect */}
      <Box sx={{ position: 'absolute', top: 0, bottom: 0, width: 80, bgcolor: 'linear-gradient(90deg, transparent, #fff3 50%, transparent)', animation: 'scan-line 2s linear infinite' }} />
    </Box>
  </Box>
);

export default LoadingProgressBar;
