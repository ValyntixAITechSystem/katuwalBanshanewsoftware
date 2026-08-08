import React from 'react';
import { QrCodeIcon } from '@heroicons/react/24/outline';
import qrImagePath from "../assets/qrimg.png";

const QRCodeDisplay = () => {
  // Fixed QR image path - place your QR image in public/assets/qr-code.png
  // const qrImagePath = '../assets/qrimg.png';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 mb-3">
          <QrCodeIcon className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">QR Payment</h3>
        </div>
        
        <div className="relative w-48 h-48 bg-gray-50 rounded-lg border-2 border-gray-200 p-2">
          <img
            src={qrImagePath}
            alt="Payment QR Code"
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback if image doesn't load
              e.target.src = '/assets/qr-placeholder.png';
            }}
          />
        </div>
        
        <p className="mt-3 text-sm text-gray-600 text-center">
          Scan this QR code to make a donation
          <br />
          <span className="text-xs text-gray-500">
            (Fixed QR code for all donations)
          </span>
        </p>
        
        <button
          onClick={() => {
            // Download QR code functionality
            const link = document.createElement('a');
            link.download = 'qr-code.png';
            link.href = qrImagePath;
            link.click();
          }}
          className="mt-3 text-sm text-primary hover:text-primary-dark underline"
        >
          Download QR Code
        </button>
      </div>
    </div>
  );
};

export default QRCodeDisplay;