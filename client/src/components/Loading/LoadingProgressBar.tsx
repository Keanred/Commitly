import { Box } from '@mui/material';

interface LoadingProgressBarProps {
  progress: number;
}

const LoadingProgressBar = ({ progress }: LoadingProgressBarProps) => (
  <Box
    sx={{
      width: '100%',
      height: 8,
      bgcolor: 'surfaceContainerHighest',
      borderRadius: 2,
      overflow: 'hidden',
      mb: 4,
      position: 'relative',
    }}
  >
    <Box
      sx={{
        height: '100%',
        bgcolor: 'primary.main',
        width: `${progress}%`,
        borderRadius: 2,
        position: 'relative',
        transition: 'width 220ms ease-out',
      }}
    >
      {/* Scan line effect */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: 80,
          bgcolor: 'linear-gradient(90deg, transparent, #fff3 50%, transparent)',
          animation: 'scan-line 2s linear infinite',
        }}
      />
    </Box>
  </Box>
);

export default LoadingProgressBar;
