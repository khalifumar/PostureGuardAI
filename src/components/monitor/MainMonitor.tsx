'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Results } from '@mediapipe/pose';
import { usePoseDetection } from '@/hooks/usePoseDetection';
import { usePostureStore } from '@/store/usePostureStore';
import { calculateNeckAngle, calculateSlouchRatio } from '@/utils/geometry';
import CameraView from './CameraView';
import { Volume2, VolumeX, ShieldCheck, Play, Loader2 } from 'lucide-react';

const SLOUCH_ANGLE_THRESHOLD = 5.0;  
const SLOUCH_RATIO_THRESHOLD = 0.38; 
const ALERT_COOLDOWN = 3000;         

interface MainMonitorProps {
  onStatusChange: (status: 'GOOD' | 'SLOUCHING') => void;
  onAngleChange: (angle: number) => void;
}

export default function MainMonitor({ onStatusChange, onAngleChange }: MainMonitorProps) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastAlertTime = useRef<number>(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Note: Sistem Auth dan Database telah dihapus untuk efisiensi publik
  const { addHistoryPoint } = usePostureStore();

  useEffect(() => {
    // Timeout safeguard agar loader tidak berputar selamanya
    const timeoutId = setTimeout(() => {
      if (isLoading) setIsLoading(false);
    }, 8000);

    const audio = new Audio('/alert.mp3');
    audio.preload = 'auto';
    audio.oncanplaythrough = () => setIsAudioReady(true);
    audioRef.current = audio;

    return () => {
      clearTimeout(timeoutId);
      if (audioRef.current) audioRef.current.pause();
    };
  }, [isLoading]);

  const startMonitoring = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        audioRef.current?.pause();
        audioRef.current!.currentTime = 0;
      }).catch(err => console.warn("Audio unlock failed:", err));
    }
    setHasStarted(true);
    setIsSoundEnabled(true);
  };

  const onResults = useCallback((results: Results) => {
    if (isLoading) setIsLoading(false);
    if (!hasStarted || !results.poseLandmarks) return;

    const landmarks = results.poseLandmarks;
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftEar = landmarks[7];
    const rightEar = landmarks[8];
    const leftMouth = landmarks[9];
    const rightMouth = landmarks[10];

    const criticalPoints = [leftShoulder, rightShoulder, leftEar, rightEar, leftMouth, rightMouth];
    if (criticalPoints.some(p => (p.visibility ?? 0) < 0.6)) return;

    const shoulderMid = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 };
    const earMid = { x: (leftEar.x + rightEar.x) / 2, y: (leftEar.y + rightEar.y) / 2 };
    const mouthMid = { x: (leftMouth.x + rightMouth.x) / 2, y: (leftMouth.y + rightMouth.y) / 2 };

    const VIDEO_ASPECT_RATIO = 640 / 480;
    const neckAngle = calculateNeckAngle(earMid, shoulderMid, VIDEO_ASPECT_RATIO);
    const slouchRatio = calculateSlouchRatio(mouthMid, leftShoulder, rightShoulder);

    const isTilting = neckAngle > SLOUCH_ANGLE_THRESHOLD;
    const isSlouchingForward = slouchRatio < SLOUCH_RATIO_THRESHOLD;
    const status = (isTilting || isSlouchingForward) ? 'SLOUCHING' : 'GOOD';

    onAngleChange(neckAngle);
    onStatusChange(status);
    addHistoryPoint(neckAngle);

    if (status === 'SLOUCHING' && isSoundEnabled && isAudioReady) {
      const now = Date.now();
      if (now - lastAlertTime.current > ALERT_COOLDOWN) {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(e => console.warn("Audio blocked", e));
        }
        lastAlertTime.current = now;
      }
    }
  }, [hasStarted, isLoading, isSoundEnabled, isAudioReady, onAngleChange, onStatusChange, addHistoryPoint]);

  const poseFn = usePoseDetection(onResults, canvasRef);

  useEffect(() => {
    let animationFrameId: number;
    const runInference = async () => {
      if ((hasStarted || isLoading) && webcamRef.current?.video?.readyState === 4 && poseFn) {
        try {
          await poseFn.send({ image: webcamRef.current.video });
        } catch (error) {
          console.error("AI Error:", error);
        }
      }
      animationFrameId = requestAnimationFrame(runInference);
    };
    runInference();
    return () => cancelAnimationFrame(animationFrameId);
  }, [hasStarted, isLoading, poseFn]);

  return (
    <div className="relative group overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl border-4 border-white/5">
      {!hasStarted && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-xl">
          <div className="text-center p-8">
            <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/40 animate-pulse">
              <Play className="text-white w-10 h-10 ml-1 fill-white" />
            </div>
            <h3 className="text-white text-2xl font-black mb-2 uppercase">Ready to Start?</h3>
            <p className="text-slate-500 text-xs mb-8 max-w-xs mx-auto font-bold uppercase tracking-widest">
              AI akan memantau posturmu secara privat.
            </p>
            <button
              onClick={startMonitoring}
              className="bg-white text-slate-900 px-12 py-4 rounded-2xl font-black tracking-[0.2em] text-xs transition-all hover:bg-indigo-500 hover:text-white active:scale-95 shadow-xl"
            >
              ENABLE CAMERA & SENSORS
            </button>
          </div>
        </div>
      )}

      <CameraView webcamRef={webcamRef} canvasRef={canvasRef} />

      <div className="absolute top-6 right-6 z-40">
        <button
          onClick={() => setIsSoundEnabled(!isSoundEnabled)}
          className={`flex items-center space-x-2 px-5 py-3 rounded-2xl shadow-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
            isSoundEnabled ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
          }`}
        >
          {isSoundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span>{isSoundEnabled ? 'Alert On' : 'Muted'}</span>
        </button>
      </div>

      <div className="absolute bottom-6 left-6 z-40 flex items-center space-x-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full">
        <ShieldCheck className="w-3 h-3 text-emerald-400" />
        <span className="text-[9px] font-black text-white uppercase tracking-widest">Local Processing Active</span>
      </div>

      {hasStarted && isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/95 z-40">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          <p className="mt-6 text-indigo-100 text-[10px] font-black tracking-[0.4em] uppercase">Initialising AI...</p>
        </div>
      )}
    </div>
  );
}