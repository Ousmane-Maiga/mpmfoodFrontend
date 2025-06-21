// // app/(tabs)/admin/reports/index.tsx
// import React, { useState } from 'react';
// import { View, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
// import { Text } from '@/components/ui/Text'; // Use your custom Text component
// import { theme } from '@/constants/theme'; // Import your theme
// import SalesReportsModal from '@/components/admin/reports/SalesReportsModal';
// import InventoryReportsModal from '@/components/admin/reports/InventoryReportsModal';
// import EmployeePerformanceReportsModal from '@/components/admin/reports/EmployeePerformanceReportsModal';

// /**
//  * Main Report Screen for the Admin section of the MPMFOOD-MANAGER app.
//  * This screen provides navigation to different types of reports (Sales, Inventory, Employee Performance)
//  * via dedicated modal components.
//  */
// const AdminReportsScreen: React.FC = () => {
//   // State variables to control the visibility of each report modal
//   const [isSalesModalVisible, setIsSalesModalVisible] = useState(false);
//   const [isInventoryModalVisible, setIsInventoryModalVisible] = useState(false);
//   const [isEmployeePerformanceModalVisible, setIsEmployeePerformanceModalVisible] = useState(false);

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView contentContainerStyle={styles.container}>
//         <Text style={[theme.text.heading1, styles.header]}>Reports Dashboard</Text>

//         {/* Sales Reports Button */}
//         <TouchableOpacity
//           style={styles.reportButton}
//           onPress={() => setIsSalesModalVisible(true)}
//         >
//           <Text style={styles.buttonText}>Sales Reports</Text>
//         </TouchableOpacity>

//         {/* Inventory Reports Button */}
//         <TouchableOpacity
//           style={styles.reportButton}
//           onPress={() => setIsInventoryModalVisible(true)}
//         >
//           <Text style={styles.buttonText}>Inventory Reports</Text>
//         </TouchableOpacity>

//         {/* Employee Performance Reports Button */}
//         <TouchableOpacity
//           style={styles.reportButton}
//           onPress={() => setIsEmployeePerformanceModalVisible(true)}
//         >
//           <Text style={styles.buttonText}>Employee Performance Reports</Text>
//         </TouchableOpacity>

//         {/* Sales Reports Modal */}
//         <SalesReportsModal
//           isVisible={isSalesModalVisible}
//           onClose={() => setIsSalesModalVisible(false)}
//         />

//         {/* Inventory Reports Modal */}
//         <InventoryReportsModal
//           isVisible={isInventoryModalVisible}
//           onClose={() => setIsInventoryModalVisible(false)}
//         />

//         {/* Employee Performance Reports Modal */}
//         <EmployeePerformanceReportsModal
//           isVisible={isEmployeePerformanceModalVisible}
//           onClose={() => setIsEmployeePerformanceModalVisible(false)}
//         />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: theme.colors.background, // Use theme background color
//   },
//   container: {
//     flexGrow: 1,
//     padding: theme.spacing.xl, // Use theme spacing
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   header: {
//     color: theme.colors.text, // Use theme text color
//     marginBottom: theme.spacing.xxl,
//     textAlign: 'center',
//   },
//   reportButton: {
//     backgroundColor: theme.colors.primary, // Use theme primary color
//     paddingVertical: theme.spacing.md,
//     paddingHorizontal: theme.spacing.lg,
//     borderRadius: theme.borderRadius.md,
//     width: '80%',
//     alignItems: 'center',
//     marginBottom: theme.spacing.md,
//     ...theme.shadows.md, // Use theme shadows
//   },
//   buttonText: {
//     color: theme.colors.text,
//     fontSize: theme.typography.fontSize.lg,
//     fontWeight: theme.typography.fontWeight.semibold
//   },
// });

// export default AdminReportsScreen;
