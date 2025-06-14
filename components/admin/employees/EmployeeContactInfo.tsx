import React from 'react';
import { View, Text } from 'react-native';
import DetailRow from '../employees/DetailRow';
import { styles } from'../../../constants/employeesStyles';

interface Props {
  // id: string,
  email?: string;
  phone?: string;

}

const EmployeeContactInfo = ({ email, phone }: Props) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Contact Information</Text>
      <DetailRow label="Email" value={email} />
      <DetailRow label="Phone" value={phone} />
      {/* <DetailRow label="id" value={id} /> */}
    </View>
  );
};

export default EmployeeContactInfo;