import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../../constants/employeesStyles';

interface Props {
  label: string;
  value?: string;
}

const DetailRow = ({ label, value }: Props) => {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value || 'Not provided'}</Text>
    </View>
  );
};

export default DetailRow;