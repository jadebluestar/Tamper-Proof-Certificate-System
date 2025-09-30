import React, { useState } from 'react';
import Web3 from 'web3';

const QRGenerator = ({ account, isConnected }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    certificateId: '',
    courseName: '',
    issueDate: '',
    grade: ''
  });
  const [certificateHash, setCertificateHash] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateCertificateHash = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    if (!formData.studentName || !formData.certificateId || !formData.courseName) {
      alert('Please fill all required fields!');
      return;
    }

    setLoading(true);

    try {
      // Create certificate data object
      const certificateData = {
        studentName: formData.studentName,
        certificateId: formData.certificateId,
        courseName: formData.courseName,
        issueDate: formData.issueDate,
        grade: formData.grade,
        issuer: account,
        timestamp: Date.now()
      };

      // Generate hash using Web3
      const dataString = JSON.stringify(certificateData);
      const hash = Web3.utils.keccak256(dataString);
      setCertificateHash(hash);

      // Simulate a transaction hash
      const simulatedTxHash = '0x' + Math.random().toString(16).substr(2, 64);
      setTxHash(simulatedTxHash);

      // Generate clean, human-readable QR data
      const qrData = `
🎓 Certificate ID: ${formData.certificateId}
👤 Student: ${formData.studentName}
📚 Course: ${formData.courseName}
📅 Issue Date: ${formData.issueDate || 'N/A'}
🏆 Grade: ${formData.grade || 'N/A'}
🔗 Verify Hash: ${hash.substring(0, 10)}...
      `;

      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrData)}`;
      setQrCodeUrl(qrUrl);

      setLoading(false);
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Error generating certificate: ' + error.message);
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `certificate-${formData.certificateId}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyHash = () => {
    navigator.clipboard.writeText(certificateHash);
    alert('Certificate hash copied to clipboard!');
  };

  const resetForm = () => {
    setFormData({
      studentName: '',
      certificateId: '',
      courseName: '',
      issueDate: '',
      grade: ''
    });
    setCertificateHash('');
    setQrCodeUrl('');
    setTxHash('');
  };

  return (
    <div className="qr-generator">
      <h2>Generate Certificate & QR Code</h2>
      <p className="subtitle">Create tamper-proof blockchain certificates</p>

      <div className="form-container">
        {/* Form Inputs */}
        <div className="form-group">
          <label>Student Name *</label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleInputChange}
            placeholder="Enter student name"
            required
          />
        </div>
        <div className="form-group">
          <label>Certificate ID *</label>
          <input
            type="text"
            name="certificateId"
            value={formData.certificateId}
            onChange={handleInputChange}
            placeholder="e.g., CERT-2025-001"
            required
          />
        </div>
        <div className="form-group">
          <label>Course Name *</label>
          <input
            type="text"
            name="courseName"
            value={formData.courseName}
            onChange={handleInputChange}
            placeholder="Enter course name"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Issue Date</label>
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Grade</label>
            <input
              type="text"
              name="grade"
              value={formData.grade}
              onChange={handleInputChange}
              placeholder="e.g., A+"
            />
          </div>
        </div>

        <button
          className="generate-btn"
          onClick={generateCertificateHash}
          disabled={loading || !isConnected}
        >
          {loading ? '⏳ Generating...' : '🔐 Generate Certificate Hash & QR'}
        </button>
      </div>

      {qrCodeUrl && (
        <div className="result-container">
          <h3>✓ Certificate Generated Successfully!</h3>
          <div className="qr-section">
            <div className="qr-code-wrapper">
              <img src={qrCodeUrl} alt="Certificate QR Code" />
            </div>
            <div className="certificate-details">
              <div className="detail-item">
                <label>Certificate Hash:</label>
                <div className="hash-display">
                  <code>{certificateHash}</code>
                  <button onClick={copyHash} className="copy-btn">📋</button>
                </div>
              </div>
              <div className="detail-item">
                <label>Transaction Hash:</label>
                <div className="hash-display">
                  <code>{txHash}</code>
                </div>
              </div>
              <div className="detail-item">
                <label>Student:</label>
                <span>{formData.studentName}</span>
              </div>
              <div className="detail-item">
                <label>Certificate ID:</label>
                <span>{formData.certificateId}</span>
              </div>
            </div>
          </div>
          <div className="action-buttons">
            <button className="download-btn" onClick={downloadQRCode}>
              ⬇️ Download QR Code
            </button>
            <button className="reset-btn" onClick={resetForm}>
              🔄 Create New Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRGenerator;
