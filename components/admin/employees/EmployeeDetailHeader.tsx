import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../../constants/employeesStyles';

interface Props {
  name: string;
  role: string;
}

const EmployeeDetailHeader = ({ name, role }: Props) => {
  return (
    <View style={styles.header}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.role}>{role}</Text>
    </View>
  );
};

export default EmployeeDetailHeader;