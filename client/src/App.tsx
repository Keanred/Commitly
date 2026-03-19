import { RouterProvider } from "@tanstack/react-router"
import { router } from "./router"
import { AuthProvider } from "./AuthProvider";


import { useAuth } from "./AuthContext"

const AppInner = () => {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

const App = () => {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}

export default App
