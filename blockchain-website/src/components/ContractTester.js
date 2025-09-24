import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import CertificateRegistry from '../abi/CertificateRegistry.json';

const ContractTester = () => {
    const [account, setAccount] = useState('');
    const [contract, setContract] = useState(null);
    const [data, setData] = useState('');

    useEffect(() => {
        const initWeb3 = async () => {
            const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);

            const networkId = await web3.eth.net.getId();
            const deployedNetwork = CertificateRegistry.networks[networkId];
            const instance = new web3.eth.Contract(
                CertificateRegistry.abi,
                deployedNetwork && deployedNetwork.address,
            );
            setContract(instance);
        };

        initWeb3();
    }, []);

    const handleTestFunction = async () => {
        if (contract) {
            const result = await contract.methods.yourMethodName().call({ from: account });
            setData(result);
        }
    };

    return (
        <div>
            <h1>Contract Tester</h1>
            <p>Account: {account}</p>
            <button onClick={handleTestFunction}>Test Contract Function</button>
            {data && <p>Result: {data}</p>}
        </div>
    );
};

export default ContractTester;