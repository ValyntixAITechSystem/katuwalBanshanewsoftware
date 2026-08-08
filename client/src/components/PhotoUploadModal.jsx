// // src/components/PhotoUploadModal.jsx
// import React, { useRef, useState } from 'react';
// import { FaCamera, FaImages, FaTimes, FaTrash, FaUpload, FaRedo } from 'react-icons/fa';
// import { motion, AnimatePresence } from 'framer-motion';
// import ImageUpload from './ImageUpload';

// const PhotoUploadModal = ({
//   isOpen,
//   onClose,
//   onCapture,
//   onFileSelect,
//   preview,
//   label = 'Photo',
//   showReplace = false,
//   showRemove = true,
// }) => {
//   const [mode, setMode] = useState('select');
//   const fileInputRef = useRef(null);

//   const handleCameraClick = () => {
//     setMode('camera');
//     // Trigger camera
//     const input = document.createElement('input');
//     input.type = 'file';
//     input.accept = 'image/*';
//     input.capture = 'environment';
//     input.onchange = (e) => {
//       const file = e.target.files[0];
//       if (file) {
//         onCapture(file);
//         setMode('select');
//       }
//     };
//     input.click();
//   };

//   const handleGalleryClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       onFileSelect(file);
//     }
//   };

//   const handleRemove = () => {
//     onCapture(null);
//   };

//   const handleReplace = () => {
//     handleGalleryClick();
//   };

//   if (!isOpen) return null;

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="fixed inset-0 z-50 overflow-y-auto"
//       >
//         {/* Backdrop */}
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        
//         {/* Bottom Sheet */}
//         <motion.div
//           initial={{ y: '100%' }}
//           animate={{ y: 0 }}
//           exit={{ y: '100%' }}
//           transition={{ type: 'spring', damping: 25, stiffness: 300 }}
//           className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
//         >
//           <div className="p-4">
//             {/* Handle */}
//             <div className="flex justify-center mb-4">
//               <div className="w-12 h-1 bg-gray-300 rounded-full" />
//             </div>

//             {/* Header */}
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 {preview ? 'Update Photo' : `Upload ${label}`}
//               </h3>
//               <button
//                 onClick={onClose}
//                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//               >
//                 <FaTimes className="text-gray-500" />
//               </button>
//             </div>

//             {/* Preview */}
//             {preview && (
//               <div className="mb-6">
//                 <div className="relative rounded-xl overflow-hidden bg-gray-100 max-h-64 flex items-center justify-center">
//                   <img
//                     src={preview}
//                     alt="Preview"
//                     className="max-w-full max-h-64 object-contain"
//                   />
//                 </div>
//                 <div className="flex justify-center gap-3 mt-3">
//                   {showReplace && (
//                     <button
//                       onClick={handleReplace}
//                       className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
//                     >
//                       <FaRedo />
//                       Replace
//                     </button>
//                   )}
//                   {showRemove && (
//                     <button
//                       onClick={handleRemove}
//                       className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
//                     >
//                       <FaTrash />
//                       Remove
//                     </button>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Options */}
//             {!preview && (
//               <div className="space-y-3">
//                 <button
//                   onClick={handleCameraClick}
//                   className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
//                 >
//                   <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
//                     <FaCamera className="text-blue-500" />
//                   </div>
//                   <div className="text-left">
//                     <div className="font-medium text-gray-800">Take Photo</div>
//                     <div className="text-sm text-gray-500">Open camera to capture</div>
//                   </div>
//                 </button>

//                 <button
//                   onClick={handleGalleryClick}
//                   className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
//                 >
//                   <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
//                     <FaImages className="text-green-500" />
//                   </div>
//                   <div className="text-left">
//                     <div className="font-medium text-gray-800">Choose from Gallery</div>
//                     <div className="text-sm text-gray-500">Select from your device</div>
//                   </div>
//                 </button>
//               </div>
//             )}

//             {/* Cancel Button */}
//             <button
//               onClick={onClose}
//               className="w-full mt-4 py-3 text-center text-gray-500 font-medium hover:bg-gray-50 rounded-xl transition-colors"
//             >
//               Cancel
//             </button>

//             {/* Hidden file input */}
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="image/*"
//               className="hidden"
//               onChange={handleFileChange}
//             />
//           </div>
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// export default PhotoUploadModal;


