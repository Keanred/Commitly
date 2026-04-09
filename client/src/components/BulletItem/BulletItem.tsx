import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface BulletItemProps {
  color?: string;
  children: ReactNode;
}

const BulletItem = ({ color = 'primary.main', children }: BulletItemProps) => (
  <Box sx={{ display: 'flex', gap: 2 }}>
    <Box
      sx={{
        mt: 0.75,
        width: 8,
        height: 8,
        borderRadius: '50%',
        bgcolor: color,
        flexShrink: 0,
      }}
    />
    <Typography variant="body2" sx={{ color: 'onSurfaceVariant', lineHeight: 1.7 }}>
      {children}
    </Typography>
  </Box>
);

export default BulletItem;
