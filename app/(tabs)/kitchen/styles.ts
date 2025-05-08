// import { StyleSheet } from 'react-native';

// export const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 16,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   statusTabs: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     padding: 8,
//     backgroundColor: 'white',
//   },
//   tab: {
//     padding: 8,
//   },
//    activeTab: {
//     padding: 8,
//     borderBottomWidth: 2,
//     // borderBottomColor: '#f7c40d',
//   },
//   tabText: {
//     fontSize: 16,
//   },
//   activeTabText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     // color: '#f7c40d',
//   },
//   orderCard: {
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 16,
//     margin: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   orderHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   orderId: {
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   orderTime: {
//     color: '#666',
//   },
//   customerName: {
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   item: {
//     flexDirection: 'row',
//     marginBottom: 4,
//   },
//   itemQuantity: {
//     fontWeight: 'bold',
//     marginRight: 4,
//   },
//   notes: {
//     fontStyle: 'italic',
//     marginTop: 8,
//     color: '#666',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#e0e0e0',
//     marginVertical: 12,
//   },
//   actionButton: {
//     // backgroundColor: '#f7c40d',
//     padding: 10,
//     borderRadius: 4,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   actionButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     padding: 16,
//     backgroundColor: 'white',
//     borderTopWidth: 1,
//     borderTopColor: '#e0e0e0',
//   },
//   footerIcon: {
//     alignItems: 'center',
//   },
// });



// app/(tabs)/kitchen/styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  tab: {
    padding: 8,
  },
  activeTab: {
    padding: 8,
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
  },
  activeTabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderId: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  orderTime: {
    color: '#666',
    fontSize: 14,
  },
  customerName: {
    fontWeight: 'bold',
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
  },
  itemsContainer: {
    marginBottom: 12,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'center',
  },
  itemQuantity: {
    fontWeight: 'bold',
    marginRight: 8,
    color: '#333',
    minWidth: 24,
  },
  itemText: {
    color: '#555',
    flexShrink: 1,
  },
  notesContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  notesLabel: {
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  notesText: {
    color: '#666',
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  actionButton: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerIcon: {
    alignItems: 'center',
  },
});