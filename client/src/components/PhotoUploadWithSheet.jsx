// // src/components/PhotoUploadWithSheet.jsx    , FaReplace
// import React, { useState } from 'react';
// import { FaCamera, FaUpload, FaTrash } from 'react-icons/fa';
// import PhotoUploadModal from './PhotoUploadModal';

// const PhotoUploadWithSheet = ({
//   label,
//   type,
//   preview,
//   onUpload,
//   onRemove,
//   className = '',
//   required = false,
//   size = 'md',
// }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const sizes = {
//     sm: 'w-16 h-16',
//     md: 'w-24 h-24',
//     lg: 'w-32 h-32',
//     xl: 'w-40 h-40',
//   };

//   const handleFileSelect = (file) => {
//     onUpload(file);
//     setIsModalOpen(false);
//   };

//   const handleCameraCapture = (file) => {
//     onUpload(file);
//     setIsModalOpen(false);
//   };

//   const handleRemove = () => {
//     onRemove();
//     setIsModalOpen(false);
//   };

//   return (
//     <div className={`${className}`}>
//       {/* Preview / Upload Button */}
//       <div className="flex flex-col items-center">
//         {preview ? (
//           <div className="relative group">
//             <div className={`
//               ${sizes[size]} rounded-xl overflow-hidden border-2 border-gray-200
//               shadow-sm hover:shadow-md transition-shadow
//             `}>
//               <img
//                 src={preview}
//                 alt={label}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-2 shadow-lg hover:bg-blue-600 transition-colors"
//             >
//               <FaCamera className="h-3 w-3" />
//             </button>
//             <button
//               onClick={handleRemove}
//               className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
//             >
//               <FaTrash className="h-3 w-3" />
//             </button>
//           </div>
//         ) : (
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className={`
//               ${sizes[size]} rounded-xl border-2 border-dashed border-gray-300
//               flex flex-col items-center justify-center gap-1
//               bg-gray-50 hover:bg-gray-100 hover:border-primary
//               transition-all duration-200 cursor-pointer
//               group
//             `}
//           >
//             <FaCamera className="text-gray-400 group-hover:text-primary h-6 w-6" />
//             <span className="text-xs text-gray-500 group-hover:text-primary text-center px-1">
//               {label}
//             </span>
//           </button>
//         )}
//         <span className="text-xs text-gray-500 mt-1 text-center">
//           {preview ? 'Tap to change' : `Upload ${label}`}
//         </span>
//       </div>

//       {/* Modal */}
//       <PhotoUploadModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onCapture={handleCameraCapture}
//         onFileSelect={handleFileSelect}
//         preview={preview}
//         label={label}
//         showReplace={!!preview}
//         showRemove={!!preview}
//       />
//     </div>
//   );
// };

// export default PhotoUploadWithSheet;

// src/components/PhotoUploadWithSheet.jsx
import React, { useState } from 'react';
import { FaCamera, FaUpload, FaTrash, FaImage } from 'react-icons/fa';
import PhotoUploadModal from './PhotoUploadModal';

const PhotoUploadWithSheet = ({
  label,
  type,
  preview,
  onUpload,
  onRemove,
  className = '',
  required = false,
  size = 'md',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sizes = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36',
    xl: 'w-44 h-44',
  };

  const handleFileSelect = (file) => {
    onUpload(file);
    setIsModalOpen(false);
  };

  const handleCameraCapture = (file) => {
    onUpload(file);
    setIsModalOpen(false);
  };

  const handleRemove = () => {
    onRemove();
    setIsModalOpen(false);
  };

  return (
    <div className={`${className}`}>
      {/* Preview / Upload Button */}
      <div className="flex flex-col items-center">
        {preview ? (
          <div className="relative group">
            <div className={`
              ${sizes[size]} rounded-xl overflow-hidden border-2 border-green-200
              shadow-md hover:shadow-lg transition-all duration-300
            `}>
              <img
                src={preview}
                alt={label}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full p-2.5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <FaCamera className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <FaTrash className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsModalOpen(true)}
            className={`
              ${sizes[size]} rounded-xl border-2 border-dashed border-green-300
              flex flex-col items-center justify-center gap-1.5
              bg-gradient-to-br from-green-50 to-emerald-50 
              hover:from-green-100 hover:to-emerald-100 hover:border-green-500
              transition-all duration-300 cursor-pointer group
              shadow-sm hover:shadow-md
            `}
          >
            <div className="w-10 h-10 rounded-full bg-green-100 group-hover:bg-green-200 flex items-center justify-center transition-colors">
              <FaCamera className="text-green-600 group-hover:text-green-700 h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-green-700 group-hover:text-green-800 text-center px-1">
              {label}
            </span>
            <span className="text-[10px] text-green-500 group-hover:text-green-600">Upload</span>
          </button>
        )}
        {!preview && (
          <span className="text-xs text-gray-400 mt-1.5 text-center">
            Tap to upload {label}
          </span>
        )}
      </div>

      {/* Modal */}
      <PhotoUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCapture={handleCameraCapture}
        onFileSelect={handleFileSelect}
        preview={preview}
        label={label}
        showReplace={!!preview}
        showRemove={!!preview}
      />
    </div>
  );
};

export default PhotoUploadWithSheet;