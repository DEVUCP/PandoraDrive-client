import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DrivePage from './Pages/DrivePage'
import LoginPage from './Pages/LoginPage'
import RegisterScreen from './Pages/RegisterScreen'
import ChatbotPage from './Pages/ChatbotPage'
import ServiceRoute from './Wrappers/ServiceRoute'
import ProtectedRoute from './Wrappers/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/drive" replace />} />
        <Route
          path="/drive"
          element={
            <ServiceRoute>
              <ProtectedRoute>
                <DrivePage />
              </ProtectedRoute>
            </ServiceRoute>
          }
        />
        <Route
          path="/login"
          element={
            <ServiceRoute>
              <LoginPage />
            </ServiceRoute>
          }
        />
        <Route path="/connect" element={<RegisterScreen />} />
        <Route
          path="/chatbot"
          element={
            <ServiceRoute>
              <ProtectedRoute>
                <ChatbotPage />
              </ProtectedRoute>
            </ServiceRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
