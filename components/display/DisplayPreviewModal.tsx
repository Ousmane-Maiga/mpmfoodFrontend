// components/display/DisplayPreviewModal.tsx
import React from 'react';
import { Modal, View, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { theme } from '@/constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface DisplayPreviewModalProps {
    visible: boolean;
    onClose: () => void;
    images: any[];
}

const DisplayPreviewModal: React.FC<DisplayPreviewModalProps> = ({ visible, onClose, images }) => {
    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Display Preview</Text>
                    <Button onPress={onClose}>
                        <Icon name="close" size={24} />
                    </Button>
                </View>
                
                {images.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text>No content to display</Text>
                    </View>
                ) : (
                    <FlatList
                        data={images}
                        renderItem={({ item }) => (
                            <View style={styles.previewItem}>
                                <Image 
                                    source={{ uri: item.url }} 
                                    style={styles.previewImage} 
                                    resizeMode="contain"
                                />
                                {item.text && <Text style={styles.previewText}>{item.text}</Text>}
                            </View>
                        )}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={styles.previewList}
                    />
                )}
            </View>
        </Modal>
    );
};

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewList: {
        paddingBottom: 20,
    },
    previewItem: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    previewImage: {
        width: '100%',
        height: height * 0.5,
        borderRadius: 4,
    },
    previewText: {
        marginTop: 8,
        fontSize: 16,
        textAlign: 'center',
        color: theme.colors.text,
    },
});

export default DisplayPreviewModal;