export const theme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    background: '#f8fafc',
    card: '#ffffff',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radii: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  text: {
    heading1: {
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 40,
    },
    heading2: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
    },
    heading3: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 24,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
    },
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
  },
} as const;