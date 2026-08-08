// // src/controllers/reportController.js
// import Member from '../models/Member.js';
// import Family from '../models/Family.js';
// import Donation from '../models/Donation.js';
// import { Parser } from 'json2csv';
// import XLSX from 'xlsx';

// // Helper to format date
// const formatDate = (date) => {
//   if (!date) return '';
//   return new Date(date).toLocaleDateString('en-US');
// };

// export const generateGenealogyReport = async (req, res) => {
//   try {
//     const { format = 'json' } = req.query;

//     const members = await Member.find()
//       .populate('family', 'familyName familyNumber')
//       .populate('father mother husband wife', 'name')
//       .lean();

//     const reportData = members.map(m => ({
//       'Full Name': m.name,
//       'Family Number': m.familyNumber || '',
//       'Roll Number': m.rollNumber || '',
//       'Generation': m.generation || '',
//       'Gender': m.gender || '',
//       'Date of Birth': formatDate(m.dob),
//       'Is Alive': m.isAlive ? 'Yes' : 'No',
//       'Date of Death': formatDate(m.dod),
//       'Family': m.family?.familyName || '',
//       'Father': m.father?.name || '',
//       'Mother': m.mother?.name || '',
//       'Husband': m.husband?.name || '',
//       'Wife': m.wife?.name || '',
//       'Phone': m.phone || '',
//       'Email': m.email || '',
//       'Current Address': m.currentAddress || '',
//       'Permanent Address': m.permanentAddress || '',
//       'Occupation': m.occupation || '',
//       'Education': m.education || '',
//     }));

//     if (format === 'csv') {
//       const parser = new Parser();
//       const csv = parser.parse(reportData);
//       res.setHeader('Content-Type', 'text/csv');
//       res.setHeader('Content-Disposition', 'attachment; filename=genealogy-report.csv');
//       return res.send(csv);
//     }

//     if (format === 'excel') {
//       const ws = XLSX.utils.json_to_sheet(reportData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Genealogy');
//       const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
//       res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//       res.setHeader('Content-Disposition', 'attachment; filename=genealogy-report.xlsx');
//       return res.send(buffer);
//     }

//     res.json(reportData);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const generateFamilyReport = async (req, res) => {
//   try {
//     const { familyId, format = 'json' } = req.query;

//     const query = familyId ? { _id: familyId } : {};
//     const families = await Family.find(query)
//       .populate('headOfFamily', 'name')
//       .lean();

//     const reportData = await Promise.all(families.map(async (family) => {
//       const members = await Member.find({ family: family._id })
//         .select('name gender isAlive dob generation')
//         .lean();

//       return {
//         'Family Name': family.familyName,
//         'Family Number': family.familyNumber,
//         'Clan': family.clan || '',
//         'Head of Family': family.headOfFamily?.name || '',
//         'Total Members': members.length,
//         'Members': members.map(m => m.name).join(', '),
//         'Current Address': family.currentAddress || '',
//         'Origin': family.origin || '',
//       };
//     }));

//     if (format === 'csv') {
//       const parser = new Parser();
//       const csv = parser.parse(reportData);
//       res.setHeader('Content-Type', 'text/csv');
//       res.setHeader('Content-Disposition', 'attachment; filename=family-report.csv');
//       return res.send(csv);
//     }

//     if (format === 'excel') {
//       const ws = XLSX.utils.json_to_sheet(reportData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Families');
//       const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
//       res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//       res.setHeader('Content-Disposition', 'attachment; filename=family-report.xlsx');
//       return res.send(buffer);
//     }

//     res.json(reportData);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const generateGenerationReport = async (req, res) => {
//   try {
//     const { format = 'json' } = req.query;

//     const generationStats = await Member.aggregate([
//       {
//         $group: {
//           _id: '$generation',
//           count: { $sum: 1 },
//           males: {
//             $sum: { $cond: [{ $eq: ['$gender', 'male'] }, 1, 0] },
//           },
//           females: {
//             $sum: { $cond: [{ $eq: ['$gender', 'female'] }, 1, 0] },
//           },
//           living: {
//             $sum: { $cond: ['$isAlive', 1, 0] },
//           },
//         },
//       },
//       { $sort: { _id: 1 } },
//     ]);

//     const reportData = generationStats.map(g => ({
//       'Generation': g._id || 'Unknown',
//       'Total Members': g.count,
//       'Male': g.males,
//       'Female': g.females,
//       'Living': g.living,
//       'Deceased': g.count - g.living,
//     }));

