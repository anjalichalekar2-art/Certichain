const contractAddress = "0x6100f5ACe618Ca490e3E688E4518acaA5d8a808F";

const contractABI = [
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_certificateId",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_studentName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_course",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_institution",
                "type": "string"
            },
            {
                "internalType": "bytes32",
                "name": "_documentHash",
                "type": "bytes32"
            }
        ],
        "name": "registerCertificate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_certificateId",
                "type": "string"
            }
        ],
        "name": "getCertificate",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "certificateId",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "studentName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "course",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "institution",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "issueDate",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "documentHash",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bool",
                        "name": "valid",
                        "type": "bool"
                    },
                    {
                        "internalType": "address",
                        "name": "issuer",
                        "type": "address"
                    }
                ],
                "internalType": "struct CertificateRegistry.Certificate",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_certificateId",
                "type": "string"
            }
        ],
        "name": "revokeCertificate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

let provider;
let signer;
let contract;


// ===============================
// CONNECT METAMASK
// ===============================

document.getElementById("connectWallet").addEventListener("click", async () => {

    if (typeof window.ethereum === "undefined") {
        alert("MetaMask is not installed.");
        return;
    }

    try {

        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        });

        const account = accounts[0];

        document.getElementById("walletStatus").innerText =
            "Connected: " + account;

        // Ethers.js connection
        provider = new ethers.BrowserProvider(window.ethereum);

        signer = await provider.getSigner();

        contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
        );

        console.log("Wallet connected");
        console.log("Contract connected");

    } catch (error) {

        console.error(error);
        alert("Failed to connect MetaMask.");

    }

});


// ===============================
// REGISTER CERTIFICATE
// ===============================

document.getElementById("registerCertificate").addEventListener("click", async () => {

    if (!contract) {
        alert("Please connect MetaMask first.");
        return;
    }

    const certificateId =
        document.getElementById("certificateId").value;

    const studentName =
        document.getElementById("studentName").value;

    const course =
        document.getElementById("course").value;

    const institution =
        document.getElementById("institution").value;

    const fileInput =
    document.getElementById("certificateFile");

if (fileInput.files.length === 0) {
    alert("Please select a certificate file.");
    return;
}

const file = fileInput.files[0];

const fileBuffer = await file.arrayBuffer();

const documentHash =
    ethers.keccak256(new Uint8Array(fileBuffer)); 
    
    try {

        const transaction =
            await contract.registerCertificate(
                certificateId,
                studentName,
                course,
                institution,
                documentHash
            );

        alert("Transaction submitted. Waiting for confirmation...");

        await transaction.wait();

        alert("Certificate registered successfully!");

    } catch (error) {

        console.error(error);
        alert("Registration failed. Check the console for details.");

    }

});


// ===============================
// VERIFY CERTIFICATE
// ===============================

document.getElementById("verifyCertificate").addEventListener("click", async () => {
    if (!contract) {
        alert("Please connect MetaMask first.");
        return;
    }

    const certificateId =
        document.getElementById("verifyId").value.trim();

    const fileInput =
        document.getElementById("verifyFile");

    if (!certificateId) {
        alert("Please enter a Certificate ID.");
        return;
    }

    if (fileInput.files.length === 0) {
        alert("Please upload the certificate file.");
        return;
    }

    const file = fileInput.files[0];

    try {
        // Get certificate from blockchain
        const certificate =
            await contract.getCertificate(certificateId);

        // Read uploaded file
        const fileBuffer =
            await file.arrayBuffer();

        // Generate hash of uploaded file
        const uploadedHash =
            ethers.keccak256(
                new Uint8Array(fileBuffer)
            );

        // Compare uploaded hash with blockchain hash
        const hashMatches =
            uploadedHash.toLowerCase() ===
            certificate.documentHash.toLowerCase();

        const issueDate =
            new Date(Number(certificate.issueDate) * 1000);

        const status =
            certificate.valid
                ? "VALID ✅"
                : "REVOKED ❌";

        const authenticity =
            hashMatches
                ? "AUTHENTIC DOCUMENT ✅"
                : "DOCUMENT TAMPERED ❌";

        document.getElementById("certificateResult").innerHTML = `
            <strong>Certificate Found</strong><br><br>

            <b>Certificate ID:</b>
            ${certificate.certificateId}<br>

            <b>Student:</b>
            ${certificate.studentName}<br>

            <b>Course:</b>
            ${certificate.course}<br>

            <b>Institution:</b>
            ${certificate.institution}<br>

            <b>Issue Date:</b>
            ${issueDate.toLocaleString()}<br>

            <b>Certificate Status:</b>
            ${status}<br>

            <b>Document Authenticity:</b>
            ${authenticity}<br><br>

            <b>Issuer:</b>
            ${certificate.issuer}
        `;

    } catch (error) {
        console.error(error);

        document.getElementById("certificateResult").innerHTML =
            "<b>Certificate not found ❌</b>";
    }
});

// ===============================
// REVOKE CERTIFICATE
// ===============================

document.getElementById("revokeCertificate").addEventListener("click", async () => {

    if (!contract) {
        alert("Please connect MetaMask first.");
        return;
    }

    const certificateId =
        document.getElementById("revokeId").value;

    try {

        const transaction =
            await contract.revokeCertificate(certificateId);

        alert("Revocation transaction submitted...");

        await transaction.wait();

        alert("Certificate revoked successfully!");

    } catch (error) {

        console.error(error);
        alert("Revocation failed. Check the console for details.");

    }

});