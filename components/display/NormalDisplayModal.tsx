import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text } from 'react-native';
import DisplayCarousel from './DisplayCarousel'; // Assuming DisplayCarousel is in the same components directory
import { CarouselItem } from '@/types/displayTypes';
import { MaterialIcons } from '@expo/vector-icons';

interface NormalDisplayModalProps {
  images: CarouselItem[];
  isVisible: boolean;
  onClose: () => void;
}

const NormalDisplayModal: React.FC<NormalDisplayModalProps> = ({ images, isVisible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={30} color="white" />
        </TouchableOpacity>
        <DisplayCarousel images={images} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
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

export default NormalDisplayModal;