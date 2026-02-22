import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize } from '../../src/constants/theme';

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.iconText, focused && styles.iconTextActive]}>
        {label}
      </Text>
    </View>
  );
}

const TAB_ICONS: Record<string, string> = {
  index: '\u25C9',       // Score circle
  calls: '\u260E',       // Phone
  activities: '\u2261',  // List
  accounts: '\u2699',    // Gear
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Score',
          tabBarIcon: ({ focused }) => (
            <TabIcon label={TAB_ICONS.index} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="calls"
        options={{
          title: 'Calls',
          tabBarIcon: ({ focused }) => (
            <TabIcon label={TAB_ICONS.calls} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: 'Activities',
          tabBarIcon: ({ focused }) => (
            <TabIcon label={TAB_ICONS.activities} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: 'Accounts',
          tabBarIcon: ({ focused }) => (
            <TabIcon label={TAB_ICONS.accounts} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.surfaceBorder,
    borderTopWidth: 1,
    height: 85,
    paddingBottom: 25,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 22,
    color: Colors.textMuted,
  },
  iconTextActive: {
    color: Colors.primary,
  },
});
