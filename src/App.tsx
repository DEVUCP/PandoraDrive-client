import RegisterScreen from "./Pages/RegisterScreen";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DrivePage from "./Pages/DrivePage";
import UserDataService from "./Services/UserDataService";
import LoginPage from "./Pages/LoginPage";
import { ipContext } from "./Contexts/ipContext";
import { portContext } from "./Contexts/portContext";
import { FSProvider } from "./Contexts/FSContext";

function App() {
  const [port, setPort] = useState<string>("55551");
  const [ip, setIp] = useState<string>("");
  // localStorage.clear() // for debugging

  const userdata_service = UserDataService();
  const renderRoutes = () => {
    // if (!ip) return <Route path="*" element={<RegisterScreen />} />;
    // if (!userdata_service.is_authenticated())
    //   return <Route path="*" element={<LoginPage />} />;
    return <Route index element={<DrivePage />} />;
  };
  return (
    <>
      {/* <h1>{ip}{port}</h1> for debugging*/}
      <ipContext.Provider value={{ ip, setIp }}>
        <portContext.Provider value={{ port, setPort }}>
          <FSProvider>
            <BrowserRouter>
              <div className="max-w-screen-xl mx-auto p-8 text-center">
                <Routes>{renderRoutes()}</Routes>
              </div>
            </BrowserRouter>
          </FSProvider>
        </portContext.Provider>
      </ipContext.Provider>
    </>
  );
}

export default App;
