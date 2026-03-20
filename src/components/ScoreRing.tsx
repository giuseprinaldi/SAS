import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize } from '../constants/theme';
import { getScoreColor } from '../utils/score';

interface ScoreRingProps {
  score: number;
  bonus: number;
  size?: number;
  strokeWidth?: number;
}

export function ScoreRing({ score, bonus, size = 200, strokeWidth = 12 }: ScoreRingProps) {
  const color = getScoreColor(score);
  const displayScore = Math.min(score + bonus, 110);
  const progress = Math.min(score, 100) / 100;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background ring */}
      <View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: Colors.surfaceLight,
          },
        ]}
      />
      {/* Progress arc - using a simple fill approach */}
      <View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: 'transparent',
            borderTopColor: color,
            borderRightColor: progress > 0.25 ? color : 'transparent',
            borderBottomColor: progress > 0.5 ? color : 'transparent',
            borderLeftColor: progress > 0.75 ? color : 'transparent',
            transform: [{ rotate: '-45deg' }],
            opacity: progress > 0 ? 1 : 0,
          },
        ]}
      />
      {/* Score text */}
      <View style={styles.labelContainer}>
        <Text style={[styles.scoreText, { color }]}>
          {displayScore}
        </Text>
        <Text style={styles.maxText}>/ 100</Text>
        {bonus > 0 && (
          <Text style={styles.bonusText}>+{bonus} bonus</Text>
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
  ring: {
    position: 'absolute',
  },
  labelContainer: {
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
