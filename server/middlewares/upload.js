// middlewares/upload.js
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for member photos
const photoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'family-members',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

// Storage for documents
const documentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'documents',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
  },
});

// Storage for family photos
const familyPhotoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'family-photos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
});

// Storage for organization logos
const logoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'organization-logos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 200, height: 200, crop: 'limit' }],
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WEBP, and PDF are allowed.'), false);
  }
};

// Create multer instances with 15MB size limits
export const uploadPhoto = multer({
  storage: photoStorage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter,
});

export const uploadDocument = multer({
  storage: documentStorage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter,
});

export const uploadFamilyPhoto = multer({
  storage: familyPhotoStorage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter,
});

export const uploadLogo = multer({
  storage: logoStorage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter,
});

// Single file uploads
// export const uploadSinglePhoto = uploadPhoto.single('photo');
export const uploadSinglePhoto = uploadPhoto.fields([
  { name: "photo", maxCount: 1 },
  { name: "citizenshipFront", maxCount: 1 },
  { name: "citizenshipBack", maxCount: 1 },
  { name: "nationalIdFront", maxCount: 1 },
  { name: "passportPhoto", maxCount: 1 },
  { name: "drivingLicensePhoto", maxCount: 1 },
]);
export const uploadSingleDocument = uploadDocument.single('file');
export const uploadSingleFamilyPhoto = uploadFamilyPhoto.single('familyPhoto');
export const uploadSingleLogo = uploadLogo.single('logo');

// Multiple file uploads
export const uploadMultiplePhotos = uploadPhoto.array('photos', 5);
export const uploadMultipleDocuments = uploadDocument.array('files', 5);

// Generic upload middleware with error handling
export const handleUpload = (uploadMiddleware) => {
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ 
            message: 'File too large. Maximum size is 15MB.',
            code: 'FILE_TOO_LARGE'
          });
        }
        return res.status(400).json({ 
          message: err.message,
          code: err.code
        });
      } else if (err) {
        return res.status(400).json({ 
          message: err.message,
          code: 'UPLOAD_ERROR'
        });
      }
      next();
    });
  };
};