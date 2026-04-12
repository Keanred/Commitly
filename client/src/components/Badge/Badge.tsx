import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  bgcolor?: string;
  color?: string;
  pill?: boolean;
  sx?: SxProps<Theme>;
}

const normalizeSx = (sx?: SxProps<Theme>): SxProps<Theme>[] => {
  if (!sx) return [];
  return Array.isArray(sx) ? sx : [sx];
};

const Badge = ({
  children,
  bgcolor = 'surfaceContainerHigh',
  color = 'onSurfaceVariant',
  pill = false,
  sx,
}: BadgeProps) => {
  const normalizedSx = normalizeSx(sx);

  return (
    <Box
      component="span"
      sx={[
        {
          display: 'inline-block',
          px: 1,
          py: 0.25,
          borderRadius: pill ? 50 : 0.5,
          bgcolor,
          color,
          fontSize: '0.75rem',
          fontWeight: 700,
        },
        ...normalizedSx,
      ]}
    >
      {children}
    </Box>
  );
};

export default Badge;
