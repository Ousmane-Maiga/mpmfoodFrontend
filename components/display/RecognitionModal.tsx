import { View, Text, Modal, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Customer } from '@/types/displayTypes'; // Import Customer type

export default function RecognitionModal({
  visible,
  customer,
  onClose
}: {
  visible: boolean;
  customer: Customer; // Use the Customer type here
  onClose: () => void
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#333" />
          </TouchableOpacity>

          <View style={styles.modalContent}>
            <Image
              source={{ uri: customer?.image || 'https://placekitten.com/150/150' }}
              style={styles.modalImage}
            />
            <Text style={styles.modalTitle}>Thank You!</Text>
            <Text style={styles.modalText}>
              We appreciate your loyalty, {customer?.name || 'Valued Customer'}!
            </Text>
            <Text style={styles.modalSubtext}>
              Your continued support means everything to us.
            </Text>

            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={30} color="#FFD700" />
              <MaterialIcons name="star" size={30} color="#FFD700" />
              <MaterialIcons name="star" size={30} color="#FFD700" />
              <MaterialIcons name="star" size={30} color="#FFD700" />
              <MaterialIcons name="star" size={30} color="#FFD700" />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  modalContent: {
    alignItems: 'center',
    padding: 10,
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 5,
    color: '#555',
  },
  modalSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#777',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
});