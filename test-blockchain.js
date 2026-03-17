const { ethers } = require('ethers');

// Test blockchain connectivity and contract functionality
async function testBlockchain() {
  console.log('🔍 Testing Blockchain Components...\n');
  
  // 1. Test RPC Connection
  console.log('1. Testing RPC Connection...');
  try {
    const provider = new ethers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/demo');
    const blockNumber = await provider.getBlockNumber();
    console.log('✅ RPC Connected - Current Block:', blockNumber);
  } catch (error) {
    console.log('❌ RPC Connection Failed:', error.message);
  }
  
  // 2. Test Contract ABI
  console.log('\n2. Testing Contract ABI...');
  try {
    const contractABI = [
      "function createAssetToken(string memory _name, string memory _assetType, uint256 _totalValue, uint256 _totalSupply) external",
      "function buyTokens(uint256 _assetId, uint256 _amount) external payable",
      "function getAsset(uint256 _assetId) external view returns (tuple(string name, string assetType, uint256 totalValue, uint256 totalSupply, uint256 tokenPrice, bool isActive))",
      "function getAllAssets() external view returns (tuple(string name, string assetType, uint256 totalValue, uint256 totalSupply, uint256 tokenPrice, bool isActive)[])",
      "function getOwnership(uint256 _assetId, address _owner) external view returns (uint256)"
    ];
    console.log('✅ Contract ABI loaded -', contractABI.length, 'functions');
  } catch (error) {
    console.log('❌ Contract ABI Error:', error.message);
  }
  
  // 3. Test Mock Functions
  console.log('\n3. Testing Mock Functions...');
  try {
    const mockContract = {
      getAllAssets: async () => {
        return [
          {
            name: "Luxury Apartment Mumbai",
            assetType: "real_estate",
            totalValue: ethers.parseEther("10").toString(),
            totalSupply: 10000,
            tokenPrice: ethers.parseEther("0.001").toString(),
            isActive: true
          },
          {
            name: "Gold Reserve", 
            assetType: "gold",
            totalValue: ethers.parseEther("5").toString(),
            totalSupply: 5000,
            tokenPrice: ethers.parseEther("0.001").toString(),
            isActive: true
          }
        ];
      }
    };
    
    const assets = await mockContract.getAllAssets();
    console.log('✅ Mock Functions Working - Found', assets.length, 'assets');
    assets.forEach((asset, index) => {
      console.log(`   Asset ${index + 1}: ${asset.name} (${asset.assetType})`);
    });
  } catch (error) {
    console.log('❌ Mock Functions Error:', error.message);
  }
  
  // 4. Test Ethers.js Version
  console.log('\n4. Testing Ethers.js...');
  try {
    console.log('✅ Ethers.js Version:', ethers.version);
    console.log('✅ Parse Ether Test:', ethers.parseEther("1").toString());
  } catch (error) {
    console.log('❌ Ethers.js Error:', error.message);
  }
  
  console.log('\n🎉 Blockchain Test Complete!');
}

testBlockchain().catch(console.error);
