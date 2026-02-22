import { useState, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import { ToastType } from '../components/Toast';

interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
}

let triggerHaptic: (() => void) | null = null;

// Lazy-load haptics to avoid issues on web
async function hapticFeedback() {
  if (Platform.OS === 'web') return;
  try {
    if (!triggerHaptic) {
      const Haptics = await import('expo-haptics');
      triggerHaptic = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      };
    }
    triggerHaptic();
  } catch {
    // Haptics not available
  }
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'success',
    visible: false,
  });
  const queueRef = useRef<ToastState[]>([]);
  const showingRef = useRef(false);

  const processQueue = useCallback(() => {
    if (queueRef.current.length === 0) {
      showingRef.current = false;
      return;
    }
    showingRef.current = true;
    const next = queueRef.current.shift()!;
    setToast({ ...next, visible: true });
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success') => {
      hapticFeedback();
      const item = { message, type, visible: true };
      if (showingRef.current) {
        queueRef.current.push(item);
      } else {
        showingRef.current = true;
        setToast(item);
      }
    },
    [],
  );

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
    setTimeout(processQueue, 100);
  }, [processQueue]);

  return { toast, showToast, hideToast };
}
