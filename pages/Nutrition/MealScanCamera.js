import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { Camera, useCameraDevices, useCameraPermission, getCameraDevice } from 'react-native-vision-camera';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
import { COLORS } from '../../constants';

export default function MealScanCamera({ navigation }) {
  const devices = Camera.getAvailableCameraDevices()
  const device = getCameraDevice(devices, 'back')
  const camera = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [hasPermissionEnabled, setHasPermissionEnabled] = useState(null);

  useEffect(() => {
    const checkPermission = async () => {
      const status = await Camera.getCameraPermissionStatus();
      setHasPermissionEnabled(status === 'granted');
      if (status !== 'granted') {
        const newStatus = await Camera.requestCameraPermission();
        setHasPermissionEnabled(newStatus === 'granted');
      }
    };
    checkPermission();
    
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const capturePhoto = async () => {
    try {
      if (camera.current) {
        const photo = await camera.current.takePhoto({
          qualityPrioritization: 'quality',
          flash: 'off',
        });
        navigation.navigate('MealPhotoPreview', { photo });
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
    }
  };

  if (!hasPermissionEnabled) {
    return (
      <View style={styles.centered}>
        <Text style={styles.iconText}>📷</Text>
        <Text style={styles.permissionText}>Camera permission not granted</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back to Nutrition Input</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ArrowHeaderNew navigation={navigation} title={"Scan Your Meal"} />
      <View style={styles.guidelinesContainer}>
        <View style={styles.guidelinesHeader}>
          <Text style={styles.iconText}>🍽️</Text>
          <Text style={styles.guidelinesTitle}>Meal Photo Guidelines</Text>
        </View>
        <View style={styles.guidelinesList}>
          <View style={styles.guidelineItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.guidelinesText}>Place meal on a flat surface with good lighting</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.guidelinesText}>Capture the entire meal in the frame</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.guidelinesText}>Avoid shadows and reflections</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.guidelinesText}>Take photo from directly above for best results</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.guidelinesText}>Ensure all food items are clearly visible</Text>
          </View>
        </View>
      </View>
      <View style={styles.cameraContainer}>
        <Camera
          ref={camera}
          style={styles.camera}
          device={device}
          isActive={true}
          photo={true}
        />
        <View style={styles.cameraOverlay}>
          <View style={styles.cameraFrame} />
          <Text style={styles.frameText}>Position your meal within this frame</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={capturePhoto}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back to Input</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 45 : 0,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.dark,
    padding: 20,
  },
  iconText: {
    fontSize: 24,
    marginRight: 10,
  },
  permissionText: {
    color: '#FFF',
    fontSize: 18,
    marginVertical: 20,
    textAlign: 'center',
  },
  guidelinesContainer: {
    backgroundColor: COLORS.lightDark,
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  guidelinesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  guidelinesTitle: {
    color: '#FF6A00',
    fontSize: 18,
    fontWeight: 'bold',
  },
  guidelinesList: {
    gap: 8,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkmark: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  guidelinesText: {
    color: '#FFF',
    fontSize: 14,
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraFrame: {
    width: '85%',
    height: '70%',
    borderWidth: 2,
    borderColor: '#FF6A00',
    borderRadius: 15,
    borderStyle: 'dashed',
  },
  frameText: {
    color: '#FF6A00',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  buttonContainer: {
    alignItems: 'center',
    gap: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF6A00',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
    padding: 12,
    borderRadius: 10,
    gap: 10,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#FF6A00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 