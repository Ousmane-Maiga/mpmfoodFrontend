import { StyleSheet } from 'react-native';
import { theme } from '@/constants/theme'

// Primary blue color palette
const BLUE_PALETTE = {
  primary: '#1565C0',
  dark: '#0D47A1',
  light: '#1E88E5',
  extraLight: '#BBDEFB',
  background: '#E3F2FD'
};

export const styles = StyleSheet.create({
  /* ======================
      Layout & Containers
  ====================== */
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    backgroundColor: 'white',
    height: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    padding: 16,
    backgroundColor: BLUE_PALETTE.background,
    borderRadius: 8,
    elevation: 1,
  },
  statItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 8,
  },
  teamSection: {
    marginVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 1,
  },

  /* ======================
      Modal Styles
  ====================== */
  modalContainer: {
    flex: 5,
    margin: 0,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    // --- MODIFIED FOR FULL SCREEN ---
    backgroundColor: 'white',
    margin: 0, // Changed from 20 to 0
    borderRadius: 0, // Changed from 10 to 0
    padding: 16,
    maxHeight: '100%', // Changed from '85%' to '100%'
    flex: 1, // Added to ensure it takes full height
    // --- END MODIFICATION ---
  },
  productModal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BLUE_PALETTE.extraLight,
  },
  productModalContent: {
    padding: 16,
  },
  productModalScrollContainer: {
    maxHeight: '75%',
  },
  productModalHeaderContainer: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: BLUE_PALETTE.extraLight,
  },
  productModalCloseButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
  },
  dropdownModal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: BLUE_PALETTE.extraLight,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: BLUE_PALETTE.extraLight,
  },

  /* ======================
      Header & Navigation
  ====================== */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  productModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    color: BLUE_PALETTE.primary,
  },
  productModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BLUE_PALETTE.dark,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: BLUE_PALETTE.dark,
  },

  /* ======================
      User & Team Styles
  ====================== */
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: BLUE_PALETTE.extraLight,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userText: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: BLUE_PALETTE.dark,
  },
  userRole: {
    fontSize: 14,
    color: BLUE_PALETTE.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 12,
  },
  teamMember: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  memberName: {
    fontWeight: '500',
    fontSize: 15,
    color: BLUE_PALETTE.dark,
  },
  memberRole: {
    fontSize: 12,
    color: BLUE_PALETTE.primary,
    marginLeft: 18,
  },
  memberStats: {
    alignItems: 'flex-end',
  },

  /* ======================
      Status Indicators
  ====================== */
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  statusDotActive: {
    backgroundColor: '#4CAF50',
  },
  statusDotInactive: {
    backgroundColor: '#F44336',
  },
  statusDotPending: {
    backgroundColor: '#FFC107',
  },
  memberDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },

  /* ======================
      Product & Order Styles
  ====================== */
  productCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BLUE_PALETTE.extraLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productCardImage: {
    width: '100%',
    height: 120,
    borderRadius: 4,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  productCardDetails: {
    paddingHorizontal: 4,
  },
  productCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: BLUE_PALETTE.dark,
    marginBottom: 4,
  },
  productCardPrice: {
    fontSize: 15,
    fontWeight: '500',
    color: BLUE_PALETTE.primary,
  },
  productCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  productCardCategory: {
    fontSize: 12,
    color: BLUE_PALETTE.primary,
    backgroundColor: BLUE_PALETTE.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  orderCard: {
    borderWidth: 1,
    borderColor: BLUE_PALETTE.extraLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10
  },
  orderId: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: BLUE_PALETTE.dark,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: BLUE_PALETTE.extraLight,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },
  productCategory: {
    fontSize: 12,
    color: BLUE_PALETTE.primary,
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: BLUE_PALETTE.dark,
    marginTop: 4,
  },
  productStock: {
    fontSize: 12,
    color: BLUE_PALETTE.primary,
    marginTop: 4,
  },
  inStock: {
    color: BLUE_PALETTE.primary,
  },
  outOfStock: {
    color: '#D32F2F',
  },
  productModalNutritionInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  productModalNutritionItem: {
    backgroundColor: BLUE_PALETTE.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  productModalNutritionLabel: {
    fontSize: 12,
    color: BLUE_PALETTE.dark,
    fontWeight: '500',
  },
  productModalNutritionValue: {
    fontSize: 12,
    color: BLUE_PALETTE.primary,
  },

  /* ======================
      Variant Styles
  ====================== */
  variantSection: {
    marginBottom: 16,
  },
  variantContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  variantRequiredLabel: {
    fontSize: 12,
    color: '#D32F2F',
    marginBottom: 4,
  },

  /* ======================
      Item Actions
  ====================== */
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: BLUE_PALETTE.dark,
    flex: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: BLUE_PALETTE.primary,
    textAlign: 'right',
    flex: 1,
  },
  itemActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  itemActionQuantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BLUE_PALETTE.extraLight,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  itemActionQuantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: BLUE_PALETTE.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemActionQuantityValue: {
    minWidth: 30,
    textAlign: 'center',
    fontWeight: '500',
    color: BLUE_PALETTE.dark,
  },
  itemActionEditButton: {
    backgroundColor: BLUE_PALETTE.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemActionEditText: {
    color: BLUE_PALETTE.primary,
    fontSize: 14,
  },
  itemInfo: {
    flex: 1,
  },

  /* ======================
      Form Elements
  ====================== */
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: BLUE_PALETTE.extraLight,
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: BLUE_PALETTE.extraLight,
    borderRadius: 4,
    padding: 12,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: BLUE_PALETTE.dark,
  },
  dropdownPlaceholder: {
    color: BLUE_PALETTE.primary,
  },
  dropdownSelectedText: {
    color: BLUE_PALETTE.dark,
    fontSize: 16,
  },
  dropdownIcon: {
    color: BLUE_PALETTE.primary,
  },
  dropdownSearchInput: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: BLUE_PALETTE.extraLight,
    color: BLUE_PALETTE.dark,
  },
  segmentedButtons: {
    marginBottom: 8,
  },

  /* ======================
      Quantity Controls
  ====================== */
  quantitySection: {
    marginBottom: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityLabel: {
    fontSize: 16,
    color: BLUE_PALETTE.dark,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityInput: {
    width: 50,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: BLUE_PALETTE.extraLight,
    borderRadius: 4,
    padding: 8,
    color: BLUE_PALETTE.dark,
  },
  quantityText: {
    fontSize: 16,
    minWidth: 24,
    textAlign: 'center',
    color: BLUE_PALETTE.dark,
  },
  quantityDisplay: {
    fontSize: 18,
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'center',
    color: BLUE_PALETTE.dark,
  },

  /* ======================
      Summary & Footer
  ====================== */
  summaryContainer: {
    borderTopWidth: 1,
    borderTopColor: BLUE_PALETTE.extraLight,
    paddingTop: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryTotalRow: {
    borderTopWidth: 1,
    borderTopColor: BLUE_PALETTE.extraLight,
    paddingTop: 8,
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: BLUE_PALETTE.dark,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: BLUE_PALETTE.primary,
  },
  totalLabel: {
    fontWeight: 'bold',
    color: BLUE_PALETTE.dark,
  },
  totalValue: {
    fontWeight: 'bold',
    color: BLUE_PALETTE.dark,
  },
  summaryDiscountInput: {
    flex: 1,
    marginRight: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: BLUE_PALETTE.extraLight,
    borderRadius: 4,
    padding: 8,
  },
  summaryDiscountButton: {
    backgroundColor: BLUE_PALETTE.light,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  summaryDiscountButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  footer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: BLUE_PALETTE.extraLight,
  },
  footerButtonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  footerPrimaryButton: {
    flex: 1,
    backgroundColor: BLUE_PALETTE.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  footerSecondaryButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: BLUE_PALETTE.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  footerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerSecondaryButtonText: {
    color: BLUE_PALETTE.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerNoteInput: {
    marginTop: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: BLUE_PALETTE.extraLight,
    borderRadius: 4,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },

  /* ======================
      Buttons & Actions
  ====================== */

  actionButton: {
    minWidth: 100,
    borderColor: theme.colors.primary,
    color: theme.colors.primary
  },
  actionButtonContained: {
    minWidth: 100,
    borderColor: BLUE_PALETTE.primary,
    backgroundColor: BLUE_PALETTE.light,
  },
  actionButtonLarge: {
    flex: 1,
    marginHorizontal: 8,
    borderColor: theme.colors.primary,
  },
  actionButtonLargeContained: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: BLUE_PALETTE.light,
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 8,
    backgroundColor: BLUE_PALETTE.light,
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    marginTop: 16,
    backgroundColor: BLUE_PALETTE.light,
  },
  printBtn: {
    marginTop: 8,
    backgroundColor: BLUE_PALETTE.light,
  },
  quantityButton: {
    padding: 8,
    backgroundColor: BLUE_PALETTE.light,
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: BLUE_PALETTE.extraLight,
  },
  addToOrderButton: {
    marginTop: 16,
    backgroundColor: BLUE_PALETTE.light,
  },

  /* ======================
      Text & Typography
  ====================== */
  errorText: {
    color: '#D32F2F',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: BLUE_PALETTE.primary,
    marginVertical: 16,
  },
  breakText: {
    textAlign: 'center',
    marginVertical: 16,
    fontStyle: 'italic',
    color: '#D32F2F',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 4,
    color: BLUE_PALETTE.dark,
  },
  statLabel: {
    fontSize: 14,
    color: BLUE_PALETTE.primary,
    textAlign: 'center',
  },
  memberStat: {
    fontSize: 13,
    color: BLUE_PALETTE.primary,
    marginBottom: 4,
  },

  /* ======================
      Dividers & Spacing
  ====================== */
  divider: {
    marginVertical: 12,
    backgroundColor: BLUE_PALETTE.extraLight,
    height: 1,
  },
  productModalDivider: {
    height: 1,
    backgroundColor: BLUE_PALETTE.extraLight,
    marginVertical: 12,
  },

  /* ======================
      Special Modifiers
  ====================== */
  outOfStockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(211, 47, 47, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  outOfStockText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  bestSellerBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(46, 125, 50, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bestSellerText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(198, 40, 40, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productModalCustomizationNote: {
    fontSize: 13,
    color: BLUE_PALETTE.primary,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  section: {
    marginBottom: 24,
    backgroundColor: BLUE_PALETTE.background,
    borderRadius: 8,
    padding: 16,
  },
  content: {
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ADD8E6', // Light Blue border
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#F0F8FF', // AliceBlue background
    textAlignVertical: 'top', // For multiline text input
    color: '#333',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
});