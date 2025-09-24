const hre = require("hardhat");
const fs = require("fs");
const { createPublicClient, createWalletClient, http } = require('viem');
const { sepolia } = require('viem/chains');
const { privateKeyToAccount } = require('viem/accounts');

async function main() {
  console.log("🚀 Starting deployment to Sepolia with Viem...");
  console.log("=====================================");
  
  // Create account from private key
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY not found in .env file");
  }
  
  const account = privateKeyToAccount(`0x${privateKey.replace('0x', '')}`);
  
  // Create clients
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(process.env.ALCHEMY_URL || `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`)
  });
  
  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(process.env.ALCHEMY_URL || `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`)
  });
  
  console.log("📍 Network: sepolia");
  console.log("👤 Deploying with account:", account.address);
  
  // Check balance
  const balance = await publicClient.getBalance({ address: account.address });
  const balanceInEth = Number(balance) / 1e18;
  console.log("💰 Account balance:", balanceInEth.toFixed(4), "ETH");
  
  if (balanceInEth < 0.01) {
    console.log("⚠️  WARNING: Low balance! Get more Sepolia ETH from faucet");
  }
  
  console.log("\n🔨 Compiling contract...");
  
  // Get contract factory (Hardhat still compiles)
  const CertificateRegistry = await hre.ethers.getContractFactory("CertificateRegistry");
  
  console.log("📤 Deploying CertificateRegistry...");
  
  // Deploy using Viem
  const hash = await walletClient.deployContract({
    abi: CertificateRegistry.interface.abi,
    bytecode: CertificateRegistry.bytecode,
    args: [], // Add constructor arguments here if any
  });
  
  console.log("🔗 Transaction Hash:", hash);
  console.log("⏳ Waiting for deployment confirmation...");
  
  // Wait for transaction receipt
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  
  const contractAddress = receipt.contractAddress;
  
  console.log("\n🎉 DEPLOYMENT SUCCESSFUL!");
  console.log("=====================================");
  console.log("📍 Contract Address:", contractAddress);
  console.log("🔗 Transaction Hash:", hash);
  console.log("⛽ Gas Used:", receipt.gasUsed.toString());
  console.log("🔗 Etherscan URL:", `https://sepolia.etherscan.io/address/${contractAddress}`);
  
  // Wait for block confirmations
  console.log("\n⏳ Waiting for 5 block confirmations...");
  let currentBlock = await publicClient.getBlockNumber();
  const targetBlock = currentBlock + 5n;
  
  while (currentBlock < targetBlock) {
    await new Promise(resolve => setTimeout(resolve, 12000)); // Wait ~12 seconds (block time)
    currentBlock = await publicClient.getBlockNumber();
    console.log(`   Block ${currentBlock}/${targetBlock}`);
  }
  console.log("✅ Confirmations complete!");
  
  // Verify contract on Etherscan
  if (process.env.ETHERSCAN_API_KEY) {
    try {
      console.log("\n🔍 Verifying contract on Etherscan...");
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan!");
    } catch (error) {
      console.log("❌ Verification failed:", error.message);
      console.log("💡 You can verify manually at https://sepolia.etherscan.io");
    }
  }
  
  // Save deployment information
  const deploymentData = {
    contractAddress: contractAddress,
    deployerAddress: account.address,
    transactionHash: hash,
    network: "sepolia",
    chainId: sepolia.id,
    blockNumber: receipt.blockNumber.toString(),
    gasUsed: receipt.gasUsed.toString(),
    timestamp: new Date().toISOString(),
    etherscanUrl: `https://sepolia.etherscan.io/address/${contractAddress}`,
    abi: JSON.stringify(CertificateRegistry.interface.abi, null, 2)
  };
  
  // Save to files
  fs.writeFileSync(
    './deployment-info.json',
    JSON.stringify(deploymentData, null, 2)
  );
  
  fs.writeFileSync(
    './contract-abi.json',
    JSON.stringify(CertificateRegistry.interface.abi, null, 2)
  );
  
  console.log("\n📄 Files saved:");
  console.log("   - deployment-info.json (deployment details)");
  console.log("   - contract-abi.json (contract interface)");
  
  console.log("\n🎯 NEXT STEPS:");
  console.log("1. Update your .env file with:");
  console.log(`   CONTRACT_ADDRESS=${contractAddress}`);
  console.log("2. Test the contract with Viem");
  console.log("3. Update frontend with contract address and ABI");
  
  console.log("\n🎉 Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ DEPLOYMENT FAILED:");
    console.error("=====================================");
    console.error(error);
    console.log("\n💡 Common fixes:");
    console.log("- Check your .env file has correct ALCHEMY_API_KEY");
    console.log("- Make sure you have Sepolia ETH in your wallet");
    console.log("- Verify your PRIVATE_KEY is correct");
    console.log("- Install Viem: npm install viem");
    process.exit(1);
  });