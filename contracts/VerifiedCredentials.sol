// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VerifiedCredentials {
    struct Credential {
        address issuer;
        address holder;
        bytes32 dataHash;
        uint256 issuedAt;
        bool revoked;
    }

    struct IssuerProfile {
        string domain;
        bool isVerified;
        uint256 verifiedAt;
        string organizationName;
        string description;
    }

    mapping(uint256 => Credential) public credentials;
    mapping(address => uint256[]) public userCredentials;
    mapping(address => IssuerProfile) public issuerProfiles;
    
    uint256 public nextCredentialId = 1;
    address public admin;
    
    uint256 public verificationValidityPeriod = 7776000; // 90 days
    mapping(address => bool) public verificationOracles; // Trusted services that can verify domains

    event CredentialIssued(uint256 indexed credentialId, address indexed issuer, address indexed holder, bytes32 dataHash, string domain);
    event CredentialRevoked(uint256 indexed credentialId);
    event IssuerDomainRegistered(address indexed issuer, string domain);
    event IssuerDomainVerified(address indexed issuer, string domain, uint256 timestamp);

    constructor() {
        admin = msg.sender;
        verificationOracles[msg.sender] = true; // Admin can verify initially
    }

    function addVerificationOracle(address oracle) external {
        require(msg.sender == admin, "Only admin");
        verificationOracles[oracle] = true;
    }

    function registerDomain(
        string calldata domain,
        string calldata organizationName,
        string calldata description
    ) external {
        require(bytes(domain).length > 0, "Domain cannot be empty");
        
        issuerProfiles[msg.sender] = IssuerProfile({
            domain: domain,
            isVerified: false,
            verifiedAt: 0,
            organizationName: organizationName,
            description: description
        });

        emit IssuerDomainRegistered(msg.sender, domain);
    }

    function verifyDomainOwnership(address issuer, bool verified) external {
        require(verificationOracles[msg.sender], "Not authorized oracle");
        require(bytes(issuerProfiles[issuer].domain).length > 0, "No domain registered");

        issuerProfiles[issuer].isVerified = verified;
        if (verified) {
            issuerProfiles[issuer].verifiedAt = block.timestamp;
            emit IssuerDomainVerified(issuer, issuerProfiles[issuer].domain, block.timestamp);
        }
    }

    function isDomainVerificationValid(address issuer) public view returns (bool) {
        IssuerProfile memory profile = issuerProfiles[issuer];
        return profile.isVerified && 
               (block.timestamp - profile.verifiedAt <= verificationValidityPeriod);
    }

    function issueCredential(address holder, bytes32 dataHash) external {
        require(isDomainVerificationValid(msg.sender), "Domain not verified or expired");

        credentials[nextCredentialId] = Credential({
            issuer: msg.sender,
            holder: holder,
            dataHash: dataHash,
            issuedAt: block.timestamp,
            revoked: false
        });

        userCredentials[holder].push(nextCredentialId);
        emit CredentialIssued(nextCredentialId, msg.sender, holder, dataHash, issuerProfiles[msg.sender].domain);
        nextCredentialId++;
    }

    function revokeCredential(uint256 credentialId) external {
        require(credentials[credentialId].issuer == msg.sender, "Not issuer");
        credentials[credentialId].revoked = true;
        emit CredentialRevoked(credentialId);
    }

    function getUserCredentials(address user) external view returns (uint256[] memory) {
        return userCredentials[user];
    }

    function verifyCredentialData(uint256 credentialId, string calldata credentialData) external view returns (bool) {
        bytes memory credentialBytes = bytes(credentialData);
        bytes32 providedHash = keccak256(credentialBytes);
    
        return credentials[credentialId].dataHash == providedHash && !credentials[credentialId].revoked;
    }
    function getIssuerProfile(address issuer) external view returns (
        string memory domain,
        bool isVerified,
        uint256 verifiedAt,
        string memory organizationName,
        string memory description
    ) {
        IssuerProfile memory profile = issuerProfiles[issuer];
        return (
            profile.domain,
            profile.isVerified,
            profile.verifiedAt,
            profile.organizationName,
            profile.description
        );
    }
}