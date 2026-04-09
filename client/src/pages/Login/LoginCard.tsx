import GitHubIcon from '@mui/icons-material/GitHub';
import TerminalIcon from '@mui/icons-material/Terminal';
import { Box, Button, Typography } from '@mui/material';

const LoginCard = () => {
  return (
    <Box sx={{ width: '100%', maxWidth: 448 }}>
      <Box
        sx={{
          bgcolor: 'surfaceContainerLow',
          p: { xs: 4, md: 6 },
          borderRadius: 3,
          boxShadow: 24,
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Branding Section */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              bgcolor: 'surfaceContainer',
              borderRadius: 3,
              mb: 3,
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            <TerminalIcon sx={{ fontSize: 36, color: 'primary.main' }} />
          </Box>
          <Typography variant="h4" sx={{ color: 'onSurface', mb: 1.5 }}>
            Unlock Your Engineering Insights
          </Typography>
          <Typography variant="body2" sx={{ color: 'onSurfaceVariant', lineHeight: 1.6, maxWidth: 280, mx: 'auto' }}>
            Connect your GitHub to uncover patterns in your commit history and sharpen your workflow.
          </Typography>
        </Box>

        {/* Action Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Button
            variant="contained"
            fullWidth
            href="/auth/github"
            sx={{ py: 1.75, px: 3, gap: 1.5, fontSize: '0.95rem' }}
          >
            <GitHubIcon sx={{ fontSize: 24 }} />
            Login with GitHub
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginCard;
