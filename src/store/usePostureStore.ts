import { create } from 'zustand';

interface PostureState {
  currentStatus: 'GOOD' | 'SLOUCHING';
  currentAngle: number;
  isMonitoring: boolean;
  history: number[];
  setStatus: (status: 'GOOD' | 'SLOUCHING') => void;
  setAngle: (angle: number) => void;
  setMonitoring: (val: boolean) => void;
  addHistoryPoint: (angle: number) => void;
}

export const usePostureStore = create<PostureState>((set) => ({
  currentStatus: 'GOOD',
  currentAngle: 0,
  isMonitoring: false,
  history: [],

  // Memberikan tipe data eksplisit pada parameter fungsi
  setStatus: (status: 'GOOD' | 'SLOUCHING') => set({ currentStatus: status }),
  
  setAngle: (angle: number) => set({ currentAngle: angle }),
  
  setMonitoring: (val: boolean) => set({ isMonitoring: val }),

  addHistoryPoint: (angle: number) => set((state: PostureState) => {
    const newHistory = [...state.history, angle].slice(-20);
    return { history: newHistory };
  }),
}));