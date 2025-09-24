const hre = require("hardhat");

async function main() {
  // Load deployment info
  let contractAddress;
  try {
    const deploymentInfo = require('../deployment-info.json');
    contractAddress = deploymentInfo.contractAddress;
  } catch (error) {
    console.log("❌ deployment-info.json not found. Deploy contract first!");
    return;
  }
  
  console.log("🧪 Testing Certificate System on Sepolia");
  console.log("========================================");
  console.log("📍 Contract Address:", contractAddress);
  
  // Get contract instance
  const [issuer] = await hre.ethers.getSigners();
  console.log("👤 Testing with account:", issuer.address);
  
  const CertificateRegistry = await hre.ethers.getContractFactory("CertificateRegistry");
  const contract = CertificateRegistry.attach(contractAddress);
  
  // Test data
  const testCertificate = {
    studentName: "John Doe",
    rollNumber: "CS21B001",
    courseName: "Bachelor of Computer Science",
    grade: "A+",
    institutionName: "ABC University"
  };
  
  console.log("\n🎓 Issuing test certificate...");
  console.log(`Student: ${testCertificate.studentName}`);
  console.log(`Roll Number: ${testCertificate.rollNumber}`);
  console.log(`Course: ${testCertificate.courseName}`);
  
  try {
    // Issue certificate
    console.log("\n📤 Sending transaction...");
    const tx = await contract.issueCertificate(
      testCertificate.studentName,
      testCertificate.rollNumber,
      testCertificate.courseName,
      testCertificate.grade,
      testCertificate.institutionName
    );
    
    console.log("⏳ Waiting for confirmation...");
    const receipt = await tx.wait();
    
    // Get certificate hash from event
    const event = receipt.events.find(e => e.event === 'CertificateIssued');
    const certificateHash = event.args.certificateHash;
    
    console.log("\n✅ Certificate issued successfully!");
    console.log("📋 Certificate Hash:", certificateHash);
    console.log("🔗 Transaction:", `https://sepolia.etherscan.io/tx/${tx.hash}`);
    
    // Verify the certificate
    console.log("\n🔍 Verifying certificate...");
    const verification = await contract.verifyCertificate(certificateHash);
    
    console.log("\n📊 Verification Results:");
    console.log("========================================");
    console.log("Valid:", verification.isValid);
    console.log("Exists:", verification.exists);
    console.log("Student Name:", verification.studentName);
    console.log("Roll Number:", verification.rollNumber);
    console.log("Course:", verification.courseName);
    console.log("Grade:", verification.grade);
    console.log("Institution:", verification.institutionName);
    console.log("Issue Date:", new Date(verification.issueDate * 1000).toLocaleString());
    console.log("Issued By:", verification.issuer);
    
    // Get contract statistics
    console.log("\n📈 Contract Statistics:");
    const totalCerts = await contract.totalCertificates();
    const owner = await contract.owner();
    console.log("Total Certificates:", totalCerts.toString());
    console.log("Contract Owner:", owner);
    
    console.log("\n🎉 All tests passed!");
    console.log("\n💡 Use this certificate hash to test verification:");
    console.log(`Certificate Hash: ${certificateHash}`);
    
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    
    if (error.message.includes("Not authorized")) {
      console.log("\n💡 Fix: You're not authorized to issue certificates");
      console.log("   The deployer account is automatically authorized");
    } else if (error.message.includes("insufficient funds")) {
      console.log("\n💡 Fix: Get more Sepolia ETH from faucet");
    }
  }
}

main().catch(console.error);