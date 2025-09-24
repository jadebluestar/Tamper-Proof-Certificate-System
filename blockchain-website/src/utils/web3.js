import Web3 from 'web3';

let web3;

const initWeb3 = () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        window.ethereum.request({ method: 'eth_requestAccounts' });
    } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
    } else {
        console.error('No Ethereum browser detected. You can check out MetaMask!');
    }
    return web3;
};

export default initWeb3;