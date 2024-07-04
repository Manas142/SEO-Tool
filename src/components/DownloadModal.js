import React from 'react';
import '../DownloadModal.css'; // Adjust the path to the correct location

const DownloadModal = ({ onClose, onDownload }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Select Download Format</h2>
        <button onClick={() => onDownload('csv')} className="modal-button">Download as CSV</button>
        <button onClick={() => onDownload('pdf')} className="modal-button">Download as PDF</button>
        <button onClick={onClose} className="modal-button close-button">Close</button>
      </div>
    </div>
  );
};

export default DownloadModal;
