import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import Footer from '../Footer';
import Header from '../Header';
import MobileNav from '../MobileNav';
import Sidebar, { SIDEBAR_WIDTH } from '../Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  avatarUrl?: string;
  activeNav?: string;
}

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { icon: 'auto_awesome', label: 'Weekly Digest', href: '/weekly-digest' },
  { icon: 'analytics', label: 'Repo Health', href: '/repo-health' },
];

const sidebarBottomItems = [
  { icon: 'menu_book', label: 'Documentation' },
  { icon: 'contact_support', label: 'Support' },
];

const mobileNavLabels = [
  { icon: 'dashboard', label: 'Home', navLabel: 'Dashboard', href: '/dashboard' },
  { icon: 'auto_awesome', label: 'Digest', navLabel: 'Weekly Digest', href: '/weekly-digest' },
  { icon: 'analytics', label: 'Health', navLabel: 'Repo Health', href: '/repo-health' },
  { icon: 'settings', label: 'Config', navLabel: 'Config' },
];

const DashboardLayout = ({ children, avatarUrl, activeNav = 'Dashboard' }: DashboardLayoutProps) => (
  <>
    <Sidebar
      navItems={navItems.map((item) => ({
        ...item,
        active: item.label === activeNav,
      }))}
      bottomItems={sidebarBottomItems}
    />
    <Box
      sx={{
        ml: { md: `${SIDEBAR_WIDTH}px` },
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header avatarUrl={avatarUrl} />
      <Box component="main" sx={{ flex: 1, p: { xs: 4, md: 6 } }}>
        {children}
      </Box>
      <Footer />
    </Box>
    <MobileNav
      items={mobileNavLabels.map((item) => ({
        icon: item.icon,
        label: item.label,
        active: item.navLabel === activeNav,
        href: item.href,
      }))}
    />
  </>
);

export default DashboardLayout;
