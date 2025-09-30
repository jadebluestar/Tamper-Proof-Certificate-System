import React, { useEffect } from 'react';
import './ConnectWallet.css';

const ConnectWallet = ({ account, setAccount, isConnected, setIsConnected }) => {
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    return () => {
      if (window.ethereum) window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) setIsConnected(false);
    else setAccount(accounts[0]);
  };

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Install MetaMask!');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);
    setIsConnected(true);
  };

  return (
    <div>
      {!isConnected ? (
        <button onClick={connectWallet}>🦊 Connect Wallet</button>
      ) : (
        <span>{account.substring(0,6)}...{account.substring(38)}</span>
      )}
    </div>
  );
};

export default ConnectWallet;
