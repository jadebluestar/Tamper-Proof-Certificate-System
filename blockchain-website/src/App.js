import React, { useState } from 'react';
import ConnectWallet from './components/ConnectWallet';
import QRGenerator from './components/QRGenerator';
import ContractTester from './components/ContractTester';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('qr');
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const handleDisconnect = () => {
    setAccount('');
    setIsConnected(false);
    // Optional: clear from localStorage if you're persisting
    // localStorage.removeItem('walletAccount');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1> Blockchain Certificate Verification</h1>
        <div className="wallet-section">
          <ConnectWallet 
            account={account}
            setAccount={setAccount}
            isConnected={isConnected}
            setIsConnected={setIsConnected}
          />
          {isConnected && (
            <button 
              onClick={handleDisconnect} 
              className="disconnect-btn"
              style={{ marginLeft: '10px', padding: '5px 10px', cursor: 'pointer' }}
            >
              🔌 Disconnect
            </button>
          )}
        </div>
      </header>

      <nav className="nav-tabs">
        <button className={activeTab === 'qr' ? 'active' : ''} onClick={() => setActiveTab('qr')}>🔲 Generate QR</button>
        <button className={activeTab === 'verify' ? 'active' : ''} onClick={() => setActiveTab('verify')}>✓ Verify Certificate</button>
        <button className={activeTab === 'test' ? 'active' : ''} onClick={() => setActiveTab('test')}>🔧 Contract Tester</button>
      </nav>

      <main className="main-content">
        {activeTab === 'qr' && <QRGenerator account={account} isConnected={isConnected} />}
        {activeTab === 'test' && <ContractTester account={account} />}
      </main>
    </div>
  );
}

export default App;
