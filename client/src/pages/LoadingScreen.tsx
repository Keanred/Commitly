import { Box } from "@mui/material";
import MeshBackground from "../components/MeshBackground";
import Footer from "../components/Footer";
import Icon from "../components/Icon";
import LoadingLogo from "../components/Loading/LoadingLogo";
import LoadingProgressBar from "../components/Loading/LoadingProgressBar";
import LoadingMessage from "../components/Loading/LoadingMessage";

const LoadingScreen = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box component="header" sx={{ width: '100%', position: 'sticky', top: 0, zIndex: 50, bgcolor: 'background.default', px: 6, py: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '80rem', mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 32, height: 32, bgcolor: 'primary.main', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="terminal" filled sx={{ color: 'onPrimary.main', fontSize: 20 }} />
          </Box>
          <Box sx={{ fontWeight: 800, fontSize: 24, color: 'onSurface', fontFamily: 'headline', letterSpacing: -1 }}>Commitly</Box>
        </Box>
        <Box sx={{ color: 'onSurfaceVariant', fontSize: 14, opacity: 0.7, cursor: 'pointer', fontFamily: 'label', '&:hover': { color: 'primary.main', opacity: 1 } }}>
          Support
        </Box>
      </Box>
      {/* Main Loading Canvas */}
      <MeshBackground>
        <Box sx={{ width: '100%', maxWidth: 480, mx: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
          <LoadingLogo />
          <LoadingProgressBar />
          <LoadingMessage />
        </Box>
      </MeshBackground>
      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default LoadingScreen;
