export const theme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    background: '#f8fafc',
    card: '#ffffff',
    surface: '#ffffff',
    text: '#1e293b',
    textSecondary: '#64748b',
    placeholder: '#94a3b8', // A lighter grey for placeholders
    border: '#e2e8f0',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    dangerLight: '#fee2e2', // Added dangerLight (red-100 from Tailwind)
    successLight: '#d1fae5', // Bonus: added for consistency
    warningLight: '#fef3c7', // Bonus: added for consistency
    primaryLight: '#dbeafe', // Bonus: added for consistency
    backdrop: '#cbd5e1', // A light grey, similar to Tailwind's slate-300 or gray-300, suitable for borders/dividers
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40, // Bonus: added extra large spacing
  },
  radius: { // Added radius (singular) as an alias to radii for flexibility
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 999, // Bonus: full rounding for circular elements
  },
  radii: { // Keeping existing radii for backward compatibility
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 999, // Bonus: full rounding for circular elements
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
    small: { // Bonus: added smaller text variant
      fontSize: 14,
      lineHeight: 20,
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
    lg: { // Bonus: added larger shadow variant
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
  },
} as const;