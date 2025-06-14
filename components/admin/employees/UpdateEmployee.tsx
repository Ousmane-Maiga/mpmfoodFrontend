// components/admin/employees/UpdateEmployee.tsx

import React from 'react';
import { View, ActivityIndicator, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; // Import KeyboardAwareScrollView
import { useEmployeeData } from '../../../hooks/employees/useEmployeeData';
import EmployeeDetailHeader from './EmployeeDetailHeader';
import EmployeeContactInfo from './EmployeeContactInfo';
import EmployeeSchedule from './EmployeeSchedule';
import EmployeeActions from './EmployeeActions';
import EmployeeForm from './employeeForm';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';

interface UpdateEmployeeModalProps {
    employeeId: string;
    visible: boolean;
    onClose: () => void;
    onEmployeeUpdated?: (updatedData: any) => void;
    onEmployeeDeleted?: () => void;
}

const UpdateEmployeeModal: React.FC<UpdateEmployeeModalProps> = ({
    employeeId,
    visible,
    onClose,
    onEmployeeUpdated,
    onEmployeeDeleted
}) => {
    const {
        loading,
        error,
        employeeData,
        schedule,
        isEditing,
        updating,
        handleEditSubmit,
        handleDeleteEmployee,
        setIsEditing
    } = useEmployeeData(employeeId);

    const handleSubmit = async (updatedData: any) => {
        await handleEditSubmit(updatedData);
        onEmployeeUpdated?.(updatedData);
    };

    const handleDelete = async () => {
        try {
            const success = await handleDeleteEmployee();
            if (success) {
                onEmployeeDeleted?.();
                onClose();
            }
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    if (loading) {
        return (
            <Modal visible={visible} transparent>
                <View style={modalStyles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            </Modal>
        );
    }

    if (error || !employeeData) {
        return (
            <Modal visible={visible} transparent>
                <View style={modalStyles.container}>
                    <Text style={modalStyles.errorText}>{error || 'Employee not found'}</Text>
                    <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
                        <Text style={modalStyles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }

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
                    // keyboardShouldPersistTaps is handled by KeyboardAwareScrollView itself
                    bounces={false}
                    enableOnAndroid={true} // Recommended for Android
                    extraScrollHeight={20} // Adjust this value as needed for extra scroll space above the keyboard
                >
                    {/* Header with close button */}
                    <View style={modalStyles.modalHeader}>
                        <Text style={theme.text.heading2}>
                            {isEditing ? 'Edit Employee' : 'Employee Details'}
                        </Text>
                        <TouchableOpacity
                            onPress={onClose}
                            style={modalStyles.closeButton}
                        >
                            <Ionicons name="close" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>

                    {isEditing ? (
                        <EmployeeForm
                            initialData={{
                                employee_name: employeeData.employee_name,
                                employee_role: employeeData.employee_role,
                                pin: '****',
                                employee_email: employeeData.employee_email || '',
                                employee_phone: employeeData.employee_phone || '',
                                schedule: schedule
                            }}
                            onSubmit={handleSubmit}
                            onCancel={() => setIsEditing(false)}
                            loading={updating}
                            submitButtonText="Save Changes"
                        />
                    ) : (
                        <>
                            <EmployeeDetailHeader
                                name={employeeData.employee_name}
                                role={employeeData.employee_role}
                            />
                            <EmployeeContactInfo
                                email={employeeData.employee_email}
                                phone={employeeData.employee_phone}
                            />
                            <EmployeeSchedule schedule={schedule} />
                            <EmployeeActions
                                onEdit={() => setIsEditing(true)}
                                onDelete={handleDelete}
                                updating={updating}
                            />
                        </>
                    )}
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
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md,
    },
    errorText: {
        color: theme.colors.danger,
        textAlign: 'center',
        marginTop: 20,
    },
    closeButton: {
        padding: theme.spacing.sm,
    },
    closeButtonText: {
        color: theme.colors.primary,
        fontSize: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
        paddingTop: theme.spacing.sm,
    },
});

export default UpdateEmployeeModal;