import React, { useRef, useState, useEffect } from 'react';
import { FaCamera, FaImages, FaTimes, FaTrash, FaUpload, FaRedo } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const PhotoUploadModal = ({
  isOpen,
  onClose,
  onCapture,
  onFileSelect,
  preview,
  label = 'Photo',
  showReplace = false,
  showRemove = true,
}) => {
  const [mode, setMode] = useState('select');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Clean up camera stream on unmount or when camera closes
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Handle camera setup when isCameraOpen changes
  useEffect(() => {
    if (isCameraOpen) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isCameraOpen]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      setIsCameraReady(false);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraReady(true);
      }
    } catch (error) {
      console.log('Camera access denied or not available:', error);
      setCameraError(error.message);
      // Fall back to file input
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      }
      // Close camera view after fallback
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraReady(false);
    setCameraError(null);
  };

  const handleCameraClick = () => {
    setIsCameraOpen(true);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && isCameraReady) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' });
          onFileSelect(file);
          closeCamera();
        }
      }, 'image/jpeg', 0.95);
    }
  };

  const closeCamera = () => {
    stopCamera();
    setIsCameraOpen(false);
  };

  const handleGalleryClick = () => {
    if (galleryInputRef.current) {
      galleryInputRef.current.click();
    }
  };

  const handleFileChange = (e, isCamera = false) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      e.target.value = '';
    }
    if (isCamera) {
      closeCamera();
    }
  };

  const handleRemove = () => {
    onCapture(null);
  };

  const handleReplace = () => {
    handleGalleryClick();
  };

  if (!isOpen) return null;

  // Camera view
  if (isCameraOpen) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" onClick={closeCamera} />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-black rounded-t-3xl shadow-2xl max-h-[95vh] overflow-hidden"
          >
            <div className="p-4">
              {/* Handle */}
              <div className="flex justify-center mb-4">
                <div className="w-12 h-1 bg-gray-600 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Take Photo</h3>
                <button
                  onClick={closeCamera}
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                  aria-label="Close camera"
                >
                  <FaTimes className="text-white" />
                </button>
              </div>

              {/* Video Preview */}
              <div className="relative bg-black rounded-xl overflow-hidden" style={{ minHeight: '300px' }}>
                {!isCameraReady && !cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-3"></div>
                      <p>Starting camera...</p>
                    </div>
                  </div>
                )}
                {cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center">
                      <p className="text-red-400 mb-2">Camera error</p>
                      <p className="text-sm text-gray-400">{cameraError}</p>
                      <button
                        onClick={handleCameraClick}
                        className="mt-3 px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                )}
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  autoPlay
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* Capture Button */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={capturePhoto}
                  disabled={!isCameraReady}
                  className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all ${
                    isCameraReady 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-110' 
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                  aria-label="Capture photo"
                >
                  <div className="w-12 h-12 rounded-full border-4 border-white"></div>
                </button>
              </div>

              <button
                onClick={closeCamera}
                className="w-full mt-4 py-3 text-center text-gray-400 font-medium hover:bg-gray-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        
        {/* Bottom Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="p-4">
            {/* Handle */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {preview ? 'Update Photo' : `Upload ${label}`}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <FaTimes className="text-gray-500" />
              </button>
            </div>

            {/* Preview */}
            {preview && (
              <div className="mb-6">
                <div className="relative rounded-xl overflow-hidden bg-gray-100 max-h-64 flex items-center justify-center">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-full max-h-64 object-contain"
                  />
                </div>
                <div className="flex justify-center gap-3 mt-3">
                  {showReplace && (
                    <button
                      onClick={handleReplace}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <FaRedo />
                      Replace
                    </button>
                  )}
                  {showRemove && (
                    <button
                      onClick={handleRemove}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <FaTrash />
                      Remove
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Options */}
            {!preview && (
              <div className="space-y-3">
                {/* Camera Button - Opens real camera */}
                <button
                  onClick={handleCameraClick}
                  className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl transition-all duration-200 border-2 border-green-200 hover:border-green-400"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                    <FaCamera className="text-white text-xl" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-green-800">Take Photo</div>
                    <div className="text-sm text-green-600">Open camera to capture</div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Camera</span>
                </button>

                {/* Gallery Button - Opens file picker */}
                <button
                  onClick={handleGalleryClick}
                  className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl transition-all duration-200 border-2 border-blue-200 hover:border-blue-400"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                    <FaImages className="text-white text-xl" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-blue-800">Choose from Gallery</div>
                    <div className="text-sm text-blue-600">Select from your device</div>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Gallery</span>
                </button>
              </div>
            )}

            {/* Cancel Button */}
            <button
              onClick={onClose}
              className="w-full mt-4 py-3 text-center text-gray-500 font-medium hover:bg-gray-50 rounded-xl transition-colors"
            >
              Cancel
            </button>

            {/* Hidden file input for Gallery */}
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, false)}
            />

            {/* Hidden file input for Camera - fallback for devices without getUserMedia */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleFileChange(e, true)}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PhotoUploadModal;