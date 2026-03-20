import React, { Component, ReactNode } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>App Error</Text>
          <ScrollView style={styles.scroll}>
            <Text style={styles.message}>
              {this.state.error?.message ?? 'Unknown error'}
            </Text>
            <Text style={styles.stack}>
              {this.state.error?.stack ?? ''}
            </Text>
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0000',
    padding: 40,
    justifyContent: 'center',
  },
  title: {
    color: '#ff4444',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  scroll: {
    maxHeight: 400,
  },
  message: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 12,
  },
  stack: {
    color: '#999999',
    fontSize: 12,
  },
});
