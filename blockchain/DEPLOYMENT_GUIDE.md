# Blockchain Deployment Guide

## Smart Contract Deployment

### Prerequisites
- Node.js 18+
- MetaMask browser extension
- Test ETH from Sepolia or Mumbai faucet

### Local Setup
```bash
cd blockchain
npm install
```

### Deploy to Testnet

#### 1. Sepolia Testnet (Recommended)
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

#### 2. Mumbai Testnet
```bash
npx hardhat run scripts/deploy.js --network mumbai
```

### Environment Variables for Vercel
Add these to your Vercel project settings:

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
SEPOLIA_CONTRACT_ADDRESS=0x... # After deployment
MUMBAI_RPC_URL=https://polygon-mumbai.infura.io/v3/YOUR_PROJECT_ID
MUMBAI_CONTRACT_ADDRESS=0x... # After deployment
DEPLOYER_PRIVATE_KEY=your-private-key-with-test-eth
```

### Contract ABI
The deployed contract will have these main functions:
- `createAssetToken()` - Create new asset tokens
- `buyTokens()` - Purchase asset tokens
- `getAsset()` - Get asset details
- `getAllAssets()` - Get all assets
- `getOwnership()` - Check token ownership

### API Endpoints
After deployment to Vercel, you can use:
- `GET /api/blockchain?method=getAssets` - Get all assets
- `GET /api/blockchain?method=getAsset&assetId=1` - Get specific asset
- `GET /api/blockchain?method=getOwnership&assetId=1&owner=0x...` - Check ownership

### Testing
1. Get test ETH from faucet
2. Deploy contract
3. Update environment variables
4. Test API endpoints
5. Connect frontend to deployed contract
