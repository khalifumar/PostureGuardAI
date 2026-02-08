'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import React from 'react';
import Webcam from 'react-webcam';
import { usePoseDetection } from '../../hooks/usePoseDetection';
import { calculateAngle } from '../utils/geometry';
import CameraView from './CameraView';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS, Results } from '@mediapipe/pose';

// Warna untuk indikator
const COLOR_GOOD = '#22c55e'; // Green-500
const COLOR_BAD = '#ef4444'; // Red-500

export default function PostureMonitor() {
    const [status, setStatus] = useState<'GOOD' | 'SLOUCHING'>('GOOD');
    const [angle, setAngle] = useState(0);

    // Refs untuk Webcam dan Canvas
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>();

    // Fungsi menggambar hasil (dijalankan tiap frame)
    const drawResults = useCallback((results: Results) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Bersihkan Canvas
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Tentukan warna berdasarkan status TERAKHIR (state mungkin agak tertinggal, tapi acceptable untuk UI realtime cepat)
        // Untuk lebih akurat, kita bisa hitung ulang status di sini, tapi mengambil dari 'status' state juga oke.
        // Namun karena state update async, lebih baik hitung warna dari landmark langsung jika mau presisi frame-per-frame.
        // Di sini kita pakai default drawing dulu.

        // Kita akan update warna skeleton berdasarkan logic "Realtime" di dalam render loop ini
        // Agar sinkron, kita hitung ulang logika sederhana untuk pewarnaan
        let lineColor = COLOR_GOOD;

        // Ambil landmark untuk logic pewarnaan
        if (results.poseLandmarks) {
            const leftEar = results.poseLandmarks[7];
            const leftShoulder = results.poseLandmarks[11];
            if (leftEar && leftShoulder) {
                const currentAngle = calculateAngle(leftEar, leftShoulder);
                if (Math.abs(currentAngle) > 20) lineColor = COLOR_BAD;
            }
        }

        // Gambar Pose
        if (results.poseLandmarks) {
            drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
                color: lineColor,
                lineWidth: 4,
            });
            drawLandmarks(ctx, results.poseLandmarks, {
                color: lineColor,
                lineWidth: 2,
                radius: 4
            });
        }
        ctx.restore();
    }, []); // depedency array kosong agar reference stabil

    // Callback utama saat ada hasil dari MediaPipe
    // Note: ini dipanggil oleh hook usePoseDetection secara internal jika kita setup loop di sana.
    // TAPI, sesuai request, kita ingin loop requestAnimationFrame di SINI (index.tsx) yang 'mengirim' frame.
    // Jadi callback ini menerima hasil dari pengiriman frame tersebut.
    const onResults = useCallback((results: Results) => {
        if (!results.poseLandmarks) return;

        // 1. Gambar ke Canvas
        drawResults(results);

        // 2. Logika Status & Angle
        // Left Ear: 7, Left Shoulder: 11
        const leftEar = results.poseLandmarks[7];
        const leftShoulder = results.poseLandmarks[11];

        if (leftEar && leftShoulder) {
            const currentAngle = calculateAngle(leftEar, leftShoulder);
            setAngle(currentAngle);

            if (Math.abs(currentAngle) > 20) {
                setStatus('SLOUCHING');
            } else {
                setStatus('GOOD');
            }
        }
    }, [drawResults]);

    // Hook inisialisasi model
    const poseModel = usePoseDetection(onResults);

    // Animasi Loop: Capture Frame -> Send to Model
    const runDetection = useCallback(() => {
        if (
            poseModel &&
            webcamRef.current &&
            webcamRef.current.video &&
            webcamRef.current.video.readyState === 4 &&
            canvasRef.current
        ) {
            const video = webcamRef.current.video;
            const canvas = canvasRef.current;

            // Set ukuran canvas agar sama dengan video asli
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Kirim frame ke model
            poseModel.send({ image: video }).catch(err => {
                console.error("Pose Detection Error:", err);
            });
        }
        requestRef.current = requestAnimationFrame(runDetection);
    }, [poseModel]); // Depedency ke poseModel penting

    // Effect untuk Start/Stop loop
    useEffect(() => {
        requestRef.current = requestAnimationFrame(runDetection);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [runDetection]);

    return (
        <div className="flex flex-col items-center gap-6 p-6">
            <h1 className="text-3xl font-bold mb-4">AI Posture Corrector</h1>

            {/* Container utama view */}
            <div className="relative group">
                <CameraView ref={webcamRef} canvasRef={canvasRef} />

                {/* Detailed Info Overlay */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">

                    {/* Status Panel */}
                    <div className={`p-4 rounded-xl backdrop-blur-md shadow-lg border transition-all duration-300 ${status === 'GOOD'
                        ? 'bg-green-500/80 border-green-400 text-white'
                        : 'bg-red-500/80 border-red-400 text-white animate-pulse'
                        }`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full ${status === 'GOOD' ? 'bg-green-300' : 'bg-red-300'} shadow-inner`} />
                            <div>
                                <h2 className="font-bold text-lg uppercase tracking-wider">{status === 'GOOD' ? 'Good Posture' : 'Slouching Detected'}</h2>
                                <p className="text-xs font-medium opacity-90">
                                    {status === 'GOOD' ? 'Keep it up!' : 'Please straighten your back!'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Angle Metric Panel */}
                    <div className="p-3 rounded-xl bg-black/60 backdrop-blur-md border border-gray-700 text-white shadow-lg">
                        <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Neck Angle</div>
                        <div className="text-2xl font-mono font-bold text-blue-400">
                            {angle.toFixed(1)}°
                        </div>
                    </div>
                </div>

                {/* Bottom Feedback Bar */}
                <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full backdrop-blur-md font-medium text-sm transition-all duration-500 ${status === 'GOOD' ? 'bg-green-900/50 text-green-200 border border-green-700/50' : 'bg-red-900/50 text-red-200 border border-red-700/50'
                    }`}>
                    {status === 'GOOD'
                        ? '✨ Perfect form maintained'
                        : '⚠️ Fixing posture prevents long-term pain'}
                </div>
            </div>

            <p className="text-gray-400 text-sm max-w-md text-center">
                Sit straight and face the camera. The AI will analyze your neck angle in real-time.
            </p>
        </div>
    );
}