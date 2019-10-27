import React from 'react';
import logo from './logo.svg';
import './App.css';
import TopBar from './components/TopBar'

const App: React.FC = () => {
  return (
    <div className="App">
      <TopBar/>
    </div>
  );
}

export default App;
