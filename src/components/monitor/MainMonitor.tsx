'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Results } from '@mediapipe/pose';
import { usePoseDetection } from '@/hooks/usePoseDetection';
import { usePostureLog } from '@/hooks/usePostureLog';
import { useAuth } from '@/hooks/useAuth';
import { usePostureStore } from '@/store/usePostureStore';
import { calculateNeckAngle, calculateSlouchRatio } from '@/utils/geometry';
import CameraView from './CameraView';
import { Volume2, VolumeX, ShieldCheck, Play } from 'lucide-react';

/** * KONFIGURASI HYPERPARAMETER 
 * [PENTING]: Gunakan mouthMid agar lebih sensitif terhadap kepala yang turun ke bawah.
 */
const SLOUCH_ANGLE_THRESHOLD = 5.0;  // Threshold miring samping
const SLOUCH_RATIO_THRESHOLD = 0.38; // Threshold bungkuk depan (Dagumu turun)
const ALERT_COOLDOWN = 3000;         // Jeda antar alarm (ms)

interface MainMonitorProps {
  onStatusChange: (status: 'GOOD' | 'SLOUCHING') => void;
  onAngleChange: (angle: number) => void;
}

export default function MainMonitor({ onStatusChange, onAngleChange }: MainMonitorProps) {
  // --- State & Refs ---
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastAlertTime = useRef<number>(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // --- Hooks ---
  const { user } = useAuth();
  const { savePostureLog } = usePostureLog();
  const { addHistoryPoint } = usePostureStore();

  /**
   * Inisialisasi Audio & Timeout Safeguard
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        console.warn("⚠️ AI Loading Timeout - Forcing Start");
      }
    }, 5000);

    const audio = new Audio('/alert.mp3');
    audio.preload = 'auto';
    audio.volume = 0.5;
    audio.oncanplaythrough = () => setIsAudioReady(true);
    audioRef.current = audio;

    return () => {
      clearTimeout(timeoutId);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isLoading]);

  /**
   * Unlock Audio Context Browser
   */
  const startMonitoring = () => {
    if (audioRef.current) {
      const originalVolume = audioRef.current.volume;
      audioRef.current.volume = 0;
      audioRef.current.play().then(() => {
        audioRef.current?.pause();
        audioRef.current!.currentTime = 0;
        audioRef.current!.volume = originalVolume;
      }).catch(err => console.warn("Audio unlock failed:", err));
    }
    setHasStarted(true);
    setIsSoundEnabled(true);
  };

  const toggleSound = () => setIsSoundEnabled(!isSoundEnabled);

  /**
   * CORE AI LOGIC: Deteksi Postur Hibrida
   */
  const onResults = useCallback((results: Results) => {
    // Warm-up logic
    if (isLoading) {
      setIsLoading(false);
    }

    if (!hasStarted || !results.poseLandmarks) return;

    // 1. Ekstraksi Landmarks Utama
    const landmarks = results.poseLandmarks;
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftEar = landmarks[7];
    const rightEar = landmarks[8];
    // Landmark Mulut: 9 (kiri), 10 (kanan) - Sangat efektif untuk bungkuk turun
    const leftMouth = landmarks[9];
    const rightMouth = landmarks[10];

    // 2. Cek Visibilitas (Min 60% confidence untuk akurasi)
    const criticalPoints = [leftShoulder, rightShoulder, leftEar, rightEar, leftMouth, rightMouth];
    if (criticalPoints.some(p => (p.visibility ?? 0) < 0.6)) return;

    // 3. Kalkulasi Geometri
    const shoulderMid = {
      x: (leftShoulder.x + rightShoulder.x) / 2,
      y: (leftShoulder.y + rightShoulder.y) / 2,
    };
    const earMid = {
      x: (leftEar.x + rightEar.x) / 2,
      y: (leftEar.y + rightEar.y) / 2,
    };
    const mouthMid = {
      x: (leftMouth.x + rightMouth.x) / 2,
      y: (leftMouth.y + rightMouth.y) / 2,
    };

    // A. Sudut Miring (Lateral Tilt) menggunakan Telinga
    const VIDEO_ASPECT_RATIO = 640 / 480;
    const neckAngle = calculateNeckAngle(earMid, shoulderMid, VIDEO_ASPECT_RATIO);

    // B. Rasio Bungkuk Depan menggunakan MULUT (Lebih sensitif daripada telinga)
    // Mengukur seberapa dekat mulut ke garis bahu dibandingkan lebar bahumu.
    const slouchRatio = calculateSlouchRatio(mouthMid, leftShoulder, rightShoulder);

    // 4. Penentuan Status (Hybrid Condition)
    const isTilting = neckAngle > SLOUCH_ANGLE_THRESHOLD;
    const isSlouchingForward = slouchRatio < SLOUCH_RATIO_THRESHOLD;
    const status = (isTilting || isSlouchingForward) ? 'SLOUCHING' : 'GOOD';

    // [DEBUG LOGS] Muncul setiap ~3 detik untuk monitoring performa
    if (Math.random() < 0.02) {
      console.log(`[Posture Stats] Tilt: ${neckAngle.toFixed(1)}° | Ratio: ${slouchRatio.toFixed(3)} | Status: ${status}`);
    }

    // 5. Update State & Logging
    onAngleChange(neckAngle);
    onStatusChange(status);
    addHistoryPoint(neckAngle);

    // 6. Alarm Logic
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

    if (user) savePostureLog(user.id, status, neckAngle);

  }, [hasStarted, isLoading, isSoundEnabled, isAudioReady, user, onAngleChange, onStatusChange, addHistoryPoint, savePostureLog]);

  const poseFn = usePoseDetection(onResults, canvasRef);

  /**
   * Frame Loop
   */
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
    <div className="relative group overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl border-4 border-white/10">
      
      {/* START OVERLAY */}
      {!hasStarted && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md transition-all duration-500">
          <div className="text-center p-8 animate-in fade-in zoom-in">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/40 animate-pulse">
              <Play className="text-white w-10 h-10 ml-1" />
            </div>
            <h3 className="text-white text-2xl font-black mb-2 tracking-tight">PostureGuard Pro AI</h3>
            <p className="text-indigo-200/60 text-sm mb-8 max-w-xs mx-auto">
              Sensor ditingkatkan: Sekarang mendeteksi bungkuk vertikal menggunakan titik mulut.
            </p>
            <button 
              onClick={startMonitoring}
              className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black tracking-widest text-sm transition-all hover:bg-indigo-500 hover:text-white active:scale-95 shadow-xl"
            >
              START CALIBRATED MONITORING
            </button>
          </div>
        </div>
      )}

      <CameraView webcamRef={webcamRef} canvasRef={canvasRef} />

      {/* SOUND CONTROL */}
      <div className="absolute top-6 right-6 z-40 opacity-0 group-hover:opacity-100 transition-all duration-300 transform">
        <button
          onClick={toggleSound}
          className={`flex items-center space-x-2 px-6 py-3 rounded-2xl shadow-2xl font-black text-sm uppercase tracking-widest transition-all ${
            isSoundEnabled ? 'bg-indigo-600 text-white scale-105' : 'bg-white/90 backdrop-blur-md text-slate-600'
          }`}
        >
          {isSoundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          <span>{isSoundEnabled ? 'Alarm On' : 'Alarm Muted'}</span>
        </button>
      </div>

      <div className="absolute bottom-6 left-6 z-40 flex items-center space-x-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Hybrid AI Sensors Active</span>
      </div>

      {hasStarted && isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 z-40">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="mt-8 text-indigo-100 text-xs font-black tracking-[0.3em] uppercase animate-pulse">
            Syncing Points...
          </p>
        </div>
      )}
    </div>
  );
}