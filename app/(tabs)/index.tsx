import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../src/context/AppContext';
import { ScoreRing } from '../../src/components/ScoreRing';
import { MetricCard } from '../../src/components/MetricCard';
import { WeekNavigator } from '../../src/components/WeekNavigator';
import { Toast } from '../../src/components/Toast';
import { getScoreLabel, getScoreColor } from '../../src/utils/score';
import { Colors, FontSize, Spacing } from '../../src/constants/theme';

export default function ScoreScreen() {
  const { score, weekStart, setWeekStart, loading, toast, hideToast } = useApp();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const label = getScoreLabel(score.total);
  const color = getScoreColor(score.total);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Sales Activity Score</Text>
        <WeekNavigator weekStart={weekStart} onWeekChange={setWeekStart} />

        <View style={styles.ringSection}>
          <ScoreRing score={score.total} bonus={score.bonus} size={220} />
          <Text style={[styles.scoreLabel, { color }]}>{label}</Text>
        </View>

        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>Score Breakdown</Text>

          <MetricCard
            icon={'\u260E'}
            label="Sales Calls"
            current={score.salesCalls.current}
            target={score.salesCalls.target}
            score={score.salesCalls.score}
            maxScore={score.salesCalls.max}
          />
          <MetricCard
            icon={'\uD83D\uDC64'}
            label="Prospects Visited"
            current={score.prospects.current}
            target={score.prospects.target}
            score={score.prospects.score}
            maxScore={score.prospects.max}
          />
          <MetricCard
            icon={'\uD83D\uDCDE'}
            label="Cold Calls"
            current={score.coldCalls.current}
            target={score.coldCalls.target}
            score={score.coldCalls.score}
            maxScore={score.coldCalls.max}
          />
          <MetricCard
            icon={'\uD83E\uDD1D'}
            label="Broker Visits / Samples"
            current={score.brokerVisits.current}
            target={score.brokerVisits.target}
            score={score.brokerVisits.score}
            maxScore={score.brokerVisits.max}
          />
          <MetricCard
            icon={'\uD83D\uDCC8'}
            label="Cases Converted to Brand"
            current={score.casesConverted.current}
            target={score.casesConverted.target}
            score={score.casesConverted.score}
            maxScore={score.casesConverted.max}
          />
          <MetricCard
            icon={'\u2705'}
            label="End of Day Reviews"
            current={score.endOfDayReviews.current}
            target={score.endOfDayReviews.target}
            score={score.endOfDayReviews.score}
            maxScore={score.endOfDayReviews.max}
          />
          <MetricCard
            icon={'\u2728'}
            label="Cuttings (Bonus)"
            current={score.cuttings.current}
            target={0}
            score={score.cuttings.score}
            maxScore={score.cuttings.max}
            isBonus
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
  },
  scroll: {
    paddingBottom: 40,
  },
  title: {
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
  ringSection: {
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  scoreLabel: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    marginTop: Spacing.md,
  },
  metricsSection: {
    paddingHorizontal: Spacing.xl,
  },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
});
