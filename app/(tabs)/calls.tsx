import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  withSequence,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { useApp } from '../../src/context/AppContext';
import { WeekNavigator } from '../../src/components/WeekNavigator';
import { Toast } from '../../src/components/Toast';
import { DAY_LABELS } from '../../src/types';
import {
  Colors,
  FontSize,
  Spacing,
  BorderRadius,
} from '../../src/constants/theme';

function CheckCell({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.8, { duration: 80 }),
      withTiming(1.15, { duration: 150 }),
      withTiming(1, { duration: 100 }),
    );
    onToggle();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Animated.View
        style={[
          styles.checkbox,
          checked && styles.checkboxChecked,
          animStyle,
        ]}
      >
        {checked && <Text style={styles.checkmark}>{'\u2713'}</Text>}
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function CallsScreen() {
  const {
    accounts,
    data,
    weekStart,
    setWeekStart,
    toggleCall,
    score,
    showToast,
    toast,
    hideToast,
  } = useApp();

  const handleToggle = useCallback(
    async (accountId: string, dayIndex: number) => {
      const newValue = await toggleCall(accountId, dayIndex);
      if (newValue) {
        // Count total calls after toggle
        let totalCalls = 0;
        const updatedCalls = { ...data.calls };
        if (!updatedCalls[accountId]) {
          updatedCalls[accountId] = [false, false, false, false, false];
        }
        updatedCalls[accountId][dayIndex] = true;

        for (const id of Object.keys(updatedCalls)) {
          for (const checked of updatedCalls[id]) {
            if (checked) totalCalls++;
          }
        }

        if (totalCalls === 30) {
          showToast('All 30 sales calls completed!', 'milestone');
        } else if (totalCalls % 10 === 0) {
          showToast(`${totalCalls} calls done this week!`, 'success');
        }
      }
    },
    [toggleCall, data.calls, showToast],
  );

  const noAccounts = accounts.length === 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />
      <Text style={styles.title}>Sales Calls</Text>
      <WeekNavigator weekStart={weekStart} onWeekChange={setWeekStart} />

      <View style={styles.callsSummary}>
        <Text style={styles.callsCount}>{score.salesCalls.current}</Text>
        <Text style={styles.callsTarget}>/ {score.salesCalls.target} calls</Text>
      </View>

      {noAccounts ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>{'\u260E'}</Text>
          <Text style={styles.emptyTitle}>No accounts yet</Text>
          <Text style={styles.emptySubtitle}>
            Add accounts in the Accounts tab to start tracking calls
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Header row */}
          <View style={styles.gridHeader}>
            <View style={styles.accountNameCell}>
              <Text style={styles.headerLabel}>Account</Text>
            </View>
            {DAY_LABELS.map((day) => (
              <View key={day} style={styles.dayCell}>
                <Text style={styles.dayLabel}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Account rows */}
          {accounts.map((account) => {
            const callData = data.calls[account.id] ?? [
              false,
              false,
              false,
              false,
              false,
            ];
            return (
              <View key={account.id} style={styles.gridRow}>
                <View style={styles.accountNameCell}>
                  <Text style={styles.accountName} numberOfLines={1}>
                    {account.name}
                  </Text>
                </View>
                {DAY_LABELS.map((_, dayIndex) => (
                  <View key={dayIndex} style={styles.dayCell}>
                    <CheckCell
                      checked={callData[dayIndex] ?? false}
                      onToggle={() => handleToggle(account.id, dayIndex)}
                    />
                  </View>
                ))}
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  title: {
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
  callsSummary: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: Spacing.md,
  },
  callsCount: {
    color: Colors.primary,
    fontSize: FontSize.xxxl,
    fontWeight: '700',
  },
  callsTarget: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    marginLeft: Spacing.xs,
  },
  scroll: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 40,
  },
  gridHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
    marginBottom: Spacing.xs,
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.surfaceBorder,
  },
  accountNameCell: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  dayCell: {
    width: 48,
    alignItems: 'center',
  },
  headerLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dayLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  accountName: {
    color: Colors.text,
    fontSize: FontSize.md,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.surfaceBorder,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: FontSize.xl,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: 22,
  },
});
