import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors, FontSize } from '../constants/theme';
import { getScoreColor } from '../utils/score';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ScoreRingProps {
  score: number;
  bonus: number;
  size?: number;
  strokeWidth?: number;
}

export function ScoreRing({ score, bonus, size = 200, strokeWidth = 12 }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const progress = useSharedValue(0);
  const bonusProgress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(Math.min(score, 100) / 100, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
    bonusProgress.value = withTiming(Math.min(bonus, 10) / 10, {
      duration: 1400,
      easing: Easing.out(Easing.cubic),
    });
  }, [score, bonus, progress, bonusProgress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const bonusRadius = radius - strokeWidth - 4;
  const bonusCircumference = 2 * Math.PI * bonusRadius;

  const bonusAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: bonusCircumference * (1 - bonusProgress.value),
  }));

  const color = getScoreColor(score);
  const displayScore = Math.min(score + bonus, 110);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={color} />
            <Stop offset="100%" stopColor={color} stopOpacity={0.6} />
          </LinearGradient>
          <LinearGradient id="bonusGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={Colors.warning} />
            <Stop offset="100%" stopColor={Colors.warningLight} />
          </LinearGradient>
        </Defs>
        {/* Background track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={Colors.surfaceLight}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Bonus track */}
        {bonus > 0 && (
          <>
            <Circle
              cx={center}
              cy={center}
              r={bonusRadius}
              stroke={Colors.surfaceLight}
              strokeWidth={strokeWidth - 4}
              fill="none"
            />
            <AnimatedCircle
              cx={center}
              cy={center}
              r={bonusRadius}
              stroke="url(#bonusGrad)"
              strokeWidth={strokeWidth - 4}
              fill="none"
              strokeDasharray={bonusCircumference}
              animatedProps={bonusAnimatedProps}
              strokeLinecap="round"
              transform={`rotate(-90 ${center} ${center})`}
            />
          </>
        )}
        {/* Score arc */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#scoreGrad)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      <View style={styles.labelContainer}>
        <Animated.Text style={[styles.scoreText, { color }]}>
          {displayScore}
        </Animated.Text>
        <Animated.Text style={styles.maxText}>/ 100</Animated.Text>
        {bonus > 0 && (
          <Animated.Text style={styles.bonusText}>+{bonus} bonus</Animated.Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: FontSize.display,
    fontWeight: '700',
  },
  maxText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: -4,
  },
  bonusText: {
    fontSize: FontSize.xs,
    color: Colors.warning,
    marginTop: 2,
  },
});