//     if (format === 'csv') {
//       const parser = new Parser();
//       const csv = parser.parse(reportData);
//       res.setHeader('Content-Type', 'text/csv');
//       res.setHeader('Content-Disposition', 'attachment; filename=generation-report.csv');
//       return res.send(csv);
//     }

//     if (format === 'excel') {
//       const ws = XLSX.utils.json_to_sheet(reportData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Generations');
//       const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
//       res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//       res.setHeader('Content-Disposition', 'attachment; filename=generation-report.xlsx');
//       return res.send(buffer);
//     }

//     res.json(reportData);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const generateDonationReport = async (req, res) => {
//   try {
//     const { startDate, endDate, format = 'json' } = req.query;

//     let query = {};
//     if (startDate && endDate) {
//       query.date = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate),
//       };
//     }

//     const donations = await Donation.find(query)
//       .populate('donor', 'name phone email')
//       .sort({ date: -1 })
//       .lean();

//     const reportData = donations.map(d => ({
//       'Donor Name': d.donor?.name || 'Anonymous',
//       'Amount': d.amount,
//       'Currency': d.currency || 'NPR',
//       'Purpose': d.purpose || 'general',
//       'Description': d.description || '',
//       'Date': formatDate(d.date),
//       'Receipt': d.receipt || '',
//     }));

//     // Summary
//     const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);

//     if (format === 'csv') {
//       const parser = new Parser();
//       const csv = parser.parse(reportData);
//       res.setHeader('Content-Type', 'text/csv');
//       res.setHeader('Content-Disposition', 'attachment; filename=donation-report.csv');
//       return res.send(csv);
//     }

//     if (format === 'excel') {
//       const ws = XLSX.utils.json_to_sheet(reportData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Donations');
//       const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
//       res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//       res.setHeader('Content-Disposition', 'attachment; filename=donation-report.xlsx');
//       return res.send(buffer);
//     }

//     res.json({
//       summary: {
//         totalDonations: donations.length,
//         totalAmount,
//         averageAmount: donations.length > 0 ? totalAmount / donations.length : 0,
//       },
//       data: reportData,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const generateDemographicReport = async (req, res) => {
//   try {
//     const { format = 'json' } = req.query;

//     // Gender distribution
//     const genderStats = await Member.aggregate([
//       { $group: { _id: '$gender', count: { $sum: 1 } } },
//     ]);

//     // Life status
//     const lifeStatus = await Member.aggregate([
//       { $group: { _id: '$isAlive', count: { $sum: 1 } } },
//     ]);

//     // Marital status
//     const maritalStats = await Member.aggregate([
//       { $group: { _id: '$maritalStatus', count: { $sum: 1 } } },
//     ]);

//     // Blood group
//     const bloodGroupStats = await Member.aggregate([
//       { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
//     ]);

//     // Occupation
//     const occupationStats = await Member.aggregate([
//       { $group: { _id: '$occupation', count: { $sum: 1 } } },
//       { $sort: { count: -1 } },
//       { $limit: 10 },
//     ]);

//     const reportData = {
//       'Gender Distribution': genderStats,
//       'Life Status': lifeStatus,
//       'Marital Status': maritalStats,
//       'Blood Groups': bloodGroupStats,
//       'Top Occupations': occupationStats,
//     };

//     if (format === 'csv') {
//       // Flatten for CSV
//       const flatData = [];
//       Object.entries(reportData).forEach(([category, items]) => {
//         items.forEach(item => {
//           flatData.push({
//             Category: category,
//             'Group': item._id || 'Unknown',
//             Count: item.count,
//           });
//         });
//       });
//       const parser = new Parser();
//       const csv = parser.parse(flatData);
//       res.setHeader('Content-Type', 'text/csv');
//       res.setHeader('Content-Disposition', 'attachment; filename=demographic-report.csv');
//       return res.send(csv);
//     }

//     if (format === 'excel') {
//       const wb = XLSX.utils.book_new();
//       Object.entries(reportData).forEach(([category, items]) => {
//         const data = items.map(item => ({
//           'Group': item._id || 'Unknown',
//           'Count': item.count,
//         }));
//         const ws = XLSX.utils.json_to_sheet(data);
//         XLSX.utils.book_append_sheet(wb, ws, category.slice(0, 31));
//       });
//       const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
//       res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//       res.setHeader('Content-Disposition', 'attachment; filename=demographic-report.xlsx');
//       return res.send(buffer);
//     }

