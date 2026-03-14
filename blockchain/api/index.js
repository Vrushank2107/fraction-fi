const { VercelRequest, VercelResponse } = require('@vercel/node');
const { ethers } = require('ethers');

// Contract ABI (simplified version)
const contractABI = [
  "function createAssetToken(string memory _name, string memory _assetType, uint256 _totalValue, uint256 _totalSupply) external",
  "function buyTokens(uint256 _assetId, uint256 _amount) external payable",
  "function getAsset(uint256 _assetId) external view returns (tuple(string name, string assetType, uint256 totalValue, uint256 totalSupply, uint256 tokenPrice, bool isActive))",
  "function getAllAssets() external view returns (tuple(string name, string assetType, uint256 totalValue, uint256 totalSupply, uint256 tokenPrice, bool isActive)[])",
  "function getOwnership(uint256 _assetId, address _owner) external view returns (uint256)"
];

// Contract configuration
const contractConfig = {
  // Sepolia Testnet
  sepolia: {
    rpcUrl: process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_PROJECT_ID',
    contractAddress: process.env.SEPOLIA_CONTRACT_ADDRESS || '',
    privateKey: process.env.DEPLOYER_PRIVATE_KEY || ''
  },
  // Mumbai Testnet
  mumbai: {
    rpcUrl: process.env.MUMBAI_RPC_URL || 'https://polygon-mumbai.infura.io/v3/YOUR_PROJECT_ID',
    contractAddress: process.env.MUMBAI_CONTRACT_ADDRESS || '',
    privateKey: process.env.DEPLOYER_PRIVATE_KEY || ''
  }
};

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { network = 'sepolia' } = req.query;
    const config = contractConfig[network];

    if (!config) {
      return res.status(400).json({ error: 'Unsupported network' });
    }

    if (!config.contractAddress) {
      return res.status(500).json({ 
        error: 'Contract not deployed on this network',
        message: 'Please deploy the smart contract first and update CONTRACT_ADDRESS environment variable'
      });
    }

    const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
    const contract = new ethers.Contract(config.contractAddress, contractABI, provider);

    const { method } = req.query;

    switch (method) {
      case 'getAssets':
        const assets = await contract.getAllAssets();
        return res.status(200).json({ assets });

      case 'getAsset':
        const { assetId } = req.query;
        if (!assetId) {
          return res.status(400).json({ error: 'Asset ID required' });
        }
        const asset = await contract.getAsset(assetId);
        return res.status(200).json({ asset });

      case 'getOwnership':
        const { assetId: ownershipAssetId, owner } = req.query;
        if (!ownershipAssetId || !owner) {
          return res.status(400).json({ error: 'Asset ID and owner address required' });
        }
        const ownership = await contract.getOwnership(ownershipAssetId, owner);
        return res.status(200).json({ ownership });

      case 'deploy':
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
        }
        
        // Deployment logic (simplified)
        const deployResult = await deployContract(config);
        return res.status(200).json(deployResult);

      default:
        return res.status(400).json({ error: 'Invalid method' });
    }

  } catch (error) {
    console.error('Blockchain API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

async function deployContract(config) {
  try {
    const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
    const wallet = new ethers.Wallet(config.privateKey, provider);

    // This is a simplified deployment - in practice you'd compile and deploy the actual contract
    return {
      success: false,
      message: 'Contract deployment requires local setup. Please use the deploy scripts in the blockchain directory.',
      instructions: [
        '1. Install dependencies: npm install',
        '2. Compile contract: npx hardhat compile',
        '3. Deploy: npx hardhat run scripts/deploy.js --network sepolia',
        '4. Update CONTRACT_ADDRESS environment variable'
      ]
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
