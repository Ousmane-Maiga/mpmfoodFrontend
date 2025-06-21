// constants/theme.ts

export const theme = {
    colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        tertiary: '#20c997', // Added a new tertiary color (light teal/cyan)
        background: '#f8fafc',
        cardBackground: '#ffffff',
        surface: '#ffffff',
        text: '#333',
        textSecondary: '#64748b',
        placeholder: '#666',
        border: '#e2e8f0',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        dangerLight: '#fee2e2',
        successLight: '#d1fae5',
        warningLight: '#fef3c7',
        primaryLight: '#dbeafe',
        backdrop: '#cbd5e1',
        white: '#ffffff',
        error: '#ef4444',
        info:'#00BFFF',
        // FIX: Updated borderLight to be a lighter shade of the main border color
        borderLight: '#f0f4f8', // A very light gray, suitable for subtle borders
    },
    spacing: {
        xxs:2,  
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 40,
    },
    // FIX: Added a top-level 'roundness' property for general use in UI components
    roundness: 8, // A common default for moderate rounded corners
    radius: { // Keeping for backward compatibility or specific smaller radii
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        full: 999,
    },
    borderRadius: { // Keeping for direct mapping to StyleSheet.borderRadius
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        full: 999,
    },
    radii: { // Keeping existing radii for backward compatibility if still in use
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        full: 999,
    },
    typography: {
        fontSize: {
            xs: 12,
            sm: 14,
            md: 16,
            lg: 20,
            xl: 24,
        },
        fontWeight: {
            normal: '400',
            semibold: '600',
            bold: '700',
        },
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
        small: {
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
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 6,
        },
    },
} as const;
