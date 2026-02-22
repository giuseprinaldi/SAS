import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';

interface MetricCardProps {
  label: string;
  current: number;
  target: number;
  score: number;
  maxScore: number;
  icon: string;
  isBonus?: boolean;
}

export function MetricCard({
  label,
  current,
  target,
  score,
  maxScore,
  icon,
  isBonus,
}: MetricCardProps) {
  const progress = maxScore > 0 ? Math.min(score / maxScore, 1) : 0;
  const isComplete = current >= target;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.headerText}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.count}>
            {current}
            {!isBonus && (
              <Text style={styles.target}> / {target}</Text>
            )}
          </Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text
            style={[
              styles.scoreValue,
              isComplete && !isBonus && styles.scoreComplete,
              isBonus && score > 0 && styles.scoreBonus,
            ]}
          >
            {score}
          </Text>
          <Text style={styles.scoreMax}>/ {maxScore}</Text>
        </View>
      </View>
      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            {
              width: `${progress * 100}%`,
              backgroundColor: isBonus
                ? Colors.warning
                : isComplete
                  ? Colors.success
                  : Colors.primary,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  icon: {
    fontSize: 22,
    marginRight: Spacing.md,
  },
  headerText: {
    flex: 1,
  },
  label: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  count: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  target: {
    color: Colors.textMuted,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  scoreComplete: {
    color: Colors.success,
  },
  scoreBonus: {
    color: Colors.warning,
  },
  scoreMax: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
  barTrack: {
    height: 4,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
});
