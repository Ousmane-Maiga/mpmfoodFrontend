import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import NormalDisplayModal from '@/components/display/NormalDisplayModal';
import { CarouselItem } from '@/types/displayTypes';
import { theme } from '@/constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDisplayImages, addDisplayImage, deleteDisplayImage } from '@/services/api';

// *** NEW: Import expo-image-picker ***
import * as ImagePicker from 'expo-image-picker';

// *** NEW: Define a type for the asset from expo-image-picker ***
// This interface defines the properties you'll use from the selected image asset
// and is designed to be compatible with what your backend FormData expects.
interface ExpoAsset {
    uri: string;
    width?: number;
    height?: number;
    fileName?: string; // This property typically exists on expo-image-picker's assets
    type?: string;     // This property typically maps to mimeType on expo-image-picker's assets
    name?: string;     // This is the property you want to add for FormData's 'name' field
}

  // Static constant for file size limit (this generally remains absolute)
  const MAX_IMAGE_FILE_SIZE_MB = 5; // 5 MB
  const MAX_IMAGE_FILE_SIZE_BYTES = MAX_IMAGE_FILE_SIZE_MB * 1024 * 1024;

  // *** NEW: Calculate dynamic max dimension based on screen size ***
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  // Use the larger of width/height and multiply by a factor (e.g., 2 for high-res screens)
  const DYNAMIC_MAX_IMAGE_DIMENSION = Math.max(screenWidth, screenHeight) * 2;
  // This will ensure images are roughly 2x the largest screen dimension,
  // providing good quality on high-DPI screens without being ridiculously large.

