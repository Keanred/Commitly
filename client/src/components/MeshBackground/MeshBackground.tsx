import { Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ReactNode } from 'react';

interface MeshBackgroundProps {
  children: ReactNode;
}

const MeshBackground = ({ children }: MeshBackgroundProps) => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        px: 3,
        py: 6,
        backgroundImage: (theme) =>
          `radial-gradient(at 0% 0%, ${alpha(theme.palette.onPrimaryContainer, 0.1)} 0, transparent 50%), radial-gradient(at 100% 100%, ${alpha(theme.palette.tertiary.main, 0.05)} 0, transparent 50%)`,
      }}
    >
      <Box sx={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.2 }}>
        <Box
          sx={{
            position: 'absolute',
            top: '25%',
            left: '25%',
            width: 384,
            height: 384,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
            borderRadius: '50%',
            filter: 'blur(120px)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '25%',
            right: '25%',
            width: 256,
            height: 256,
            bgcolor: (theme) => alpha(theme.palette.tertiary.main, 0.1),
            borderRadius: '50%',
            filter: 'blur(100px)',
          }}
        />
      </Box>
      <Box sx={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', justifyContent: 'center' }}>
        {children}
      </Box>
    </Box>
  );
};

export default MeshBackground;
