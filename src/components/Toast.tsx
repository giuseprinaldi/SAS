import React, { useEffect, useCallback } from 'react';
import { Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type ToastType = 'success' | 'bonus' | 'milestone';

interface ToastProps {
  message: string;
  type: ToastType;
  visible: boolean;
  onHide: () => void;
}

const TOAST_COLORS: Record<ToastType, { bg: string; border: string }> = {
  success: { bg: '#0D3D2E', border: Colors.success },
  bonus: { bg: '#3D2E0D', border: Colors.warning },
  milestone: { bg: '#1E0D3D', border: Colors.primary },
};

export function Toast({ message, type, visible, onHide }: ToastProps) {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  const hideCallback = useCallback(() => {
    onHide();
  }, [onHide]);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.back(1.5)),
      });
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSequence(
        withTiming(1.05, { duration: 300, easing: Easing.out(Easing.cubic) }),
        withTiming(1, { duration: 200 }),
      );

      // Auto-hide after 2.5 seconds
      translateY.value = withDelay(
        2500,
        withTiming(-100, { duration: 300, easing: Easing.in(Easing.cubic) }),
      );
      opacity.value = withDelay(
        2500,
        withTiming(0, { duration: 300 }, () => {
          runOnJS(hideCallback)();
        }),
      );
    }
  }, [visible, translateY, opacity, scale, hideCallback]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const colors = TOAST_COLORS[type];

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.bg, borderColor: colors.border },
        animatedStyle,
      ]}
    >
      <Text style={styles.icon}>
        {type === 'success' ? '\u2713' : type === 'bonus' ? '\u2605' : '\u26A1'}
      </Text>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: Spacing.xl,
    right: Spacing.xl,
    maxWidth: SCREEN_WIDTH - Spacing.xl * 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  icon: {
    fontSize: 18,
    marginRight: Spacing.sm,
    color: Colors.text,
  },
  message: {
    flex: 1,
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
});
