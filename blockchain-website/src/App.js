import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContractTester from './components/ContractTester';
import ConnectWallet from './components/ConnectWallet';

function App() {
  return (
    <Router>
      <div>
        <ConnectWallet />
        <Routes>
          <Route path="/" element={<ContractTester />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;