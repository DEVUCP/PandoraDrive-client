import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import RegisterScreen from './Pages/RegisterScreen';
import reportWebVitals from './reportWebVitals';

import { useState, createContext } from 'react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

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
      <RegisterScreen />
    </portContext.Provider>
    </ipContext.Provider>
    </>
  );
}

// If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
