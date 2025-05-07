import React from 'react';
import RegisterScreen from './Pages/RegisterScreen';
import { createContext, useState } from 'react';

  export const portContext = createContext<{
    port: string;
    setPort: (port: string) => void;
  }>({
    port: "",
    setPort: (port: string) => {}
  });
  
  export const ipContext = createContext<{
    ip: string;
    setIp: (ip: string) => void;
  }>({
    ip: "",
    setIp: (ip: string) => {}
  });
  
  function App(){
    const [port, setPort] = useState<string>("55551");
    const [ip, setIp] = useState<string>("");
    // localStorage.clear() // for debugging
  
    return(
      <>
      {/* <h1>{ip}{port}</h1> for debugging*/}
      <ipContext.Provider value={{ip, setIp}}>
      <portContext.Provider value={{port, setPort}}>
        <div data-testid="register-screen">
            <RegisterScreen />
        </div>
      </portContext.Provider>
      </ipContext.Provider>
      </>
    );
  }

export default App;