# Certichain
Blockchain-Based Certificate Verification System using Solidity and Ethereum

CertiChain is a blockchain-based academic certificate verification system that allows institutions to register certificates and enables users to verify their authenticity using cryptographic hashing and Ethereum-compatible blockchain technology.

Features
🎓 Certificate registration
🔐 Cryptographic document hashing
⛓️ Blockchain-based certificate storage
🔍 Certificate verification
🚫 Certificate revocation
🦊 MetaMask integration
🌐 Ethereum-compatible blockchain
📄 Document authenticity verification


CertiChain/
│
├── contracts/
│   └── CertificateRegistry.sol
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── screenshots/
│   ├── dashboard.png
│   ├── registration.png
│   ├── verification.png
│   └── tampered.png
│
├── README.md
└── LICENSE

  ┌──────────────────────┐
             │      User / Issuer   │
             └──────────┬───────────┘
                        ↓
             ┌──────────────────────┐
             │   CertiChain Web UI  │
             └──────────┬───────────┘
                        ↓
             ┌──────────────────────┐
             │      MetaMask        │
             └──────────┬───────────┘
                        ↓
             ┌──────────────────────┐
             │      Ethers.js       │
             └──────────┬───────────┘
                        ↓
             ┌──────────────────────┐
             │ Solidity Smart       │
             │ Contract             │
             └──────────┬───────────┘
                        ↓
             ┌──────────────────────┐
             │ Blockchain / Ganache │
             └──────────────────────┘

   Upload Certificate
       ↓
Generate Hash
       ↓
Store / Retrieve Blockchain Record
       ↓
Compare Hashes
       ↓
 ┌───────────────┐
 │               │
MATCH         MISMATCH
 │               │
 ↓               ↓
AUTHENTIC      TAMPERED
