// components/admin/employees/addEmployee.tsx

import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; // Import KeyboardAwareScrollView
import { Text } from '@/components/ui/Text';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@/constants/employeesStyles';
import EmployeeForm from './employeeForm';
import { createEmployee } from '@/services/api';

interface AddEmployeeModalProps {
    visible: boolean;
    onClose: () => void;
    onEmployeeAdded: (newEmployee: any) => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
    visible,
    onClose,
    onEmployeeAdded
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (employeeData: any) => {
        try {
            setIsSubmitting(true);
            setError(null);

            const dataToSend = {
                ...employeeData,
                pin: employeeData.pin.toString()
            };

            const newEmployee = await createEmployee(dataToSend);
            onEmployeeAdded(newEmployee);
            onClose();
        } catch (err: any) {
            console.error('Error creating employee:', err);
            setError(err.message || 'Failed to create employee. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <SafeAreaView style={modalStyles.safeArea}>
                {/* Use KeyboardAwareScrollView */}
                <KeyboardAwareScrollView
                    style={modalStyles.scrollView}
                    contentContainerStyle={modalStyles.contentContainer}
                    // keyboardShouldPersistTaps is handled by KeyboardAwareScrollView
                    bounces={false}
                    enableOnAndroid={true} // Recommended for Android
                    extraScrollHeight={20} // Adjust this value as needed
                >
                    {/* Header with close button */}
                    <View style={modalStyles.modalHeader}>
                        <Text style={theme.text.heading2}>Add New Employee</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Error message */}
                    {error && (
                        <View style={modalStyles.errorContainer}>
                            <Text style={modalStyles.errorText}>{error}</Text>
                        </View>
                    )}

                    {/* Employee form */}
                    <EmployeeForm
                        initialData={{
                            employee_name: '',
                            employee_role: '',
                            pin: '',
                            employee_email: '',
                            employee_phone: '',
                            schedule: [],
                        }}
                        onSubmit={handleSubmit}
                        onCancel={onClose}
                        loading={isSubmitting}
                        submitButtonText="Add Employee"
                    />
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </Modal>
    );
};

// Define new StyleSheet for modal-specific styles to avoid conflicts
const modalStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollView: {
        flex: 1,
        padding: theme.spacing.md,
    },
    contentContainer: {
        paddingBottom: theme.spacing.lg,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    errorContainer: {
        backgroundColor: theme.colors.dangerLight, // Use dangerLight from theme
        padding: theme.spacing.sm,
        // FIX: Use theme.roundness for consistent border radius
        borderRadius: theme.roundness,
        marginBottom: theme.spacing.md,
        borderWidth: 1, // Add border to make it visually distinct
        borderColor: theme.colors.danger, // Use danger for border color
    },
    errorText: {
        color: theme.colors.danger,
        textAlign: 'center',
        fontWeight: theme.typography.fontWeight.semibold, // Make error text slightly bolder
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
        paddingTop: theme.spacing.sm,
    },
});

export default AddEmployeeModal;
