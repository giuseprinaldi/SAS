export const Colors = {
  background: '#0A0A1A',
  surface: '#141428',
  surfaceLight: '#1E1E3A',
  surfaceBorder: '#2A2A4A',
  primary: '#6C63FF',
  primaryLight: '#8B83FF',
  primaryDark: '#4A42CC',
  accent: '#00D4AA',
  accentLight: '#33DDBB',
  warning: '#FFB547',
  warningLight: '#FFCF80',
  danger: '#FF5757',
  text: '#FFFFFF',
  textSecondary: '#9999BB',
  textMuted: '#666688',
  success: '#00D4AA',
  scoreRing: {
    excellent: '#00D4AA',
    good: '#6C63FF',
    average: '#FFB547',
    poor: '#FF5757',
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 28,
  xxxl: 36,
  display: 48,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;
