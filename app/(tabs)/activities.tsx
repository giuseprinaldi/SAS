import React, { useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../src/context/AppContext';
import { WeekNavigator } from '../../src/components/WeekNavigator';
import { Toast } from '../../src/components/Toast';
import { DailyActivities, DEFAULT_DAILY_ACTIVITIES, DAY_LABELS, DayOfWeek } from '../../src/types';
import { getCurrentDayIndex } from '../../src/utils/dates';
import {
  Colors,
  FontSize,
  Spacing,
  BorderRadius,
} from '../../src/constants/theme';

function CounterRow({
  icon,
  label,
  value,
  weeklyTotal,
  target,
  onIncrement,
  onDecrement,
}: {
  icon: string;
  label: string;
  value: number;
  weeklyTotal: number;
  target: string;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handleIncrement = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    onIncrement();
  };

  return (
    <View style={styles.counterRow}>
      <View style={styles.counterInfo}>
        <Text style={styles.counterIcon}>{icon}</Text>
        <View style={styles.counterText}>
          <Text style={styles.counterLabel}>{label}</Text>
          <Text style={styles.counterTarget}>
            Weekly: {weeklyTotal} ({target})
          </Text>
        </View>
      </View>
      <View style={styles.counterControls}>
        <TouchableOpacity
          onPress={onDecrement}
          style={[styles.counterBtn, value === 0 && styles.counterBtnDisabled]}
          disabled={value === 0}
        >
          <Text
            style={[
              styles.counterBtnText,
              value === 0 && styles.counterBtnTextDisabled,
            ]}
          >
            {'\u2212'}
          </Text>
        </TouchableOpacity>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Text style={styles.counterValue}>{value}</Text>
        </Animated.View>
        <TouchableOpacity onPress={handleIncrement} style={styles.counterBtn}>
          <Text style={styles.counterBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ActivitiesScreen() {
  const {
    data,
    weekStart,
    setWeekStart,
    updateActivities,
    showToast,
    toast,
    hideToast,
  } = useApp();

  const currentDayIndex = getCurrentDayIndex();
  const [selectedDay, setSelectedDay] = React.useState<DayOfWeek>(
    currentDayIndex ?? 0,
  );

  const dayActivities: DailyActivities = useMemo(
    () => data.dailyActivities[selectedDay] ?? { ...DEFAULT_DAILY_ACTIVITIES },
    [data.dailyActivities, selectedDay],
  );

  const weeklyTotals = useMemo(() => {
    const totals = {
      prospectsVisited: 0,
      coldCalls: 0,
      brokerVisits: 0,
      casesConverted: 0,
      cuttings: 0,
    };
    for (let d = 0; d < 5; d++) {
      const act = data.dailyActivities[d] ?? DEFAULT_DAILY_ACTIVITIES;
      totals.prospectsVisited += act.prospectsVisited;
      totals.coldCalls += act.coldCalls;
      totals.brokerVisits += act.brokerVisits;
      totals.casesConverted += act.casesConverted;
      totals.cuttings += act.cuttings;
    }
    return totals;
  }, [data.dailyActivities]);

  const handleUpdate = async (
    field: keyof DailyActivities,
    value: number | boolean,
  ) => {
    const prevValue = dayActivities[field];
    await updateActivities(selectedDay, { [field]: value });

    if (field === 'endOfDayReview' && value === true) {
      showToast(`${DAY_LABELS[selectedDay]} EOD review complete!`, 'success');
    } else if (field === 'cuttings' && typeof value === 'number' && value > (prevValue as number)) {
      showToast('Cutting logged! Bonus points earned!', 'bonus');
    } else if (field === 'brokerVisits' && typeof value === 'number' && value === 1 && (prevValue as number) === 0) {
      showToast('Broker visit logged!', 'success');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />
      <Text style={styles.title}>Daily Activities</Text>
      <WeekNavigator weekStart={weekStart} onWeekChange={setWeekStart} />

      <View style={styles.daySelector}>
        {DAY_LABELS.map((day, index) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayTab,
              selectedDay === index && styles.dayTabActive,
            ]}
            onPress={() => setSelectedDay(index as DayOfWeek)}
          >
            <Text
              style={[
                styles.dayTabText,
                selectedDay === index && styles.dayTabTextActive,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <CounterRow
          icon={'\uD83D\uDC64'}
          label="Prospects Visited"
          value={dayActivities.prospectsVisited}
          weeklyTotal={weeklyTotals.prospectsVisited}
          target="5/week"
          onIncrement={() =>
            handleUpdate('prospectsVisited', dayActivities.prospectsVisited + 1)
          }
          onDecrement={() =>
            handleUpdate(
              'prospectsVisited',
              Math.max(0, dayActivities.prospectsVisited - 1),
            )
          }
        />

        <CounterRow
          icon={'\uD83D\uDCDE'}
          label="Cold Calls"
          value={dayActivities.coldCalls}
          weeklyTotal={weeklyTotals.coldCalls}
          target="2-3/week"
          onIncrement={() =>
            handleUpdate('coldCalls', dayActivities.coldCalls + 1)
          }
          onDecrement={() =>
            handleUpdate('coldCalls', Math.max(0, dayActivities.coldCalls - 1))
          }
        />

        <CounterRow
          icon={'\uD83E\uDD1D'}
          label="Broker Visits / Samples"
          value={dayActivities.brokerVisits}
          weeklyTotal={weeklyTotals.brokerVisits}
          target="1+/week"
          onIncrement={() =>
            handleUpdate('brokerVisits', dayActivities.brokerVisits + 1)
          }
          onDecrement={() =>
            handleUpdate(
              'brokerVisits',
              Math.max(0, dayActivities.brokerVisits - 1),
            )
          }
        />

        <CounterRow
          icon={'\uD83D\uDCC8'}
          label="Cases Converted to Brand"
          value={dayActivities.casesConverted}
          weeklyTotal={weeklyTotals.casesConverted}
          target="5/week"
          onIncrement={() =>
            handleUpdate('casesConverted', dayActivities.casesConverted + 1)
          }
          onDecrement={() =>
            handleUpdate(
              'casesConverted',
              Math.max(0, dayActivities.casesConverted - 1),
            )
          }
        />

        <CounterRow
          icon={'\u2728'}
          label="Cuttings (Bonus)"
          value={dayActivities.cuttings}
          weeklyTotal={weeklyTotals.cuttings}
          target="bonus only"
          onIncrement={() =>
            handleUpdate('cuttings', dayActivities.cuttings + 1)
          }
          onDecrement={() =>
            handleUpdate('cuttings', Math.max(0, dayActivities.cuttings - 1))
          }
        />

        <View style={styles.eodRow}>
          <View style={styles.counterInfo}>
            <Text style={styles.counterIcon}>{'\u2705'}</Text>
            <View style={styles.counterText}>
              <Text style={styles.counterLabel}>End of Day Review</Text>
              <Text style={styles.counterTarget}>
                Reviewed accounts ordering for next day
              </Text>
            </View>
          </View>
          <Switch
            value={dayActivities.endOfDayReview}
            onValueChange={(val) => handleUpdate('endOfDayReview', val)}
            trackColor={{
              false: Colors.surfaceLight,
              true: Colors.primaryDark,
            }}
            thumbColor={
              dayActivities.endOfDayReview ? Colors.primary : Colors.textMuted
            }
          />
        </View>
      </ScrollView>
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
  daySelector: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  dayTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  dayTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayTabText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  dayTabTextActive: {
    color: Colors.text,
  },
  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  counterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  counterIcon: {
    fontSize: 22,
    marginRight: Spacing.md,
  },
  counterText: {
    flex: 1,
  },
  counterLabel: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  counterTarget: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  counterBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  counterBtnDisabled: {
    opacity: 0.4,
  },
  counterBtnText: {
    color: Colors.text,
    fontSize: FontSize.xl,
    fontWeight: '600',
    lineHeight: 22,
  },
  counterBtnTextDisabled: {
    color: Colors.textMuted,
  },
  counterValue: {
    color: Colors.text,
    fontSize: FontSize.xl,
    fontWeight: '700',
    minWidth: 28,
    textAlign: 'center',
  },
  eodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
});
