'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { Pose, Results, POSE_CONNECTIONS } from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

export const usePoseDetection = (
  onResults: (results: Results) => void,
  canvasRef?: React.RefObject<HTMLCanvasElement>
) => {
  const [pose, setPose] = useState<Pose | null>(null);
  const poseRef = useRef<Pose | null>(null); // Keep ref for cleanup

  /**
   * Fungsi untuk menggambar skeleton di atas canvas.
   */
  const drawResults = useCallback((results: Results) => {
    if (!canvasRef || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    // Menggambar garis antar titik tubuh (Pose Connections)
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
      color: '#4f46e5',
      lineWidth: 4,
    });

    // Menggambar titik-titik koordinat (Keypoints)
    drawLandmarks(canvasCtx, results.poseLandmarks, {
      color: '#ffffff',
      lineWidth: 1,
      radius: 2,
    });

    canvasCtx.restore();
  }, [canvasRef]);

  // [STABILITY FIX] Gunakan Ref untuk callback agar tidak memicu re-initialization
  const onResultsRef = useRef(onResults);
  const drawResultsRef = useRef(drawResults);

  // Update ref setiap kali callback berubah
  useEffect(() => {
    onResultsRef.current = onResults;
    drawResultsRef.current = drawResults;
  }, [onResults, drawResults]);

  useEffect(() => {
    let isMounted = true;
    let newPose: Pose | null = null;

    console.log("Initialize Pose Detection");

    const initPose = async () => {
      newPose = new Pose({
        locateFile: (file) => {
          console.log(`MediaPipe requesting: ${file}`);
          return `/mediapipe/pose/${file}`;
        },
      });

      newPose.setOptions({
        modelComplexity: 0,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      newPose.onResults((results) => {
        if (!isMounted) return;
        // Panggil versi terbaru dari ref
        if (onResultsRef.current) onResultsRef.current(results);
        if (drawResultsRef.current) drawResultsRef.current(results);
      });

      if (isMounted) {
        poseRef.current = newPose;
        setPose(newPose); // Trigger re-render parent
      }
    };

    initPose();

    return () => {
      console.log("Cleanup Pose Detection");
      isMounted = false;
      if (poseRef.current) {
        poseRef.current.close();
        poseRef.current = null;
      }
    };
  }, []); // [CRITICAL] Dependency kosong agar HANYA init sekali saat mount!

  return pose;
};