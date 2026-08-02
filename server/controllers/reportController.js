import Member from '../models/Member.js';
import Family from '../models/Family.js';
import Donation from '../models/Donation.js';
import { Parser } from 'json2csv';
import XLSX from 'xlsx';

// Helper to format date
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US');
};

export const generateGenealogyReport = async (req, res) => {
  try {
    const { format = 'json' } = req.query;

    const members = await Member.find()
      .populate('family', 'familyName familyNumber')
      .populate('father mother husband wife', 'name')
      .lean();

    const reportData = members.map(m => ({
      'Full Name': m.name,
      'Family Number': m.familyNumber || '',
      'Roll Number': m.rollNumber || '',
      'Generation': m.generation || '',
      'Gender': m.gender || '',
      'Date of Birth': formatDate(m.dob),
      'Is Alive': m.isAlive ? 'Yes' : 'No',
      'Date of Death': formatDate(m.dod),
      'Family': m.family?.familyName || '',
      'Father': m.father?.name || '',
      'Mother': m.mother?.name || '',
      'Husband': m.husband?.name || '',
      'Wife': m.wife?.name || '',
      'Phone': m.phone || '',
      'Email': m.email || '',
      'Current Address': m.currentAddress || '',
      'Permanent Address': m.permanentAddress || '',
      'Occupation': m.occupation || '',
      'Education': m.education || '',
    }));

    if (format === 'csv') {
      const parser = new Parser();
      const csv = parser.parse(reportData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=genealogy-report.csv');
      return res.send(csv);
    }

    if (format === 'excel') {
      const ws = XLSX.utils.json_to_sheet(reportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Genealogy');
      const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=genealogy-report.xlsx');
      return res.send(buffer);
    }

    res.json(reportData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateFamilyReport = async (req, res) => {
  try {
    const { familyId, format = 'json' } = req.query;

    const query = familyId ? { _id: familyId } : {};
    const families = await Family.find(query)
      .populate('headOfFamily', 'name')
      .lean();

    const reportData = await Promise.all(families.map(async (family) => {
      const members = await Member.find({ family: family._id })
        .select('name gender isAlive dob generation')
        .lean();

      return {
        'Family Name': family.familyName,
        'Family Number': family.familyNumber,
        'Clan': family.clan || '',
        'Head of Family': family.headOfFamily?.name || '',
        'Total Members': members.length,
        'Members': members.map(m => m.name).join(', '),
        'Current Address': family.currentAddress || '',
        'Origin': family.origin || '',
      };
    }));

    if (format === 'csv') {
      const parser = new Parser();
      const csv = parser.parse(reportData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=family-report.csv');
      return res.send(csv);
    }

    if (format === 'excel') {
      const ws = XLSX.utils.json_to_sheet(reportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Families');
      const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=family-report.xlsx');
      return res.send(buffer);
    }

    res.json(reportData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateGenerationReport = async (req, res) => {
  try {
    const { format = 'json' } = req.query;

    const generationStats = await Member.aggregate([
      {
        $group: {
          _id: '$generation',
          count: { $sum: 1 },
          males: {
            $sum: { $cond: [{ $eq: ['$gender', 'male'] }, 1, 0] },
          },
          females: {
            $sum: { $cond: [{ $eq: ['$gender', 'female'] }, 1, 0] },
          },
          living: {
            $sum: { $cond: ['$isAlive', 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const reportData = generationStats.map(g => ({
      'Generation': g._id || 'Unknown',
      'Total Members': g.count,
      'Male': g.males,
      'Female': g.females,
      'Living': g.living,
      'Deceased': g.count - g.living,
    }));

    if (format === 'csv') {
      const parser = new Parser();
      const csv = parser.parse(reportData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=generation-report.csv');
      return res.send(csv);
    }

    if (format === 'excel') {
      const ws = XLSX.utils.json_to_sheet(reportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Generations');
      const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=generation-report.xlsx');
      return res.send(buffer);
    }

    res.json(reportData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateDonationReport = async (req, res) => {
  try {
    const { startDate, endDate, format = 'json' } = req.query;

    let query = {};
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const donations = await Donation.find(query)
      .populate('donor', 'name phone email')
      .sort({ date: -1 })
      .lean();

    const reportData = donations.map(d => ({
      'Donor Name': d.donor?.name || 'Anonymous',
      'Amount': d.amount,
      'Currency': d.currency || 'NPR',
      'Purpose': d.purpose || 'general',
      'Description': d.description || '',
      'Date': formatDate(d.date),
      'Receipt': d.receipt || '',
    }));

    // Summary
    const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);

    if (format === 'csv') {
      const parser = new Parser();
      const csv = parser.parse(reportData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=donation-report.csv');
      return res.send(csv);
    }

    if (format === 'excel') {
      const ws = XLSX.utils.json_to_sheet(reportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Donations');
      const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=donation-report.xlsx');
      return res.send(buffer);
    }

    res.json({
      summary: {
        totalDonations: donations.length,
        totalAmount,
        averageAmount: donations.length > 0 ? totalAmount / donations.length : 0,
      },
      data: reportData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateDemographicReport = async (req, res) => {
  try {
    const { format = 'json' } = req.query;

    // Gender distribution
    const genderStats = await Member.aggregate([
      { $group: { _id: '$gender', count: { $sum: 1 } } },
    ]);

    // Life status
    const lifeStatus = await Member.aggregate([
      { $group: { _id: '$isAlive', count: { $sum: 1 } } },
    ]);

    // Marital status
    const maritalStats = await Member.aggregate([
      { $group: { _id: '$maritalStatus', count: { $sum: 1 } } },
    ]);

    // Blood group
    const bloodGroupStats = await Member.aggregate([
      { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
    ]);

    // Occupation
    const occupationStats = await Member.aggregate([
      { $group: { _id: '$occupation', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const reportData = {
      'Gender Distribution': genderStats,
      'Life Status': lifeStatus,
      'Marital Status': maritalStats,
      'Blood Groups': bloodGroupStats,
      'Top Occupations': occupationStats,
    };

    if (format === 'csv') {
      // Flatten for CSV
      const flatData = [];
      Object.entries(reportData).forEach(([category, items]) => {
        items.forEach(item => {
          flatData.push({
            Category: category,
            'Group': item._id || 'Unknown',
            Count: item.count,
          });
        });
      });
      const parser = new Parser();
      const csv = parser.parse(flatData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=demographic-report.csv');
      return res.send(csv);
    }

    if (format === 'excel') {
      const wb = XLSX.utils.book_new();
      Object.entries(reportData).forEach(([category, items]) => {
        const data = items.map(item => ({
          'Group': item._id || 'Unknown',
          'Count': item.count,
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, category.slice(0, 31));
      });
      const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=demographic-report.xlsx');
      return res.send(buffer);
    }

    res.json(reportData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateQRReport = async (req, res) => {
  try {
    const members = await Member.find()
      .select('name familyNumber rollNumber generation family photo')
      .lean();

    const reportData = members.map(m => ({
      'Name': m.name,
      'Family Number': m.familyNumber || '',
      'Roll Number': m.rollNumber || '',
      'Generation': m.generation || '',
      'Family': m.family || '',
      'QR Code URL': m.photo || '',
    }));

    if (req.query.format === 'csv') {
      const parser = new Parser();
      const csv = parser.parse(reportData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=qr-report.csv');
      return res.send(csv);
    }

    res.json(reportData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};