import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    margin: 0,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    backgroundColor: 'white',
    height: '90%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  header: {
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
    color: '#1565C0',
  },
  content: {
    flex: 1,
    marginBottom: 16,
  },
  footer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E3F2FD',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#0D47A1',
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#BBDEFB',
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#0D47A1',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#BBDEFB',
    borderRadius: 4,
    padding: 12,
  },
  dropdownModal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E3F2FD',
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 8,
    backgroundColor: '#1E88E5',
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  emptyText: {
    textAlign: 'center',
    color: '#757575',
    marginVertical: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E3F2FD',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0D47A1',
  },
  itemPrice: {
    fontSize: 14,
    color: '#1565C0',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityText: {
    fontSize: 16,
    minWidth: 24,
    textAlign: 'center',
    color: '#0D47A1',
  },
  divider: {
    marginVertical: 12,
    backgroundColor: '#BBDEFB',
    height: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#0D47A1',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1565C0',
  },
  totalLabel: {
    fontWeight: 'bold',
    color: '#0D47A1',
  },
  totalValue: {
    fontWeight: 'bold',
    color: '#0D47A1',
  },
  addButton: {
    marginTop: 16,
    backgroundColor: '#1E88E5',
  },
  productModal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  productModalContent: {
    padding: 16,
  },
  productModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  productModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D47A1',
  },
  productList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  productItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E3F2FD',
    backgroundColor: 'white',
  },
  selectedProductItem: {
    backgroundColor: '#E3F2FD',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0D47A1',
  },
  productPrice: {
    fontSize: 14,
    color: '#1565C0',
  },
  variantSection: {
    marginBottom: 16,
  },
  variantItem: {
    padding: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#BBDEFB',
    borderRadius: 4,
    backgroundColor: 'white',
  },
  selectedVariantItem: {
    borderColor: '#1E88E5',
    backgroundColor: '#E3F2FD',
  },
  variantName: {
    fontSize: 14,
    color: '#0D47A1',
  },
  variantPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0D47A1',
  },
  quantitySection: {
    marginBottom: 16,
  },
  quantityButton: {
    padding: 8,
    backgroundColor: '#1E88E5',
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: '#BBDEFB',
  },
  quantityDisplay: {
    fontSize: 18,
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'center',
    color: '#0D47A1',
  },
  addToOrderButton: {
    marginTop: 16,
    backgroundColor: '#1E88E5',
  },
});