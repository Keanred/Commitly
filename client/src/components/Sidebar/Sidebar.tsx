import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Link } from '@tanstack/react-router';
import Icon from '../Icon';

export interface NavItem {
  icon: string;
  label: string;
  href?: string;
  active?: boolean;
}

interface SidebarProps {
  navItems?: NavItem[];
  bottomItems?: NavItem[];
}

export const SIDEBAR_WIDTH = 256;

const Sidebar = ({ navItems = [], bottomItems = [] }: SidebarProps) => (
  <Box
    component="aside"
    sx={{
      position: 'fixed',
      left: 0,
      top: 0,
      height: '100%',
      width: SIDEBAR_WIDTH,
      bgcolor: 'surfaceContainerLow',
      borderRight: '1px solid',
      borderColor: 'divider',
      display: { xs: 'none', md: 'flex' },
      flexDirection: 'column',
      p: 2,
      zIndex: 40,
    }}
  >
    {/* Brand */}
    <Box sx={{ mb: 4, px: 2 }}>
      <Typography
        sx={{
          fontFamily: "'Manrope'",
          fontWeight: 900,
          color: 'primary.main',
          fontSize: '1.5rem',
          letterSpacing: '-0.05em',
        }}
      >
        Commitly
      </Typography>
      <Typography variant="caption" sx={{ color: 'onSurfaceVariant', opacity: 0.6, fontWeight: 500 }}>
        Developer Insights
      </Typography>
    </Box>

    {/* Navigation */}
    <Box component="nav" sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      {navItems.map((item) => (
        <Box
          key={item.label}
          component={item.href ? Link : 'a'}
          {...(item.href
            ? {
                to: item.href,
                preload: item.href === '/dashboard' ? ('intent' as const) : (false as const),
              }
            : { href: '#' })}
          sx={[
            {
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2,
              py: 1.5,
              borderRadius: 1,
              textDecoration: 'none',
              transition: 'all 0.2s',
            },
            item.active
              ? {
                  bgcolor: 'surfaceContainer',
                  color: 'primary.main',
                  boxShadow: (theme: Theme) => `0 1px 3px ${alpha(theme.palette.primary.main, 0.1)}`,
                  transform: 'translateX(4px)',
                }
              : {
                  color: 'text.primary',
                  opacity: 0.6,
                  '&:hover': { opacity: 1, bgcolor: 'surfaceContainerHigh' },
                },
          ]}
        >
          <Icon name={item.icon} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>

    {/* Bottom section */}
    <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Bottom links */}
      <Box
        sx={{
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}
      >
        {bottomItems.map((item) => (
          <Box
            key={item.label}
            component="a"
            href={item.href ?? '#'}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2,
              py: 1,
              textDecoration: 'none',
              color: 'text.primary',
              opacity: 0.6,
              transition: 'all 0.2s',
              '&:hover': { opacity: 1, bgcolor: 'surfaceContainerHigh' },
            }}
          >
            <Icon name={item.icon} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);

type Theme = import('@mui/material/styles').Theme;

export default Sidebar;
