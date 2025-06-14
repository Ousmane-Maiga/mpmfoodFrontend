// components/admin/employees/employeeForm.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Switch } from 'react-native';
import { theme } from '@/constants/theme';

// Interface for schedule data that will be submitted to the backend
interface ScheduleFormItem {
    schedule_date: string; // ISO-MM-DD
    is_day_off: boolean;
    start_time: string | null; // HH:MM, can be null if is_day_off is true
    end_time: string | null;   // HH:MM, can be null if is_day_off is true
}

// Interface for schedule data used internally in the form (includes dayName for display)
interface LocalScheduleFormItem extends ScheduleFormItem {
    dayName: string; // For display purposes only, not sent to backend
}

interface EmployeeFormProps {
    initialData: {
        employee_name: string;
        employee_role: string;
        pin: string;
        employee_email: string;
        employee_phone: string;
        schedule?: ScheduleFormItem[];
    };
    onSubmit: (data: any) => Promise<void> | void;
    onCancel: () => void;
    loading: boolean;
    submitButtonText?: string;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    loading,
    submitButtonText = "Save Changes",
}) => {
    const [formData, setFormData] = useState(() => {
        const baseData = {
            ...initialData,
            schedule: initialData.schedule || [] // Ensure it's always an array
        };

        const scheduleWithDayNames: LocalScheduleFormItem[] = [];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date(); // Start from current date to get current week's days

        // Populate a full 7-day schedule, defaulting to the new rules
        days.forEach((dayName, index) => {
            const date = new Date(today);
            date.setDate(today.getDate() + (index - today.getDay())); // Get date for each day of current week

            const defaultIsDayOff = (index === 0); // Sunday is index 0
            const defaultStartTime = '11:00';
            const defaultEndTime = '22:00';

            // Check if there's an existing schedule item for this date
            const existingItem = baseData.schedule.find(s => s.schedule_date === date.toISOString().split('T')[0]);

            scheduleWithDayNames.push({
                schedule_date: date.toISOString().split('T')[0], // YYYY-MM-DD
                is_day_off: existingItem ? existingItem.is_day_off : defaultIsDayOff,
                start_time: existingItem && !existingItem.is_day_off ? existingItem.start_time : (defaultIsDayOff ? null : defaultStartTime),
                end_time: existingItem && !existingItem.is_day_off ? existingItem.end_time : (defaultIsDayOff ? null : defaultEndTime),
                dayName: dayName, // For display
            });
        });

        // Ensure the formData.schedule is always sorted by date
        scheduleWithDayNames.sort((a, b) => new Date(a.schedule_date).getTime() - new Date(b.schedule_date).getTime());

        return { ...baseData, schedule: scheduleWithDayNames };
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleScheduleChange = (index: number, field: keyof ScheduleFormItem, value: any) => {
        setFormData(prev => {
            const newSchedule = [...prev.schedule];
            const currentDayName = newSchedule[index].dayName; // Preserve dayName
            newSchedule[index] = { ...newSchedule[index], [field]: value };
            newSchedule[index].dayName = currentDayName; // Re-assign dayName

            // If it's a day off, clear start/end times
            if (field === 'is_day_off' && value === true) {
                newSchedule[index].start_time = null; // Use null for DB
                newSchedule[index].end_time = null;   // Use null for DB
            }
            return { ...prev, schedule: newSchedule };
        });
    };

    const handleSubmit = () => {
        if (!formData.employee_name.trim() || !formData.employee_role.trim() || !formData.pin.trim()) {
            alert('Name, role, and PIN are required');
            return;
        }

        const cleanedSchedule: ScheduleFormItem[] = formData.schedule.map(day => {
            const { dayName, ...rest } = day; // Destructure to remove dayName
            return rest;
        });

        // Basic time validation for active days
        const invalidTimes = cleanedSchedule.some(day =>
            !day.is_day_off && (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(day.start_time || '') || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(day.end_time || ''))
        );

        if (invalidTimes) {
            alert('Please enter valid HH:MM times for all work days (e.g., 09:00, 17:00).');
            return;
        }

        onSubmit({ ...formData, schedule: cleanedSchedule });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Name*</Text>
            <TextInput
                style={styles.input}
                value={formData.employee_name}
                onChangeText={(text) => handleChange('employee_name', text)}
                placeholder="Employee Name"
                // @ts-ignore
                defaultValue={formData.employee_name || ''}
            />

            <Text style={styles.label}>Role*</Text>
            <TextInput
                style={styles.input}
                value={formData.employee_role}
                onChangeText={(text) => handleChange('employee_role', text)}
                placeholder="Employee Role"
                // @ts-ignore
                defaultValue={formData.employee_role || ''}
            />

            <Text style={styles.label}>PIN*</Text>
            <TextInput
                style={styles.input}
                value={formData.pin}
                onChangeText={(text) => handleChange('pin', text)}
                placeholder="4-digit PIN"
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry={true}
                // @ts-ignore
                defaultValue={formData.pin || ''}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                value={formData.employee_email}
                onChangeText={(text) => handleChange('employee_email', text)}
                placeholder="Employee Email"
                keyboardType="email-address"
                // @ts-ignore
                defaultValue={formData.employee_email || ''}
            />

            <Text style={styles.label}>Phone</Text>
            <TextInput
                style={styles.input}
                value={formData.employee_phone}
                onChangeText={(text) => handleChange('employee_phone', text)}
                placeholder="Employee Phone"
                keyboardType="phone-pad"
                // @ts-ignore
                defaultValue={formData.employee_phone || ''}
            />

            {/* Schedule Section */}
            <Text style={styles.sectionTitle}>Employee Schedule</Text>
            {formData.schedule.map((day: LocalScheduleFormItem, index: number) => (
                <View key={day.schedule_date} style={styles.scheduleRow}>
                    <Text style={styles.dayLabel}>{day.dayName}</Text>
                    <View style={styles.dayOffToggle}>
                        <Text>Day Off</Text>
                        <Switch
                            onValueChange={(value) => handleScheduleChange(index, 'is_day_off', value)}
                            value={day.is_day_off}
                        />
                    </View>
                    {!day.is_day_off && (
                        <View style={styles.timeInputs}>
                            <TextInput
                                style={styles.timeInput}
                                value={day.start_time || ''}
                                onChangeText={(text) => handleScheduleChange(index, 'start_time', text)}
                                placeholder="HH:MM"
                                keyboardType="numbers-and-punctuation"
                                maxLength={5}
                            />
                            <Text>-</Text>
                            <TextInput
                                style={styles.timeInput}
                                value={day.end_time || ''}
                                onChangeText={(text) => handleScheduleChange(index, 'end_time', text)}
                                placeholder="HH:MM"
                                keyboardType="numbers-and-punctuation"
                                maxLength={5}
                            />
                        </View>
                    )}
                </View>
            ))}

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={onCancel}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.submitButton]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>{submitButtonText}</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: theme.spacing.md,
    },
    label: {
        fontSize: 16,
        marginBottom: theme.spacing.sm,
        color: theme.colors.text,
    },
    input: {
        height: 40,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: theme.radius.sm,
        paddingHorizontal: theme.spacing.sm,
        marginBottom: theme.spacing.md,
        color: theme.colors.text,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    scheduleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.sm,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderLight,
    },
    dayLabel: {
        fontSize: 16,
        color: theme.colors.text,
        width: 90,
    },
    dayOffToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    timeInputs: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        flex: 1,
        justifyContent: 'flex-end',
    },
    timeInput: {
        width: 60,
        height: 30,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: theme.radius.sm,
        paddingHorizontal: theme.spacing.xs,
        textAlign: 'center',
        color: theme.colors.text,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: theme.spacing.md,
    },
    button: {
        padding: theme.spacing.sm,
        borderRadius: theme.radius.sm,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: theme.spacing.sm,
    },
    submitButton: {
        backgroundColor: theme.colors.primary,
    },
    cancelButton: {
        backgroundColor: theme.colors.secondary,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default EmployeeForm;
