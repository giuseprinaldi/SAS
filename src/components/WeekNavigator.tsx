import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing } from '../constants/theme';
import {
  formatWeekRange,
  getWeekStartDate,
  getPreviousWeekStart,
  getNextWeekStart,
} from '../utils/dates';

interface WeekNavigatorProps {
  weekStart: string;
  onWeekChange: (weekStart: string) => void;
}

export function WeekNavigator({ weekStart, onWeekChange }: WeekNavigatorProps) {
  const currentWeekStart = getWeekStartDate();
  const isCurrentWeek = weekStart === currentWeekStart;
  const isFuture = weekStart > currentWeekStart;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onWeekChange(getPreviousWeekStart(weekStart))}
        style={styles.arrow}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Text style={styles.arrowText}>{'\u276E'}</Text>
      </TouchableOpacity>
      <View style={styles.center}>
        <Text style={styles.weekLabel}>
          {isCurrentWeek ? 'This Week' : formatWeekRange(weekStart)}
        </Text>
        {!isCurrentWeek && (
          <TouchableOpacity onPress={() => onWeekChange(currentWeekStart)}>
            <Text style={styles.todayLink}>Go to this week</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        onPress={() => {
          if (!isFuture) onWeekChange(getNextWeekStart(weekStart));
        }}
        style={[styles.arrow, isFuture && styles.arrowDisabled]}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        disabled={isFuture}
      >
        <Text style={[styles.arrowText, isFuture && styles.arrowTextDisabled]}>
          {'\u276F'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  arrow: {
    padding: Spacing.sm,
  },
  arrowDisabled: {
    opacity: 0.3,
  },
  arrowText: {
    color: Colors.primary,
    fontSize: FontSize.xl,
    fontWeight: '600',
  },
  arrowTextDisabled: {
    color: Colors.textMuted,
  },
  center: {
    alignItems: 'center',
  },
  weekLabel: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  todayLink: {
    color: Colors.primary,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
});
