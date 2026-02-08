'use client';

import React from 'react';
import Webcam from 'react-webcam';

interface CameraViewProps {
  webcamRef: React.RefObject<Webcam>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export default function CameraView({ webcamRef, canvasRef }: CameraViewProps) {
  return (
    <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden bg-slate-900 border-4 border-white shadow-2xl">
      {/* 1. Feed Video dari Webcam */}
      <Webcam
        ref={webcamRef}
        audio={false}
        mirrored={true} // Mirrored agar user merasa seperti melihat cermin
        screenshotFormat="image/jpeg"
        className="absolute top-0 left-0 w-full h-full object-cover"
        videoConstraints={{
          facingMode: "user",
          width: 1280,
          height: 720,
        }}
      />

      {/* 2. Canvas untuk Gambar Skeleton AI */}
      <canvas
        ref={canvasRef}
        width={640} // Resolusi internal canvas harus match videoConstraints
        height={480}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
        style={{ transform: 'scaleX(-1)' }} // Ikut di-mirror agar sejajar dengan video
      />

      {/* 3. Loading Overlay (Opsional) */}
      <div className="absolute bottom-6 left-6 z-20 flex items-center space-x-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-white text-xs font-medium tracking-wider">AI SENSOR ACTIVE</span>
      </div>
    </div>
  );
}