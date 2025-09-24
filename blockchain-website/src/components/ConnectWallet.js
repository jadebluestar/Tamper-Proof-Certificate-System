import React, { useState } from "react";

function ConnectWallet() {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
      } catch (error) {
        alert("Connection to MetaMask was rejected.");
      }
    } else {
      alert("MetaMask not detected. Please install MetaMask extension.");
    }
  };

  return (
    <div>
      <button onClick={connectWallet}>
        {account ? `Connected: ${account.substring(0, 6)}...${account.substring(account.length - 4)}` : "Connect Wallet"}
      </button>
    </div>
  );
}

export default ConnectWallet;