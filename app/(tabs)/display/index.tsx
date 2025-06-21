// app/(tabs)/display/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, ActivityIndicator, ScrollView, FlatList, Image } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Text, Avatar, Snackbar, Divider } from 'react-native-paper';
import { theme } from '@/constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { getDisplayImages, addDisplayImage, deleteDisplayImage, logEmployeeActivity } from '@/services/api';
import { CarouselItem } from '@/types/displayTypes';
import NormalDisplayModal from '@/components/display/NormalDisplayModal';
import AddContentModal from '@/components/display/AddContentModal';

const DisplayScreen: React.FC = () => {
    const { user: employee, loading: authLoading, onBreak, logout, toggleBreak } = useAuth();
    const userName = employee?.name || 'Unknown';
    const userRole = employee?.role || 'Employee';
    const [modalVisible, setModalVisible] = useState<'preview' | 'add' | null>(null);
    const [images, setImages] = useState<CarouselItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [localLoading, setLocalLoading] = useState(false);
    const [newImageFile, setNewImageFile] = useState<any>(null);
    const [newImageText, setNewImageText] = useState('');
    const [performanceStats, setPerformanceStats] = useState({
        imagesUploaded: 0,
        adsUploaded: 0,
        gifsUploaded: 0,
        imagesDeleted: 0,
    });

    const loadImages = async () => {
        setLoading(true);
        try {
            const fetchedImages = await getDisplayImages();
            setImages(fetchedImages);
            if (employee?.id) {
                await logEmployeeActivity({
                    employeeId: employee.id,
                    logType: 'display_viewed',
                    timestamp: new Date().toISOString(),
                });
            }
        } catch (err) {
            setError('Failed to load display images');
            console.error('Failed to load carousel images:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (employee?.id) {
            loadImages();
        }
    }, [employee?.id]);

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission required', 'Please enable photo library access');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.7,
                allowsMultipleSelection: false,
            });

            if (!result.canceled && result.assets[0]) {
                const selectedAsset = result.assets[0];
                setNewImageFile({
                    uri: selectedAsset.uri,
                    type: selectedAsset.mimeType || 'image/jpeg',
                    name: selectedAsset.fileName || `image-${Date.now()}.jpg`,
                });
            }
        } catch (err) {
            console.error('Image picker error:', err);
            setError('Failed to select image');
        }
    };

    const handleAddImage = async () => {
        if (!newImageFile?.uri || !employee) return;

        setLocalLoading(true);
        try {
            const formData = new FormData();
            formData.append('image', {
                uri: newImageFile.uri,
                type: newImageFile.type,
                name: newImageFile.name,
            } as any);

            if (newImageText.trim()) {
                formData.append('text', newImageText.trim());
            }

            formData.append('created_by', employee.id);

            const addedImage = await addDisplayImage(formData);
            setImages(prev => [...prev, addedImage]);

            // Update performance stats
            const isGif = newImageFile.type?.includes('gif');
            const isAd = newImageText.toLowerCase().includes('ad');
            setPerformanceStats(prev => ({
                ...prev,
                imagesUploaded: prev.imagesUploaded + 1,
                ...(isGif && { gifsUploaded: prev.gifsUploaded + 1 }),
                ...(isAd && { adsUploaded: prev.adsUploaded + 1 }),
            }));

            setNewImageFile(null);
            setNewImageText('');
            setModalVisible(null);
            Alert.alert('Success', 'Image added successfully!');
        } catch (err) {
            setError('Failed to add image');
            console.error('Error adding image:', err);
        } finally {
            setLocalLoading(false);
        }
    };

    const handleDeleteImage = async (imageId: number) => {
        if (!employee) return;

        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to remove this image?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setLocalLoading(true);
                        try {
                            await deleteDisplayImage(imageId, employee.id);
                            setImages(prev => prev.filter(img => img.id !== imageId));
                            setPerformanceStats(prev => ({
                                ...prev,
                                imagesDeleted: prev.imagesDeleted + 1,
                            }));
                            Alert.alert('Success', 'Image removed');
                        } catch (err) {
                            setError('Failed to remove image');
                            console.error('Error deleting image:', err);
                        } finally {
                            setLocalLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const handleLogout = () => {
        Alert.alert(
            'Confirm Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    onPress: async () => {
                        setLocalLoading(true);
                        try {
                            await logout();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to logout');
                        } finally {
                            setLocalLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const handleToggleBreak = async () => {
        setLocalLoading(true);
        try {
            await toggleBreak();
        } catch (error) {
            Alert.alert('Error', 'Failed to update break status');
        } finally {
            setLocalLoading(false);
        }
    };

    if (loading || authLoading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                {/* User Status Bar */}
                <View style={styles.userContainer}>
                    <View style={styles.userInfo}>
                          <Avatar.Text
                              size={40}
                              label={userName.split(' ').map((n) => n[0]).join('')}
                              style={{ backgroundColor: theme.colors.primary }}
                          />
                          <View style={styles.userText}>
                              <Text style={styles.userName}>{userName}</Text>
                              <Text style={styles.userRole}>{userRole}</Text>
                              {/* Status dot based on onBreak state from AuthContext */}
                              <View style={[styles.statusDot, { backgroundColor: !onBreak ? '#4CAF50' : '#F44336' }]} />
                          </View>
                      </View>
                    <View style={styles.actions}>
                        <Button
                            mode="outlined"
                            onPress={handleToggleBreak}
                            loading={localLoading}
                            disabled={authLoading || localLoading}
                            labelStyle={{
                                color: onBreak ? theme.colors.danger : theme.colors.primary
                            }}
                        >
                            {onBreak ? 'End Break' : 'Take Break'}
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleLogout}
                            loading={localLoading}
                            disabled={authLoading || localLoading}
                            labelStyle={{ color: 'white' }}
                            style={{ backgroundColor: theme.colors.primary }}
                        >
                            Logout
                        </Button>
                    </View>
                </View>

                {/* Performance Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <View style={{ flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                            <Icon name="image" size={24} color={theme.colors.primary} />
                            <Text style={styles.statValue}>{performanceStats.imagesUploaded}</Text>
                        </View>
                        <Text style={styles.statLabel}>Images</Text>
                    </View>
                    <View style={styles.statItem}>
                        <View style={{ flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                            <Icon name="animation" size={24} color={theme.colors.primary} />
                            <Text style={styles.statValue}>{performanceStats.gifsUploaded}</Text>
                        </View>
                        <Text style={styles.statLabel}>GIFs</Text>
                    </View>
                    <View style={styles.statItem}>
                        <View style={{ flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                            <Icon name="advertisements" size={24} color={theme.colors.primary} />
                            <Text style={styles.statValue}>{performanceStats.adsUploaded}</Text>
                        </View>
                        <Text style={styles.statLabel}>Ads</Text>
                    </View>
                </View>

                {onBreak && (
                    <Text style={[styles.breakText, { color: theme.colors.danger }]}>
                        You are currently on break - content management paused
                    </Text>
                )}

                <View style={styles.buttonGroup}>
                    <Button
                    mode="contained"
                    onPress={() => setModalVisible('preview')}
                    disabled={onBreak}
                    labelStyle={{ color: '#fff' }}
                    style={[styles.button, { backgroundColor: theme.colors.primary }]}
                    icon="monitor-eye"
                >
                    Display
                </Button>

                <Button
                    mode="outlined"
                    onPress={() => {
                        if (!onBreak) setModalVisible('add');
                    }}
                    disabled={onBreak}
                    style={[styles.button, { backgroundColor: '#ffffff' }]}
                    labelStyle={{ color: theme.colors.primary }}
                    icon="plus-circle-outline"
                >
                    Add Content
                </Button>
                </View>

                {/* Display Content List */}
                <View style={styles.contentSection}>
                    <Text style={styles.sectionTitle}>
                        Display Content ({images.length} items)
                    </Text>
                    <Divider style={styles.divider} />
                    {images.length === 0 ? (
                        <Text style={styles.emptyText}>No display content found</Text>
                    ) : (
                        <FlatList
                            data={images}
                            scrollEnabled={false}
                            renderItem={({ item }) => (
                                <View style={styles.contentItem}>
                                    <Image source={{ uri: item.url }} style={styles.contentImage} />
                                    <View style={styles.contentInfo}>
                                        <Text style={styles.contentId}>ID: {item.id}</Text>
                                        {item.text && <Text style={styles.contentText}>{item.text}</Text>}
                                    </View>
                                    <Button
                                        icon="delete"
                                        mode="text"
                                        onPress={() => handleDeleteImage(item.id)}
                                        disabled={onBreak}
                                        textColor={theme.colors.danger}
                                        children={undefined}
                                    />
                                </View>
                            )}
                            keyExtractor={item => item.id.toString()}
                        />
                    )}
                </View>

                <NormalDisplayModal
                    isVisible={modalVisible === 'preview'}
                    onClose={() => setModalVisible(null)}
                    images={images}
                />

                <AddContentModal
                    visible={modalVisible === 'add'}
                    onClose={() => setModalVisible(null)}
                    onSubmit={handleAddImage}
                    onPickImage={pickImage}
                    imageFile={newImageFile}
                    imageText={newImageText}
                    setImageText={setNewImageText}
                    loading={localLoading}
                />

                <Snackbar
                    visible={!!error}
                    onDismiss={() => setError(null)}
                    action={{
                        label: 'Dismiss',
                        onPress: () => setError(null),
                    }}
                    style={{ backgroundColor: theme.colors.danger }}
                >
                    {error}
                </Snackbar>
            </ScrollView>
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
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    userContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        marginBottom: theme.spacing.lg,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userText: {
        marginLeft: theme.spacing.sm,
        flexDirection: 'column',
    },
    userName: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text,
    },
    userRole: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.textSecondary,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: theme.colors.background,
    },
    actions: {
        flexDirection: 'column',
        gap: theme.spacing.sm,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.lg,
        ...theme.shadows.md,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text,
    },
    statLabel: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: theme.spacing.lg,
    },
    button: {
        flex: 1,
        marginHorizontal: theme.spacing.xs,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.xl,
    },
    breakText: {
        textAlign: 'center',
        fontSize: theme.typography.fontSize.md,
        fontWeight: theme.typography.fontWeight.semibold,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.lg,
        color: theme.colors.danger,
    },
    contentSection: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.lg,
        ...theme.shadows.md,
    },
    sectionTitle: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    divider: {
        backgroundColor: theme.colors.border,
        marginBottom: theme.spacing.md,
    },
    emptyText: {
        textAlign: 'center',
        color: theme.colors.textSecondary,
        paddingVertical: theme.spacing.lg,
    },
    contentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderLight,
    },
    contentImage: {
        width: 60,
        height: 60,
        borderRadius: theme.borderRadius.sm,
        marginRight: theme.spacing.md,
    },
    contentInfo: {
        flex: 1,
    },
    contentId: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textSecondary,
    },
    contentText: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.text,
        marginTop: theme.spacing.xs,
    },
});

export default DisplayScreen;