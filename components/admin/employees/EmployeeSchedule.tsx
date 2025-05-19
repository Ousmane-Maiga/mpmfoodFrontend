import React from 'react';
import { View, Text } from 'react-native';
import DetailRow from '../employees/DetailRow';
import { styles } from '../../../constants/employeesStyles';

interface ScheduleItem {
  day_of_week: string;
  start_time: string;
  end_time: string;
}

interface Props {
  schedule: ScheduleItem[];
}

const EmployeeSchedule = ({ schedule }: Props) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Work Schedule</Text>
      {schedule.length > 0 ? (
        schedule.map((shift, index) => (
          <DetailRow 
            key={`${shift.day_of_week}-${index}`} 
            label={shift.day_of_week} 
            value={`${shift.start_time} - ${shift.end_time}`} 
          />
        ))
      ) : (
        <Text style={styles.noScheduleText}>No schedule assigned</Text>
      )}
    </View>
  );
};

export default EmployeeSchedule;