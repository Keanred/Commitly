import { Box, Link, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{ width: '100%', borderTop: '1px solid', borderColor: 'divider', bgcolor: 'surfaceContainerLowest' }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 4,
          py: 6,
          maxWidth: '80rem',
          mx: 'auto',
        }}
      >
        <Box sx={{ mb: { xs: 3, md: 0 } }}>
          <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
            Commitly
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled', mt: 0.5, display: 'block' }}>
            © 2026 Commitly.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: { xs: 3, md: 5 } }}>
          {['Terms of Service', 'Privacy Policy'].map((item) => (
            <Link
              key={item}
              href="#"
              underline="none"
              sx={{
                color: 'text.disabled',
                '&:hover': { color: 'text.primary' },
                transition: 'opacity 0.2s',
                fontSize: '0.875rem',
              }}
            >
              {item}
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
