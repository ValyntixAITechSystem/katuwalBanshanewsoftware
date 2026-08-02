// src/components/Camera.jsx
import { useRef, useState, useEffect } from 'react';
import Button from './Button';
import { XMarkIcon, CameraIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Camera = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
        };
      }
    } catch (error) {
      console.error('Camera error:', error);
      toast.error('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!isCameraReady || !videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (blob) {
        // Check file size (15MB max)
        if (blob.size > 15 * 1024 * 1024) {
          toast.error('Image size exceeds 15MB limit');
          return;
        }
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        setCapturedImage(file);
        stopCamera();
        onCapture(file);
      }
    }, 'image/jpeg', 0.9);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="relative w-full max-w-2xl bg-black rounded-lg overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Camera view or captured image */}
        {capturedImage ? (
          <div className="relative">
            <img
              src={URL.createObjectURL(capturedImage)}
              alt="Captured"
              className="w-full h-auto"
            />
          </div>
        ) : (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-auto min-h-[400px] bg-gray-900"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-4">
          {capturedImage ? (
            <>
              <Button
                variant="outline"
                onClick={retakePhoto}
                className="bg-white text-black hover:bg-gray-100"
              >
                Retake
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  // The capture is already saved, just close
                  onClose();
                }}
              >
                Use Photo
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              onClick={capturePhoto}
              disabled={!isCameraReady}
              className="bg-white text-black hover:bg-gray-100 p-4 rounded-full"
            >
              <CameraIcon className="h-8 w-8" />
            </Button>
          )}
        </div>

        {/* Loading state */}
        {!isCameraReady && !capturedImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Starting camera...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Camera;