//     res.json(reportData);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const generateQRReport = async (req, res) => {
//   try {
//     const members = await Member.find()
//       .select('name familyNumber rollNumber generation family photo')
//       .lean();

//     const reportData = members.map(m => ({
//       'Name': m.name,
//       'Family Number': m.familyNumber || '',
//       'Roll Number': m.rollNumber || '',
//       'Generation': m.generation || '',
//       'Family': m.family || '',
//       'QR Code URL': m.photo || '',
//     }));

//     if (req.query.format === 'csv') {
//       const parser = new Parser();
//       const csv = parser.parse(reportData);
//       res.setHeader('Content-Type', 'text/csv');
//       res.setHeader('Content-Disposition', 'attachment; filename=qr-report.csv');
//       return res.send(csv);
//     }

//     res.json(reportData);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

import Member from '../models/Member.js';
import Family from '../models/Family.js';
import Donation from '../models/Donation.js';
import { Parser } from 'json2csv';
import XLSX from 'xlsx';

// Helper to format date
const formatDate = (date) => {
  if (!date) return '';
  try {
    return new Date(date).toLocaleDateString('en-US');
  } catch {
    return '';
  }
};

export const generateGenealogyReport = async (req, res) => {
  try {
    const { format = 'json', familyId } = req.query;

    let query = {};
    if (familyId) {
      query.family = familyId;
    }

    const members = await Member.find(query)
      .populate('family', 'familyName familyNumber')
      .populate('father mother husband wife spouse', 'name memberNumber')
      .lean();

    const reportData = members.map(m => ({
      'Member ID': m.memberNumber || '',
      'Full Name': m.name || '',
      'Surname': m.surname || '',
      'Family Number': m.familyNumber || '',
      'Roll Number': m.rollNumber || '',
      'Generation': m.generation || '',
      'Gender': m.gender || '',
      'Date of Birth': formatDate(m.dob),
      'Is Alive': m.isAlive ? 'Yes' : 'No',
      'Date of Death': formatDate(m.dod),
      'Family': m.family?.familyName || '',
      'Father': m.father?.name || '',
      'Father ID': m.father?.memberNumber || '',
      'Mother': m.mother?.name || '',
      'Mother ID': m.mother?.memberNumber || '',
      'Spouse': m.spouse?.name || '',
      'Spouse ID': m.spouse?.memberNumber || '',
      'Phone': m.phone || '',
      'Email': m.email || '',
      'District': m.district || '',
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

    res.json({
      total: reportData.length,
      data: reportData,
    });
  } catch (error) {
    console.error('generateGenealogyReport Error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const generateFamilyReport = async (req, res) => {
  try {
    const { familyId, format = 'excel' } = req.query;

    if (!familyId) {
      return res.status(400).json({ message: 'Family ID is required' });
    }

    const family = await Family.findById(familyId)
      .populate('headOfFamily', 'name memberNumber phone')
      .lean();

    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }

    const members = await Member.find({ family: familyId })
      .select('name surname memberNumber gender dob isAlive generation relationship phone email district occupation education')
      .lean();

    // Calculate statistics
    const totalMembers = members.length;
    const maleCount = members.filter(m => m.gender === 'male').length;
    const femaleCount = members.filter(m => m.gender === 'female').length;
    const livingCount = members.filter(m => m.isAlive !== false).length;
    const deceasedCount = members.filter(m => m.isAlive === false).length;

    // Generation distribution
    const generationMap = {};
    members.forEach(m => {
      const gen = m.generation || 'Unknown';
      generationMap[gen] = (generationMap[gen] || 0) + 1;
    });

    // Prepare report data
    const reportData = {
      'Family Information': {
        'Family Name': family.familyName || '',
        'Family Number': family.familyNumber || '',
        'Clan': family.clan || '',
        'Origin': family.origin || '',
        'Current Address': family.currentAddress || '',
        'Head of Family': family.headOfFamily?.name || '',
        'Head Member ID': family.headOfFamily?.memberNumber || '',
        'Total Members': totalMembers,
      },
      'Statistics': {
        'Total Members': totalMembers,
        'Male': maleCount,
        'Female': femaleCount,
        'Living': livingCount,
        'Deceased': deceasedCount,
      },
      'Generation Distribution': generationMap,
      'Members': members.map(m => ({
        'Member ID': m.memberNumber || '',
        'Name': m.name || '',
        'Surname': m.surname || '',
        'Gender': m.gender || '',
        'Generation': m.generation || '',
        'Relationship': m.relationship || '',
        'Is Alive': m.isAlive ? 'Yes' : 'No',
        'Phone': m.phone || '',
        'Email': m.email || '',
        'District': m.district || '',
        'Occupation': m.occupation || '',
        'Education': m.education || '',
      })),
    };

    if (format === 'csv') {
      // Flatten for CSV
      const flatData = reportData.Members;
      const parser = new Parser();
      const csv = parser.parse(flatData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${family.familyName}-report.csv`);
      return res.send(csv);
    }

    if (format === 'excel') {
      const wb = XLSX.utils.book_new();
      
      // Family Info sheet
      const infoData = Object.entries(reportData['Family Information']).map(([key, value]) => ({
        Field: key,
        Value: value,
      }));
      const infoWs = XLSX.utils.json_to_sheet(infoData);
      XLSX.utils.book_append_sheet(wb, infoWs, 'Family Info');

      // Statistics sheet
      const statsData = Object.entries(reportData.Statistics).map(([key, value]) => ({
        Metric: key,
        Count: value,
      }));
      const statsWs = XLSX.utils.json_to_sheet(statsData);
      XLSX.utils.book_append_sheet(wb, statsWs, 'Statistics');

      // Generation sheet
      const genData = Object.entries(reportData['Generation Distribution']).map(([gen, count]) => ({
        Generation: gen,
        Count: count,
      }));
      const genWs = XLSX.utils.json_to_sheet(genData);
      XLSX.utils.book_append_sheet(wb, genWs, 'Generations');

      // Members sheet
      const membersWs = XLSX.utils.json_to_sheet(reportData.Members);
      XLSX.utils.book_append_sheet(wb, membersWs, 'Members');

      const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=${family.familyName}-report.xlsx`);
      return res.send(buffer);
    }

    res.json(reportData);
  } catch (error) {
    console.error('generateFamilyReport Error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const generateGenerationReport = async (req, res) => {
  try {
    const { format = 'json', familyId } = req.query;

    let query = {};
    if (familyId) {
      query.family = familyId;
    }

    const generationStats = await Member.aggregate([
      { $match: query },
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
    console.error('generateGenerationReport Error:', error);
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
      .populate('donor', 'name memberNumber phone email')
      .sort({ date: -1 })
      .lean();

    const reportData = donations.map(d => ({
      'Donor Name': d.donor?.name || 'Anonymous',
      'Donor ID': d.donor?.memberNumber || '',
      'Amount': d.amount,
      'Currency': d.currency || 'NPR',
      'Purpose': d.purpose || 'general',
      'Description': d.description || '',
      'Date': formatDate(d.date),
      'Receipt': d.receipt || '',
    }));

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
    console.error('generateDonationReport Error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const generateDemographicReport = async (req, res) => {
  try {
    const { format = 'json', familyId } = req.query;

    let matchQuery = {};
    if (familyId) {
      matchQuery.family = familyId;
    }

    // Gender distribution
    const genderStats = await Member.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$gender', count: { $sum: 1 } } },
    ]);

    // Life status
    const lifeStatus = await Member.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$isAlive', count: { $sum: 1 } } },
    ]);

    // Marital status
    const maritalStats = await Member.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$maritalStatus', count: { $sum: 1 } } },
    ]);

    // Blood group
    const bloodGroupStats = await Member.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
    ]);

    // Occupation
    const occupationStats = await Member.aggregate([
      { $match: matchQuery },
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
    console.error('generateDemographicReport Error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const generateQRReport = async (req, res) => {
  try {
    const members = await Member.find()
      .select('name memberNumber familyNumber rollNumber generation family photo')
      .lean();

    const reportData = members.map(m => ({
      'Name': m.name,
      'Member ID': m.memberNumber || '',
      'Family Number': m.familyNumber || '',
      'Roll Number': m.rollNumber || '',
      'Generation': m.generation || '',
      'QR Code URL': m.photo || '',
    }));

    if (req.query.format === 'csv') {
      const parser = new Parser();
      const csv = parser.parse(reportData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=qr-report.csv');
      return res.send(csv);
    }

    if (req.query.format === 'excel') {
      const ws = XLSX.utils.json_to_sheet(reportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'QR Codes');
      const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=qr-report.xlsx');
      return res.send(buffer);
    }

    res.json(reportData);
  } catch (error) {
    console.error('generateQRReport Error:', error);
    res.status(500).json({ message: error.message });
  }
};