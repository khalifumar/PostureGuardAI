'use client';
import React, { forwardRef, RefObject } from 'react';
import Webcam from 'react-webcam';

interface CameraViewProps {
    canvasRef: RefObject<HTMLCanvasElement>;
}

// Gunakan forwardRef untuk meneruskan ref webcam ke parent
const CameraView = forwardRef<Webcam, CameraViewProps>(({ canvasRef }, ref) => {
    return (
        <div className="relative w-full max-w-lg aspect-video rounded-lg overflow-hidden shadow-lg border border-gray-700 bg-gray-900">
            {/* Video Webcam */}
            <Webcam
                ref={ref}
                audio={false}
                width={640} // Resolusi default
                height={480}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                    facingMode: 'user',
                    width: 640,
                    height: 480
                }}
                // Style untuk mirror video
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scaleX(-1)',
                }}
            />

            {/* Canvas Overlay */}
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                // Style untuk mirror canvas juga agar sinkron dengan video
                style={{
                    transform: 'scaleX(-1)',
                }}
            />
        </div>
    );
});

CameraView.displayName = 'CameraView';

export default CameraView;
