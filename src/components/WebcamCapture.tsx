
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff } from 'lucide-react';

interface WebcamCaptureProps {
  onFrame: (imageData: ImageData) => void;
  isActive: boolean;
  onToggle: () => void;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onFrame, isActive, onToggle }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrameId: number;

    const startWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
          setError(null);
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
        setHasPermission(false);
        setError('Could not access webcam. Please ensure you have granted camera permissions.');
      }
    };

    const stopWebcam = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      cancelAnimationFrame(animationFrameId);
    };

    const processFrame = () => {
      if (videoRef.current && canvasRef.current && videoRef.current.readyState === 4) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        if (context) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          onFrame(imageData);
        }
      }
      
      animationFrameId = requestAnimationFrame(processFrame);
    };

    if (isActive) {
      startWebcam()
        .then(() => {
          animationFrameId = requestAnimationFrame(processFrame);
        });
    } else {
      stopWebcam();
    }

    return () => {
      stopWebcam();
    };
  }, [isActive, onFrame]);

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-0 relative">
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          {isActive ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white">
              <CameraOff size={64} className="mb-4 opacity-50" />
              <p className="text-lg opacity-70">Camera is turned off</p>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="text-white p-4 text-center">
                <p className="text-red-400 mb-2">⚠️ {error}</p>
                <p className="text-sm opacity-80">Please check your browser settings and reload the page.</p>
              </div>
            </div>
          )}
        </div>
        
        <Button 
          variant={isActive ? "destructive" : "default"}
          size="sm"
          className="absolute bottom-4 right-4"
          onClick={onToggle}
        >
          {isActive ? <CameraOff className="mr-2 h-4 w-4" /> : <Camera className="mr-2 h-4 w-4" />}
          {isActive ? "Stop Camera" : "Start Camera"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WebcamCapture;
