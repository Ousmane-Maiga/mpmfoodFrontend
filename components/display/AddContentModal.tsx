// components/display/AddContentModal.tsx
import React from 'react';
import { Modal, View, StyleSheet, Image } from 'react-native';
import { Button, Text, TextInput, ActivityIndicator } from 'react-native-paper';
import { theme } from '@/constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AddContentModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: () => void;
    onPickImage: () => void;
    imageFile: any;
    imageText: string;
    setImageText: (text: string) => void;
    loading: boolean;
}

const AddContentModal: React.FC<AddContentModalProps> = ({ 
    visible, 
    onClose, 
    onSubmit, 
    onPickImage, 
    imageFile, 
    imageText, 
    setImageText,
    loading 
}) => {
    return (
        <SafeAreaView style={styles.safeArea}>
           <Modal visible={visible} animationType="slide" transparent={false}>  
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Add Display Content</Text>
                        <Button 
                            onPress={onClose}
                            textColor={theme.colors.primary}
                        >
                            <Icon name="close" size={24} color={theme.colors.primary} />
                        </Button>
                    </View>

                    <View style={styles.modalContent}>
                        {imageFile ? (
                            <Image source={{ uri: imageFile.uri }} style={styles.imagePreview} />
                        ) : (
                            <View style={styles.placeholder}>
                                <Icon name="image" size={48} color="#ccc" />
                                <Text style={styles.placeholderText}>No image selected</Text>
                            </View>
                        )}

                        <Button 
                            mode="contained" 
                            onPress={onPickImage}
                            style={styles.pickButton}
                            icon="image"
                            buttonColor={theme.colors.primary}
                            textColor="#ffffff"
                        >
                            {imageFile ? 'Change Image' : 'Select Image'}
                        </Button>

                        <TextInput
                            label="Optional caption or ad text"
                            value={imageText}
                            onChangeText={setImageText}
                            style={styles.input}
                            mode="outlined"
                            outlineColor="#000000" // Black outline
                            activeOutlineColor={theme.colors.primary}
                            textColor="#000000"
                            theme={{ 
                                colors: { 
                                    primary: theme.colors.primary,
                                    background: '#ffffff'
                                } 
                            }}
                        />

                        <View style={styles.buttonRow}>
                            <Button 
                                mode="outlined" 
                                onPress={onClose}
                                style={styles.button}
                                disabled={loading}
                                textColor={theme.colors.primary}
                                theme={{ colors: { primary: theme.colors.primary } }}
                            >
                                Cancel
                            </Button>
                            <Button 
                                mode="contained" 
                                onPress={onSubmit}
                                style={[styles.button, { backgroundColor: theme.colors.primary }]}
                                disabled={!imageFile || loading}
                                icon={loading ? () => <ActivityIndicator color="white" /> : undefined}
                                textColor="#ffffff"
                            >
                                {loading ? 'Uploading...' : 'Upload'}
                            </Button>
                        </View>
                    </View>
                </View>
           </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    modalContainer: {
        flex: 1,
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
    modalContent: {
        flex: 1,
        justifyContent: 'center',
    },
    imagePreview: {
        width: '100%',
        height: 300,
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#f0f0f0',
    },
    placeholder: {
        width: '100%',
        height: 300,
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    placeholderText: {
        color: '#666',
        marginTop: 8,
    },
    pickButton: {
        marginBottom: 16,
    },
    input: {
        marginBottom: 24,
        backgroundColor: '#ffffff',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        marginHorizontal: 8,
    },
});

export default AddContentModal;