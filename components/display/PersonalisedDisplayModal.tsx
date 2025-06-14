import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, Modal, TouchableOpacity } from 'react-native';
import CustomerCard from './CustomerCard'; // Assuming CustomerCard is in the same components directory
import RecognitionModal from './RecognitionModal';
import { Customer } from '@/types/displayTypes';
import { MaterialIcons } from '@expo/vector-icons';

interface PersonalizedDisplayModalProps {
  customer: Customer;
  isVisible: boolean;
  onClose: () => void;
}

const PersonalizedDisplayModal: React.FC<PersonalizedDisplayModalProps> = ({ customer, isVisible, onClose }) => {
  const [recognitionModalVisible, setRecognitionModalVisible] = useState(true);

  // Reset the recognition modal visibility when the main modal becomes visible
  React.useEffect(() => {
    if (isVisible) {
      setRecognitionModalVisible(true);
    }
  }, [isVisible]);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <ImageBackground
        source={{ uri: customer?.image || 'https://placekitten.com/800/400' }}
        style={styles.customerBackground}
        blurRadius={2}
      >
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.customerOverlay}>
          <CustomerCard customer={customer} />
        </View>

        <RecognitionModal
          visible={recognitionModalVisible}
          customer={customer}
          onClose={() => setRecognitionModalVisible(false)}
        />
      </ImageBackground>
    </Modal>
  );
};

const styles = StyleSheet.create({
  customerBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  customerOverlay: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
  },
});

export default PersonalizedDisplayModal;