import ExcelJS from 'exceljs';

export const exportDonationsToExcel = async (donations) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Donations');

  // Define columns
  worksheet.columns = [
    { header: 'Receipt #', key: 'receiptNumber', width: 15 },
    { header: 'Donor Name', key: 'donorName', width: 25 },
    { header: 'Phone', key: 'donorPhone', width: 15 },
    { header: 'Email', key: 'donorEmail', width: 25 },
    { header: 'Amount', key: 'amount', width: 15 },
    { header: 'Payment Method', key: 'paymentMethod', width: 18 },
    { header: 'Category', key: 'category', width: 15 },
    { header: 'Date', key: 'donationDate', width: 15 },
    { header: 'Status', key: 'paymentStatus', width: 12 },
    { header: 'Purpose', key: 'purpose', width: 30 },
    { header: 'Remarks', key: 'remarks', width: 30 },
  ];

  // Style header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2B5797' },
  };
  headerRow.alignment = { horizontal: 'center' };
  headerRow.height = 25;

  // Add data rows
  donations.forEach((donation, index) => {
    const row = worksheet.addRow({
      receiptNumber: donation.receiptNumber || 'N/A',
      donorName: donation.donorName || 'Anonymous',
      donorPhone: donation.donorPhone || 'N/A',
      donorEmail: donation.donorEmail || 'N/A',
      amount: donation.amount || 0,
      paymentMethod: donation.paymentMethod ? donation.paymentMethod.toUpperCase() : 'N/A',
      category: donation.category ? donation.category.toUpperCase() : 'GENERAL',
      donationDate: donation.donationDate ? new Date(donation.donationDate).toLocaleDateString() : 'N/A',
      paymentStatus: donation.paymentStatus ? donation.paymentStatus.toUpperCase() : 'PENDING',
      purpose: donation.purpose || 'N/A',
      remarks: donation.remarks || 'N/A',
    });

    // Style rows
    const rowNumber = index + 2;
    const rowObj = worksheet.getRow(rowNumber);
    rowObj.alignment = { horizontal: 'left' };
    rowObj.height = 20;

    // Color status cells
    const statusCell = rowObj.getCell(9);
    if (donation.paymentStatus === 'completed') {
      statusCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD4EDDA' },
      };
      statusCell.font = { color: { argb: 'FF155724' } };
    } else if (donation.paymentStatus === 'pending') {
      statusCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFF3CD' },
      };
      statusCell.font = { color: { argb: 'FF856404' } };
    } else if (donation.paymentStatus === 'failed') {
      statusCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF8D7DA' },
      };
      statusCell.font = { color: { argb: 'FF721C24' } };
    }
  });

  // Add summary row
  const totalRow = worksheet.addRow({
    receiptNumber: 'TOTAL',
    donorName: '',
    donorPhone: '',
    donorEmail: '',
    amount: donations.reduce((sum, d) => sum + (d.amount || 0), 0),
    paymentMethod: '',
    category: '',
    donationDate: '',
    paymentStatus: '',
    purpose: '',
    remarks: '',
  });

  const totalRowObj = worksheet.getRow(worksheet.rowCount);
  totalRowObj.font = { bold: true };
  totalRowObj.alignment = { horizontal: 'left' };
  totalRowObj.height = 22;
  totalRowObj.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE8E8E8' },
  };

  // Format currency column
  worksheet.getColumn('amount').numFmt = '$#,##0.00';

  return await workbook.xlsx.writeBuffer();
};