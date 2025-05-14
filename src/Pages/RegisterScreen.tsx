import React from "react";
import logo from "../logo.svg";
import FindServiceScreen from "../Components/FindServiceScreen";

function RegisterScreen() {
  return (
    <div className="w-screen h-screen bg-[#282c34] text-center">
      <div className="flex flex-col h-full text-[calc(10px+2vmin)] text-white">
        <div className="flex flex-col items-center bg-[#282c34] flex-1 min-h-0 p-4">
          <h2 className="mb-4">Welcome to Pandora Home Drive!</h2>
          <div className="w-fit">
            <FindServiceScreen />
          </div>
        </div>

        <div className="bg-[#40444d] p-5 mt-auto">
          <img
            src={logo}
            className="h-[5vmin] pointer-events-none animate-[spin_20s_linear_infinite] mx-auto"
            alt="logo"
          />
          <p className="mt-4">
            Written with the{" "}
            <a
              className="text-[#61dafb] underline"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              React
            </a>{" "}
            framework
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterScreen;
