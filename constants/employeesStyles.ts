// constant/employeeStyles

import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  header: {
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  role: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary,
  },
  detailLabel: {
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    color: theme.colors.text,
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: theme.spacing.sm,
  },
  noScheduleText: {
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    marginTop: theme.spacing.sm,
  },
  buttonGroup: {
    marginTop: theme.spacing.md,
  },
  button: {
    padding: theme.spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  editButton: {
    backgroundColor: theme.colors.primary,
  },
  deleteButton: {
    backgroundColor: theme.colors.danger,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
    fontSize: 16,
  },
  headerCloseButton: {
    marginRight: 15,
    padding: 5,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.secondary,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
  },
  floatingCloseButton: {
  position: 'absolute',
  top: 10,
  right: 15,
  zIndex: 10,
  backgroundColor: theme.colors.cardBackground,
  borderRadius: 20,
  padding: 5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},
modalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: theme.spacing.md,
  marginBottom: theme.spacing.md,
  borderBottomWidth: 1,
  borderBottomColor: theme.colors.border
},
errorContainer: {
  backgroundColor: theme.colors.dangerLight,
  padding: theme.spacing.sm,
  borderRadius: theme.radius.sm,
  marginBottom: theme.spacing.md
},
contentScrollView: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
});