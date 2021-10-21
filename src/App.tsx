import React from 'react';
import { useState } from 'react';
import './App.css';
import Home from './views/Home/index';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Home></Home>
    </div>
  );
}

export default App;
