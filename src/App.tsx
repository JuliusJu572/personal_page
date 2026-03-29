import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './lib/authContext'
import { AppRoutes } from './routes/AppRoutes'
import { Background } from './ui/Background'

function App() {
  return (
    <>
      <Background />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
