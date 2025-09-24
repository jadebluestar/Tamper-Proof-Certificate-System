# Blockchain Website

This project is a basic web application designed to interact with the CertificateRegistry smart contract on the Ethereum blockchain. It provides a user-friendly interface to test the functionalities of the smart contract.

## Project Structure

```
blockchain-website
├── public
│   └── index.html          # Main HTML file for the website
├── src
│   ├── App.js              # Main React component
│   ├── components
│   │   └── ContractTester.js # Component to interact with the smart contract
│   ├── abi
│   │   └── CertificateRegistry.json # ABI for the CertificateRegistry contract
│   └── utils
│       └── web3.js        # Utility for Web3 instance
├── package.json            # npm configuration file
└── README.md               # Project documentation
```

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd blockchain-website
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   ```
   npm start
   ```

## Usage

Once the application is running, navigate to `http://localhost:3000` in your web browser. You will be able to interact with the CertificateRegistry smart contract through the user interface provided by the ContractTester component.

## Smart Contract

The application interacts with the CertificateRegistry smart contract. Ensure that the contract is deployed on the Ethereum network you are connecting to. The ABI for the contract is located in the `src/abi/CertificateRegistry.json` file.

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the project.