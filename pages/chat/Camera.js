import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { Camera, useCameraDevices, useCameraPermission, getCameraDevice } from 'react-native-vision-camera';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';

export default function CameraScreen({ navigation }) {
  const devices = Camera.getAvailableCameraDevices()
  const device = getCameraDevice(devices, 'back')
  const camera = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [hasPermissionEnabled, setHasPermissionEnabled] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
 
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
        setCapturedPhoto(photo);
        navigation.navigate('PhotoPreview', { photo });
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
          <Text style={styles.buttonText}>Back to Chat</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ArrowHeaderNew navigation={navigation} title={"Analyze Body"} />
      <View style={styles.guidelinesContainer}>
        <View style={styles.guidelinesHeader}>
          <Text style={styles.iconText}>ℹ️</Text>
          <Text style={styles.guidelinesTitle}>Photo Guidelines</Text>
        </View>
        <View style={styles.guidelinesList}>
          <View style={styles.guidelineItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.guidelinesText}>Stand straight with arms slightly away from your body</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.guidelinesText}>Wear form-fitting clothing or minimal clothing</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.guidelinesText}>Ensure good lighting in the room</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.guidelinesText}>Position camera at chest height</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.guidelinesText}>Keep your full body in frame</Text>
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
          <Text style={styles.backButtonText}>← Back to Chat</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 45 : 0,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
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
    backgroundColor: '#2C2C2E',
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
    width: '80%',
    height: '80%',
    borderWidth: 2,
    borderColor: '#FF6A00',
    borderRadius: 15,
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
});