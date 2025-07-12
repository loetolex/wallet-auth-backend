// index.js
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all origins (adjust for production)
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Health check route to verify server is running
app.get('/', (req, res) => {
  res.send('✅ Wallet auth backend is running');
});

// POST /api/verify - verifies signed messages from wallet addresses
app.post('/api/verify', async (req, res) => {
  try {
    const { address, signature, message } = req.body;

    if (!address || !signature || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Recover address from signature and message
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: 'Signature verification failed' });
    }

    return res.status(200).json({
      verified: true,
      walletAddress: address,
    });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