const DisplayScreen: React.FC = () => {
  const [isNormalModalVisible, setIsNormalModalVisible] = useState(false);
  const [images, setImages] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for Add Image Modal
  const [isAddImageModalVisible, setIsAddImageModalVisible] = useState(false);
  // *** NEW: Use the custom ExpoAsset type for newImageFile state ***
  const [newImageFile, setNewImageFile] = useState<ExpoAsset | null>(null);
  const [newImageText, setNewImageText] = useState('');
  const [isAddingImage, setIsAddingImage] = useState(false);

  const loadImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedImages = await getDisplayImages();
      setImages(fetchedImages);
    } catch (err) {
      console.error('Failed to load carousel images from backend:', err);
      setError('Failed to load display images. Please check network connection.');
      Alert.alert('Error', 'Failed to load display images.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleNormalDisplayPress = () => {
    setIsNormalModalVisible(true);
  };

  // *** MODIFIED pickImage function for expo-image-picker ***
 // index.tsx (inside your DisplayScreen component)

// index.tsx (inside the pickImage function)

const pickImage = async () => {
  console.log('✅ pickImage function triggered!');

  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please enable photo library access in your device settings to select images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsMultipleSelection: false,
    });

    console.log('Image picker result:', result);

    if (result.canceled) {
      console.log('User cancelled image picker');
    } else if (result.assets && result.assets.length > 0) {
      const [selectedAsset] = result.assets;

      if (selectedAsset.uri) {
        const { width, height, fileSize } = selectedAsset;

        // Check File Size (still static, as it's a backend/storage concern)
        if (fileSize && fileSize > MAX_IMAGE_FILE_SIZE_BYTES) {
          Alert.alert(
            'Image Too Large',
            `Selected image is too large (${(fileSize / (1024 * 1024)).toFixed(2)} MB). Maximum allowed size is ${MAX_IMAGE_FILE_SIZE_MB} MB.`
          );
          return;
        }

        // *** NEW: Check Dimensions using the DYNAMIC_MAX_IMAGE_DIMENSION ***
        if (width && height && (width > DYNAMIC_MAX_IMAGE_DIMENSION || height > DYNAMIC_MAX_IMAGE_DIMENSION)) {
          Alert.alert(
            'Image Dimensions Too Large',
            `Selected image dimensions (${width}x${height}) are too large. Maximum allowed dimension (width or height) is ${DYNAMIC_MAX_IMAGE_DIMENSION}px.`
          );
          return;
        }

        // If checks pass, proceed
        setNewImageFile({
          uri: selectedAsset.uri,
          type: selectedAsset.mimeType || 'image/jpeg',
          name: selectedAsset.fileName || `image-${Date.now()}.jpg`,
          width: selectedAsset.width,
          height: selectedAsset.height
        });
      } else {
        Alert.alert('Error', 'Could not get image URI from selected asset.');
      }
    } else {
      Alert.alert('Selection Error', 'No image was selected, or an unexpected issue occurred.');
    }
  } catch (err: any) {
    console.error('Unexpected error opening image picker:', err);
    let alertMessage = 'Failed to open image picker.';

    if (err.code) {
      if (err.code === 'E_NO_CAMERA_PERMISSION' || err.code === 'E_NO_LIBRARY_PERMISSION') {
        alertMessage = 'Permission denied. Please grant photo library access in settings.';
      } else if (err.code === 'E_PICKER_ERR') {
        alertMessage = `Picker Error: ${err.message || 'An internal error occurred.'}`;
      } else {
        alertMessage = `An unexpected error occurred: ${err.message || 'Unknown error'}.`;
      }
    } else if (err.message) {
      alertMessage = `Failed to open image picker: ${err.message}`;
    }
    Alert.alert('Error', alertMessage);
  }
};

  // NEW: Handle adding a new image
  const handleAddImage = async () => {
    if (!newImageFile?.uri) {
      Alert.alert('Error', 'Please select an image first.');
      return;
    }

    setIsAddingImage(true);
    try {
      const formData = new FormData();

      // Create the file object with proper typing for FormData
      // Ensure 'type' and 'name' properties are present as FormData expects them
      const file = {
        uri: newImageFile.uri,
        type: newImageFile.type || 'image/jpeg', // Use the 'type' from ExpoAsset
        name: newImageFile.name || `image-${Date.now()}.jpg`, // Use the 'name' from ExpoAsset
      };

      // Append the image file
      formData.append('image', file as any); // Type assertion might still be needed here for FormData.append due to RN's FormData types

      // Append other fields if provided
      if (newImageText.trim()) {
        formData.append('text', newImageText.trim());
      }

      // Optional: Add display order if needed
      // formData.append('displayOrder', '0');

      const addedImage = await addDisplayImage(formData);
      setImages(prevImages => [...prevImages, addedImage]);
      Alert.alert('Success', 'Image added successfully!');
      setIsAddImageModalVisible(false);
      setNewImageFile(null);
      setNewImageText('');
    } catch (err) {
      console.error('Error adding image:', err);
      Alert.alert('Error', 'Failed to add image. Please try again.');
    } finally {
      setIsAddingImage(false);
    }
  };

  // Handle deleting an image
  const handleDeleteImage = async (imageId: number) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to remove this image from the carousel?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true); // Show main loader or add a specific one
            try {
              await deleteDisplayImage(imageId);
              setImages(prevImages => prevImages.filter(img => img.id !== imageId));
              Alert.alert('Success', 'Image removed successfully!');
            } catch (err) {
              console.error('Error deleting image:', err);
              Alert.alert('Error', 'Failed to remove image. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderImageItem = ({ item }: { item: CarouselItem }) => (
    <View style={styles.imageItem}>
      <View style={styles.imageItemDetails}>
        {item.url && <Image source={{ uri: item.url }} style={styles.thumbnail} />}
        <View style={styles.imageTextContainer}>
          <Text style={styles.imageItemTextId}>ID: {item.id}</Text>
          {item.text && <Text style={styles.imageItemText}>Text: {item.text}</Text>}
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleDeleteImage(item.id)}
      >
        <Icon name="close-circle" size={24} color={theme.colors.danger} />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading display images...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && images.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={50} color={theme.colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadImages}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header/Title */}
        <View style={styles.headerContainer}>
          <View style={styles.headerInfo}>
            <Icon name="monitor" size={40} color={theme.colors.primary} />
            <Text style={styles.headerTitle}>Display Settings</Text>
          </View>
        </View>

        {/* Action Button: Show Carousel Display */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={handleNormalDisplayPress}
          >
            <Icon name="monitor-dashboard" size={20} color={theme.colors.white} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Show Carousel Display</Text>
          </TouchableOpacity>
        </View>

        {/* Image Count & Add Image Button */}
        <View style={styles.managementHeader}>
          <View style={styles.imageCountContainer}>
            <Icon name="image-multiple" size={24} color={theme.colors.primary} />
            <Text style={styles.imageCountText}>Total Carousel Images: {images.length}</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsAddImageModalVisible(true)}
          >
            <Icon name="plus-circle" size={20} color={theme.colors.white} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Add Image</Text>
          </TouchableOpacity>
        </View>


        {/* List of Images */}
        {images.length > 0 ? (
          <FlatList
            data={images}
            renderItem={renderImageItem}
            keyExtractor={item => item.id.toString()}
            style={styles.imageList}
            contentContainerStyle={styles.imageListContent}
          />
        ) : (
          <Text style={styles.infoText}>No carousel images found. Add some!</Text>
        )}

        <NormalDisplayModal
          isVisible={isNormalModalVisible}
          onClose={() => setIsNormalModalVisible(false)}
          images={images}
        />

        {/* Add Image Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isAddImageModalVisible}
          onRequestClose={() => setIsAddImageModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Carousel Image</Text>

              {newImageFile && (
                <Image source={{ uri: newImageFile.uri }} style={styles.imagePreview} />
              )}

              <TouchableOpacity
                style={[styles.inputButton, { backgroundColor: newImageFile ? theme.colors.secondary : theme.colors.primary}]}
                onPress={pickImage}
              >
                <Text style={styles.inputButtonText}>
                  {newImageFile ? 'Change Image' : 'Select Image'}
                </Text>
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="Optional Text"
                placeholderTextColor={theme.colors.placeholder}
                value={newImageText}
                onChangeText={setNewImageText}
              />
              <View style={styles.modalButtonGroup}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: theme.colors.secondary }]}
                  onPress={() => {
                    setIsAddImageModalVisible(false);
                    setNewImageFile(null); // Clear selected file
                    setNewImageText('');
                  }}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                  onPress={handleAddImage}
                  disabled={isAddingImage || !newImageFile} // Disable if no file or adding
                >
                  {isAddingImage ? (
                    <ActivityIndicator color={theme.colors.white} />
                  ) : (
                    <Text style={styles.modalButtonText}>Add Image</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  errorText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
  retryButton: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  retryButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
  headerContainer: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    width: '100%',
  },
  button: {
    flex: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonIcon: {
    marginRight: theme.spacing.sm,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  managementHeader: {
    flexDirection: 'column',
    gap: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    width: '100%',
  },
  imageCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageCountText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  addButton: {
    backgroundColor: theme.colors.success,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  imageList: {
    width: '100%',
    flex: 1,
  },
  imageListContent: {
    paddingBottom: theme.spacing.md,
  },
  imageItem: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  imageItemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.sm,
    resizeMode: 'cover',
  },
  imageTextContainer: {
    flex: 1,
  },
  imageItemTextId: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  imageItemText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    flexShrink: 1,
  },
  removeButton: {
    marginLeft: theme.spacing.md,
    padding: theme.spacing.xs,
  },
  infoText: {
    textAlign: 'center',
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '85%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    resizeMode: 'contain', // Or 'cover' depending on your preference
    backgroundColor: theme.colors.backdrop, // Placeholder background
  },
  inputButton: {
    width: '100%',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  inputButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  input: {
    width: '100%',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  modalButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});

export default DisplayScreen;