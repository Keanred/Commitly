import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    surfaceBright: string;
    surfaceDim: string;
    surfaceTint: string;
    surfaceContainerLowest: string;
    surfaceContainerLow: string;
    surfaceContainer: string;
    surfaceContainerHigh: string;
    surfaceContainerHighest: string;
    surfaceVariant: string;
    onSurface: string;
    onSurfaceVariant: string;
    outline: string;
    outlineVariant: string;
    inverseSurface: string;
    inverseOnSurface: string;
    inversePrimary: string;
    tertiary: Palette['primary'];
    onPrimary: string;
    onPrimaryContainer: string;
    primaryContainer: string;
    onSecondary: string;
    onSecondaryContainer: string;
    secondaryContainer: string;
    onTertiary: string;
    onTertiaryContainer: string;
    tertiaryContainer: string;
    onError: string;
    onErrorContainer: string;
    errorContainer: string;
  }
  interface PaletteOptions {
    surfaceBright?: string;
    surfaceDim?: string;
    surfaceTint?: string;
    surfaceContainerLowest?: string;
    surfaceContainerLow?: string;
    surfaceContainer?: string;
    surfaceContainerHigh?: string;
    surfaceContainerHighest?: string;
    surfaceVariant?: string;
    onSurface?: string;
    onSurfaceVariant?: string;
    outline?: string;
    outlineVariant?: string;
    inverseSurface?: string;
    inverseOnSurface?: string;
    inversePrimary?: string;
    tertiary?: PaletteOptions['primary'];
    onPrimary?: string;
    onPrimaryContainer?: string;
    primaryContainer?: string;
    onSecondary?: string;
    onSecondaryContainer?: string;
    secondaryContainer?: string;
    onTertiary?: string;
    onTertiaryContainer?: string;
    tertiaryContainer?: string;
    onError?: string;
    onErrorContainer?: string;
    errorContainer?: string;
  }
}

const theme = createTheme({
  palette: {
    mode: 'dark',

    // Core surfaces
    background: {
      default: '#10141a',
      paper: '#1c2026',
    },
    surfaceBright: '#353940',
    surfaceDim: '#10141a',
    surfaceTint: '#acc7ff',
    surfaceContainerLowest: '#0a0e14',
    surfaceContainerLow: '#181c22',
    surfaceContainer: '#1c2026',
    surfaceContainerHigh: '#262a31',
    surfaceContainerHighest: '#31353c',
    surfaceVariant: '#31353c',

    // On-surface
    onSurface: '#dfe2eb',
    onSurfaceVariant: '#c6c6cb',
    outline: '#8f9095',
    outlineVariant: '#45474b',

    // Primary
    primary: { main: '#acc7ff', contrastText: '#002f68' },
    onPrimary: '#002f68',
    primaryContainer: '#00102c',
    onPrimaryContainer: '#2279ef',

    // Secondary
    secondary: { main: '#c1c7d0', contrastText: '#2b3138' },
    onSecondary: '#2b3138',
    secondaryContainer: '#41474f',
    onSecondaryContainer: '#b0b5be',

    // Tertiary (green accents)
    tertiary: { main: '#7bdb80', contrastText: '#00390e' },
    onTertiary: '#00390e',
    tertiaryContainer: '#001503',
    onTertiaryContainer: '#2d8e3d',

    // Error
    error: { main: '#ffb4ab', contrastText: '#690005' },
    onError: '#690005',
    errorContainer: '#93000a',
    onErrorContainer: '#ffdad6',

    // Inverse
    inverseSurface: '#dfe2eb',
    inverseOnSurface: '#2d3137',
    inversePrimary: '#005bbf',

    // Text
    text: {
      primary: '#dfe2eb',
      secondary: '#c6c6cb',
      disabled: '#8f9095',
    },
    divider: 'rgba(69, 71, 75, 0.15)',
  },

  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontFamily: "'Manrope', sans-serif",
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: "'Manrope', sans-serif",
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: "'Manrope', sans-serif",
      fontWeight: 700,
    },
    h4: {
      fontFamily: "'Manrope', sans-serif",
      fontWeight: 700,
    },
    h5: {
      fontFamily: "'Manrope', sans-serif",
      fontWeight: 700,
    },
    h6: {
      fontFamily: "'Manrope', sans-serif",
      fontWeight: 700,
    },
    subtitle1: { fontFamily: "'Inter', sans-serif", fontWeight: 600 },
    subtitle2: { fontFamily: "'Inter', sans-serif", fontWeight: 600 },
    body1: { fontFamily: "'Inter', sans-serif", fontWeight: 400 },
    body2: { fontFamily: "'Inter', sans-serif", fontWeight: 400 },
    button: { fontFamily: "'Inter', sans-serif", fontWeight: 700, textTransform: 'none' },
    caption: { fontFamily: "'Inter', sans-serif" },
    overline: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
  },

  shape: {
    borderRadius: 6,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#10141a',
          color: '#dfe2eb',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.375rem',
          textTransform: 'none',
          fontWeight: 700,
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #acc7ff, #2279ef)',
          color: '#002f68',
          '&:hover': {
            background: 'linear-gradient(135deg, #d7e2ff, #acc7ff)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(69, 71, 75, 0.15)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          fontSize: '0.625rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: '#31353c',
          '&.Mui-focused': {
            borderColor: 'rgba(172, 199, 255, 0.6)',
          },
        },
      },
    },
  },
});

export default theme;
