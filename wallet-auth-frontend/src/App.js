import React, { useState } from 'react';
import { ethers } from 'ethers';

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [status, setStatus] = useState('');

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const message = "Login to MyApp";
      const signature = await signer.signMessage(message);

      // Send to backend
      const res = await fetch('http://localhost:3001/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, message, signature }),
      });

      const data = await res.json();
      if (data.verified) {
        setWalletAddress(data.walletAddress);
        setStatus('✅ Wallet verified!');
      } else {
        setStatus('❌ Verification failed');
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Error during wallet connect');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <button onClick={connectWallet}>Connect Wallet</button>
      <p>{status}</p>
      <p>Wallet: {walletAddress}</p>
    </div>
  );
}

export default App;
