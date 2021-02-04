import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

import logo from "./logo.svg";
import "./App.css";
const ENDPOINT = window.location.host

function App() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", (data) => {
      setResponse(data);
    });
  }, []);
  return (
    <>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          I am Splash
          <p>
            {response}
          </p>
        </header>
      </div>
    </>
  );
}

export default App;
