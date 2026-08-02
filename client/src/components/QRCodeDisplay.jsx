// src/components/QRCodeDisplay.jsx
import { useQuery } from '@tanstack/react-query';
import { getOrganization } from '../api/organization';
import { getMembers } from '../api/members';

const QRCodeDisplay = () => {
  // Try to get QR code from organization or member data
  const { data: orgData } = useQuery({
    queryKey: ['organization'],
    queryFn: getOrganization,
  });

  const { data: membersData } = useQuery({
    queryKey: ['members', { limit: 1 }],
    queryFn: () => getMembers({ limit: 1 }),
  });

  // Look for QR code image in various places
  const qrImage = orgData?.qrCode || 
                  membersData?.data?.[0]?.qrCode ||
                  orgData?.logo;

  if (!qrImage) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation QR Code</h3>
        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">No QR code available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation QR Code</h3>
      <div className="flex flex-col items-center">
        <img
          src={qrImage}
          alt="Donation QR Code"
          className="max-w-[200px] max-h-[200px] object-contain"
        />
        <p className="mt-4 text-sm text-gray-500 text-center">
          Scan this QR code to make a donation
        </p>
      </div>
    </div>
  );
};

export default QRCodeDisplay;