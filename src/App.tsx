import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DrivePage from "./Pages/DrivePage";
import LoginPage from "./Pages/LoginPage";
import RegisterScreen from "./Pages/RegisterScreen";
import ServiceRoute from "./Wrappers/ServiceRoute";
import ProtectedRoute from "./Wrappers/ProtectedRoute";
import { DriveProvider } from "./Contexts/DriveContext";
import ChatbotPage from "./Pages/ChatbotPage";

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
                <DriveProvider>
                  <DrivePage />
                </DriveProvider>
              </ProtectedRoute>
            </ServiceRoute>
          }
        />
        <Route
          path="/drive/:folder_id"
          element={
            <ServiceRoute>
              <ProtectedRoute>
                <DriveProvider>
                  <DrivePage />
                </DriveProvider>
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
        <Route path="/chatbot" element={<ChatbotPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
