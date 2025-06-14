// components/admin/employees/EmployeeSchedule.tsx

import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text'; // Adjusted path
import DetailRow from '../employees/DetailRow'; // Adjusted path
import { styles } from '../../../constants/employeesStyles';

// FIX: Removed 'employee_id' from this interface as it's not needed by this component for display
interface ScheduleItem {
    schedule_id?: number; // Optional, as it's not strictly needed for display here
    schedule_date: string; // ISO-MM-DD format
    is_day_off: boolean;
    start_time: string | null; // HH:MM string from DB
    end_time: string | null; // HH:MM string from DB
}

interface Props {
    schedule: ScheduleItem[];
}

const EmployeeSchedule = ({ schedule }: Props) => {
    // Helper to format date into a readable day name (e.g., "Monday, Jun 13")
    const formatDateToDay = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    };

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Schedule</Text>
            {schedule.length > 0 ? (
                schedule
                    // Sort by schedule_date to ensure chronological order
                    .sort((a, b) => new Date(a.schedule_date).getTime() - new Date(b.schedule_date).getTime())
                    .map((shift, index) => (
                        <DetailRow
                            // Key can now just be date and index since employee_id is for the whole schedule
                            key={`${shift.schedule_date}-${index}`}
                            label={formatDateToDay(shift.schedule_date)}
                            value={
                                shift.is_day_off
                                    ? "Day Off"
                                    : `${shift.start_time || 'N/A'} - ${shift.end_time || 'N/A'}`
                            }
                        />
                    ))
            ) : (
                <Text style={styles.noScheduleText}>No schedule assigned</Text>
            )}
        </View>
    );
};

export default EmployeeSchedule;
