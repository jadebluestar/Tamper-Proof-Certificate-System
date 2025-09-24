// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CertificateRegistry
 * @dev Ethereum-secured certificate verification system
 */
contract CertificateRegistry {
    
    struct Certificate {
        string studentName;
        string rollNumber;
        string courseName;
        string grade;
        string institutionName;
        uint256 issueDate;
        bytes32 certificateHash;
        address issuer;
        bool isValid;
        bool exists;
    }
    
    mapping(bytes32 => Certificate) public certificates;
    mapping(address => bool) public authorizedIssuers;
    bytes32[] public allCertificateHashes;
    
    address public owner;
    uint256 public totalCertificates;
    
    event CertificateIssued(
        bytes32 indexed certificateHash,
        string indexed rollNumber,
        string studentName,
        address indexed issuer
    );
    
    event CertificateRevoked(bytes32 indexed certificateHash);
    event IssuerAuthorized(address indexed issuer);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    modifier onlyAuthorizedIssuer() {
        require(authorizedIssuers[msg.sender], "Not authorized");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        authorizedIssuers[msg.sender] = true;
    }
    
    function authorizeIssuer(address _issuer) external onlyOwner {
        authorizedIssuers[_issuer] = true;
        emit IssuerAuthorized(_issuer);
    }
    
    function issueCertificate(
        string memory _studentName,
        string memory _rollNumber,
        string memory _courseName,
        string memory _grade,
        string memory _institutionName
    ) external onlyAuthorizedIssuer returns (bytes32) {
        
        bytes32 certificateHash = keccak256(abi.encodePacked(
            _studentName,
            _rollNumber,
            _courseName,
            _grade,
            _institutionName,
            msg.sender,
            block.timestamp,
            totalCertificates
        ));
        
        require(!certificates[certificateHash].exists, "Certificate exists");
        
        certificates[certificateHash] = Certificate({
            studentName: _studentName,
            rollNumber: _rollNumber,
            courseName: _courseName,
            grade: _grade,
            institutionName: _institutionName,
            issueDate: block.timestamp,
            certificateHash: certificateHash,
            issuer: msg.sender,
            isValid: true,
            exists: true
        });
        
        allCertificateHashes.push(certificateHash);
        totalCertificates++;
        
        emit CertificateIssued(certificateHash, _rollNumber, _studentName, msg.sender);
        return certificateHash;
    }
    
    function verifyCertificate(bytes32 _certificateHash) 
        external view returns (
            bool isValid,
            bool exists,
            string memory studentName,
            string memory rollNumber,
            string memory courseName,
            string memory grade,
            string memory institutionName,
            uint256 issueDate,
            address issuer
        ) 
    {
        Certificate memory cert = certificates[_certificateHash];
        return (
            cert.isValid,
            cert.exists,
            cert.studentName,
            cert.rollNumber,
            cert.courseName,
            cert.grade,
            cert.institutionName,
            cert.issueDate,
            cert.issuer
        );
    }
    
    function revokeCertificate(bytes32 _certificateHash) external {
        require(certificates[_certificateHash].exists, "Certificate not found");
        require(
            msg.sender == certificates[_certificateHash].issuer || msg.sender == owner,
            "Not authorized to revoke"
        );
        
        certificates[_certificateHash].isValid = false;
        emit CertificateRevoked(_certificateHash);
    }
}