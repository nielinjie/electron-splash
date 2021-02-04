import React from 'react';
import logo from './logo.svg';
import './App.css';
import List from './List';

function App() {
  return (
    <>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
         
          
            Your Business Here
            <List />

        </header>
      </div>
      
    </>
  );
}

export default App;
