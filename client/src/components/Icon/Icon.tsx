import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

interface IconProps {
  name: string;
  filled?: boolean;
  className?: string;
  sx?: SxProps<Theme>;
}

const Icon = ({ name, filled, className, sx }: IconProps) => {
  const normalizedSx = Array.isArray(sx) ? sx : [];
  if (!Array.isArray(sx) && sx) {
    normalizedSx.push(sx);
  }

  return (
    <Box
      component="span"
      className={`material-symbols-outlined${className ? ` ${className}` : ''}`}
      sx={[
        {
          verticalAlign: 'middle',
          lineHeight: 1,
          ...(filled ? { fontVariationSettings: "'FILL' 1" } : {}),
        },
        ...normalizedSx,
      ]}
    >
      {name}
    </Box>
  );
};

export default Icon;
