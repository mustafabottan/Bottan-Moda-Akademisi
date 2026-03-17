import { create } from "zustand";

interface DeviceState {
  fingerprint: string | null;
  sessionId: string | null;
  setFingerprint: (fp: string) => void;
  setSessionId: (id: string | null) => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  fingerprint: null,
  sessionId: null,
  setFingerprint: (fingerprint) => set({ fingerprint }),
  setSessionId: (sessionId) => set({ sessionId }),
}));
