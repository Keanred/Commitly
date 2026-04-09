import { Box, Typography } from '@mui/material';

interface LoadingMessageProps {
  progress: number;
  status: string;
}

const LoadingMessage = ({ progress, status }: LoadingMessageProps) => (
  <Box sx={{ textAlign: 'center', mt: 2 }}>
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 0.5,
        borderRadius: 5,
        bgcolor: 'surfaceContainer',
        border: '1px solid',
        borderColor: 'outlineVariant',
        mb: 2,
      }}
    >
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          bgcolor: 'tertiary.main',
          animation: 'pulse 1.5s infinite alternate',
        }}
      />
      <Typography
        sx={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, color: 'onSurfaceVariant' }}
      >
        Processing Stream
      </Typography>
    </Box>
    <Typography variant="h6" sx={{ color: 'onSurface', fontWeight: 600, mb: 1 }}>
      Analyzing commit patterns... {progress}%
    </Typography>
    <Typography
      variant="body2"
      sx={{ color: 'onSurfaceVariant', opacity: 0.6, maxWidth: 320, mx: 'auto', lineHeight: 1.6 }}
    >
      {status}
    </Typography>
  </Box>
);

export default LoadingMessage;
