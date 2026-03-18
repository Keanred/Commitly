import { Box } from "@mui/material"
import MeshBackground from "../../components/MeshBackground"
import Footer from "../../components/Footer"
import LoginCard from "./LoginCard"

const Login = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <MeshBackground>
        <LoginCard />
      </MeshBackground>
      <Footer />
    </Box>
  )
}

export default Login
