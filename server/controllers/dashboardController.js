// // src/controllers/dashboardController.js
// import Member from '../models/Member.js';
// import Family from '../models/Family.js';
// import Donation from '../models/Donation.js';
// import Document from '../models/Document.js';
// import Notification from '../models/Notification.js';

// export const getDashboardStats = async (req, res) => {
//   try {
//     const [
//       totalMembers,
//       totalFamilies,
//       totalDonations,
//       totalDocuments,
//       genderStats,
//       lifeStatusStats,
//       recentMembers,
//       recentDonations,
//       recentNotifications,
//     ] = await Promise.all([
//       Member.countDocuments(),
//       Family.countDocuments(),
//       Donation.countDocuments(),
//       Document.countDocuments(),
//       Member.aggregate([
//         { $group: { _id: '$gender', count: { $sum: 1 } } },
//       ]),
//       Member.aggregate([
//         { $group: { _id: '$isAlive', count: { $sum: 1 } } },
//       ]),
//       Member.find()
//         .select('name photo gender isAlive createdAt')
//         .sort({ createdAt: -1 })
//         .limit(5),
//       Donation.find()
//         .populate('donor', 'name photo')
//         .sort({ date: -1 })
//         .limit(5),
//       Notification.find()
//         .sort({ createdAt: -1 })
//         .limit(5),
//     ]);

//     // Calculate generations
//     const generations = await Member.aggregate([
//       { $group: { _id: '$generation', count: { $sum: 1 } } },
//       { $sort: { _id: 1 } },
//     ]);

//     // Total donation amount
//     const donationTotal = await Donation.aggregate([
//       { $group: { _id: null, total: { $sum: '$amount' } } },
//     ]);

//     // Monthly donation stats
//     const monthlyDonations = await Donation.aggregate([
//       {
//         $group: {
//           _id: {
//             year: { $year: '$date' },
//             month: { $month: '$date' },
//           },
//           total: { $sum: '$amount' },
//           count: { $sum: 1 },
//         },
//       },
//       { $sort: { '_id.year': -1, '_id.month': -1 } },
//       { $limit: 12 },
//     ]);

//     res.json({
//       summary: {
//         totalMembers,
//         totalFamilies,
//         totalDonations,
//         totalDocuments,
//         totalDonationAmount: donationTotal[0]?.total || 0,
//       },
//       demographics: {
//         gender: genderStats,
//         lifeStatus: lifeStatusStats,
//         generations: generations.map(g => ({
//           generation: g._id,
//           count: g.count,
//         })),
//       },
//       recent: {
//         members: recentMembers,
//         donations: recentDonations,
//         notifications: recentNotifications,
//       },
//       monthlyDonations: monthlyDonations.map(m => ({
//         month: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`,
//         total: m.total,
//         count: m.count,
//       })),
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getQuickStats = async (req, res) => {
//   try {
//     const [
//       totalMembers,
//       totalFamilies,
//       totalGenerations,
//       maleCount,
//       femaleCount,
//       livingCount,
//       deceasedCount,
//     ] = await Promise.all([
//       Member.countDocuments(),
//       Family.countDocuments(),
//       Member.distinct('generation').then(gens => gens.filter(g => g !== undefined).length),
//       Member.countDocuments({ gender: 'male' }),
//       Member.countDocuments({ gender: 'female' }),
//       Member.countDocuments({ isAlive: true }),
//       Member.countDocuments({ isAlive: false }),
//     ]);

//     res.json({
//       totalMembers,
//       totalFamilies,
//       totalGenerations,
//       maleCount,
//       femaleCount,
//       livingCount,
//       deceasedCount,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

import Member from '../models/Member.js';
import Family from '../models/Family.js';
import Donation from '../models/Donation.js';
import Document from '../models/Document.js';
import Notification from '../models/Notification.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalMembers,
      totalFamilies,
      totalDonations,
      totalDocuments,
      genderStats,
      lifeStatusStats,
      recentMembers,
      recentDonations,
      recentNotifications,
    ] = await Promise.all([
      Member.countDocuments(),
      Family.countDocuments(),
      Donation.countDocuments(),
      Document.countDocuments(),
      Member.aggregate([
        { $group: { _id: '$gender', count: { $sum: 1 } } },
      ]),
      Member.aggregate([
        { $group: { _id: '$isAlive', count: { $sum: 1 } } },
      ]),
      Member.find()
        .select('name photo gender isAlive createdAt')
        .sort({ createdAt: -1 })
        .limit(5),
      // ✅ FIXED: Use donorName instead of populating 'donor'
      Donation.find()
        .select('donorName amount paymentMethod donationDate createdAt')
        .sort({ donationDate: -1 })
        .limit(5),
      Notification.find()
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    // Calculate generations
    const generations = await Member.aggregate([
      { $group: { _id: '$generation', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Total donation amount
    const donationTotal = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Monthly donation stats - ✅ FIXED: Use donationDate instead of date
    const monthlyDonations = await Donation.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$donationDate' },
            month: { $month: '$donationDate' },
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);

    res.json({
      summary: {
        totalMembers,
        totalFamilies,
        totalDonations,
        totalDocuments,
        totalDonationAmount: donationTotal[0]?.total || 0,
      },
      demographics: {
        gender: genderStats,
        lifeStatus: lifeStatusStats,
        generations: generations.map(g => ({
          generation: g._id,
          count: g.count,
        })),
      },
      recent: {
        members: recentMembers,
        donations: recentDonations.map(d => ({
          _id: d._id,
          name: d.donorName || 'Anonymous',
          amount: d.amount,
          date: d.donationDate || d.createdAt,
          createdAt: d.createdAt,
        })),
        notifications: recentNotifications,
      },
      monthlyDonations: monthlyDonations.map(m => ({
        month: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`,
        total: m.total,
        count: m.count,
      })),
    });
  } catch (error) {
    console.error("❌ Dashboard Stats Error:", error);
    console.error("Stack:", error.stack);
    res.status(500).json({ 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getQuickStats = async (req, res) => {
  try {
    const [
      totalMembers,
      totalFamilies,
      totalGenerations,
      maleCount,
      femaleCount,
      livingCount,
      deceasedCount,
    ] = await Promise.all([
      Member.countDocuments(),
      Family.countDocuments(),
      Member.distinct('generation').then(gens => gens.filter(g => g !== undefined).length),
      Member.countDocuments({ gender: 'male' }),
      Member.countDocuments({ gender: 'female' }),
      Member.countDocuments({ isAlive: true }),
      Member.countDocuments({ isAlive: false }),
    ]);

    res.json({
      totalMembers,
      totalFamilies,
      totalGenerations,
      maleCount,
      femaleCount,
      livingCount,
      deceasedCount,
    });
  } catch (error) {
    console.error("❌ Quick Stats Error:", error);
    res.status(500).json({ message: error.message });
  }
};