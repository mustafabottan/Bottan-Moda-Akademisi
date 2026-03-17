"use client";

import { useEffect, useCallback } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useDeviceStore } from "@/store/device";
import { useAuthStore } from "@/store/auth";

export function DeviceGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const { fingerprint, sessionId, setFingerprint, setSessionId } = useDeviceStore();

  const registerDevice = useCallback(async (fp: string) => {
    try {
      const res = await fetch("/api/device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fingerprint: fp,
          deviceName: navigator.userAgent.substring(0, 100),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSessionId(data.sessionId);
      }
    } catch {
      // Silently fail
    }
  }, [setSessionId]);

  // Initialize fingerprint
  useEffect(() => {
    if (!user) return;

    const init = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setFingerprint(result.visitorId);
      await registerDevice(result.visitorId);
    };

    init();
  }, [user, setFingerprint, registerDevice]);

  // Heartbeat every 30 seconds
  useEffect(() => {
    if (!user || !fingerprint) return;

    const interval = setInterval(() => {
      registerDevice(fingerprint);
    }, 30000);

    return () => clearInterval(interval);
  }, [user, fingerprint, registerDevice]);

  // Check if session is still active
  useEffect(() => {
    if (!user || !sessionId) return;

    const checkSession = async () => {
      try {
        const res = await fetch(`/api/device?sessionId=${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          if (!data.isActive) {
            alert("Başka bir cihazdan giriş yapıldığı için oturumunuz sonlandırıldı.");
            window.location.href = "/giris";
          }
        }
      } catch {
        // Silently fail
      }
    };

    const interval = setInterval(checkSession, 30000);
    return () => clearInterval(interval);
  }, [user, sessionId]);

  return <>{children}</>;
}
