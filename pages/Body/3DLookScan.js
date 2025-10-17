import React, { useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { WebView } from 'react-native-webview';
import { AuthContext } from '../../helpers/AuthContext';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
import { COLORS } from '../../constants';
import { fitxpress_url, fitxpress_token } from '../../config/config';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const PhotoPicker = ({label, image, onPick}) => (
  <TouchableOpacity style={styles.photoPicker} onPress={onPick}>
    {image ? (
      <Image source={{uri: image.uri}} style={styles.photo} />
    ) : (
      <Text style={styles.photoPlaceholder}>Tap to add {label} photo</Text>
    )}
  </TouchableOpacity>
);

// helper to parse JSON safely (fallback to raw text)
const safeJSON = async (res) => {
  const text = await res.text();
  try {
    return { ok: res.ok, status: res.status, json: JSON.parse(text), raw: text };
  } catch {
    return { ok: res.ok, status: res.status, json: null, raw: text };
  }
};

export default function ThreeDLookScan({navigation}){
  const {authState} = useContext(AuthContext);
  const [frontPhoto, setFrontPhoto] = useState(null);
  const [sidePhoto, setSidePhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [measurement, setMeasurement] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [modelModalVisible, setModelModalVisible] = useState(false);

  const pickImage = async (which) => {
    const res = await launchImageLibrary({mediaType:'photo', quality:0.8, includeBase64:true});
    if(res.didCancel) return;
    if(res.assets && res.assets.length>0){
      const img = res.assets[0];
      if(which==='front') setFrontPhoto(img); else setSidePhoto(img);
    }
  };

  const takePhoto = async (which) => {
    const res = await launchCamera({mediaType:'photo', quality:0.8, includeBase64:true});
    if(res.didCancel) return;
    if(res.assets && res.assets.length>0){
      const img = res.assets[0];
      if(which==='front') setFrontPhoto(img); else setSidePhoto(img);
    }
  };

  const createMeasurement = async () => {
    if(!frontPhoto || !sidePhoto){
      Alert.alert('Photos missing','Please provide both front and side photos.');
      return;
    }
    setIsUploading(true);
    try{
      // Prepare JSON payload with Base64 images
            const heightNum = parseInt(authState.height_cm ?? authState.height ?? 170, 10);
      const weightNum = parseInt(authState.latest_body_measurement?.weight_kg ?? 70, 10);
      const ageNum    = parseInt(authState.age ?? 25, 10);

      const payload = {
        height: heightNum,
        weight: weightNum,
        age: ageNum,
        gender: authState.gender === 'F' ? 'female' : 'male',
        front_photo: `data:image/jpeg;base64,${frontPhoto.base64}`,
        side_photo: `data:image/jpeg;base64,${sidePhoto.base64}`,
      };

      console.log('[3DLOOK] Payload prepared', {
        ...payload,
        front_photo: `base64_length_${frontPhoto.base64?.length}`,
        side_photo: `base64_length_${sidePhoto.base64?.length}`,
      });

      const res = await fetch(`${fitxpress_url.replace(/\/$/,'')}/measurements/`,{
        method:'POST',
        headers:{
          'Authorization': `Token ${fitxpress_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const { ok, status, json: data, raw } = await safeJSON(res);
      if (!ok || !data) {
        console.log('[3DLOOK] Server error', status, raw.slice(0,300));
        Alert.alert('Create failed', raw.slice(0,300));
        setIsUploading(false);
        return;
      }
      setMeasurement(data);
      pollMeasurement(data.id);
    }catch(err){
      console.error(err);
      Alert.alert('Error',err.message);
      setIsUploading(false);
    }
  };

  const pollAttempts = useRef(0);
  const pollMeasurement = async (id) => {
    try{
      const res = await fetch(`${fitxpress_url.replace(/\/$/,'')}/measurements/${id}/`,{
        headers:{'Authorization':`Token ${fitxpress_token}`}
      });
      const { json: data, raw } = await safeJSON(res);
      if(!data){
        console.log('[3DLOOK] Poll non-json', raw.slice(0,200));
        Alert.alert('Error', 'Unexpected server response');
        setIsUploading(false);
        return;
      }
      if(['pending','processing','in_progress'].includes(data.status) && pollAttempts.current<60){
        pollAttempts.current+=1;
        setTimeout(()=>pollMeasurement(id),3000);
      }else if(data.status==='successful' || data.status==='completed'){
        setMeasurement(data);
        console.log('[3DLOOK] Measurement data', data);
        Alert.alert('Scan complete','Measurement processed successfully.');
        setIsUploading(false);
      }else if(data.status==='failed'){
        setIsUploading(false);
        Alert.alert('Scan failed','Please retake photos and try again.');
      }else{
        setIsUploading(false);
      }
    }catch(err){
      setIsUploading(false);
      Alert.alert('Error',err.message);
    }
  };

  // save measurement to user profile
  const saveMeasurementToProfile = async () => {
    if(!measurement) return;
    try{
      setIsSaving(true);
      // Example payload – adjust to your backend schema
      const updatePayload = {
        id: authState.id,
        latest_body_measurement: {
          weight_kg: measurement.weight,
          body_fat_percentage: measurement.fat_percentage,
          muscle_mass_kg: measurement.lean_body_mass,
          waist_circumference_cm: measurement.circumference_params?.waist,
          date: new Date().toISOString().split('T')[0],
        },
      };
      console.log('[3DLOOK] Saving to profile', updatePayload);
      // Example POST – change to your actual endpoint
      await fetch(`${backend_url}users/update/`,{
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(updatePayload),
      });
      Alert.alert('Saved','Measurements added to profile');
    }catch(err){
      console.error(err);
      Alert.alert('Save failed', err.message);
    }finally{
      setIsSaving(false);
    }
  };

  // open 3D model in app
  const open3DModel = () => {
    if(!measurement?.model_3d_url) return;
    setModelModalVisible(true);
  };

  // Generate HTML content for 3D model viewer
  const generate3DViewerHTML = (objUrl) => {
    console.log('[3D] Generating HTML for URL:', objUrl);
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>3D Body Model</title>
        <style>
            body { 
                margin: 0; 
                padding: 20px; 
                background: #222; 
                color: #fff; 
                font-family: Arial; 
                text-align: center;
            }
            #info { margin: 20px 0; }
            #viewer { 
                width: 100%; 
                height: 400px; 
                background: #333; 
                border: 2px solid #FF6A00; 
                border-radius: 10px;
                position: relative;
                overflow: hidden;
            }
            #loading { 
                position: absolute; 
                top: 50%; 
                left: 50%; 
                transform: translate(-50%, -50%);
                color: #fff; 
            }
            canvas { display: block; width: 100%; height: 100%; }
        </style>
    </head>
    <body>
        <div id="info">
            <h2>3D Body Model Viewer</h2>
            <p>Model URL: ${objUrl}</p>
            <p>Status: <span id="status">Initializing...</span></p>
        </div>
        
        <div id="viewer">
            <div id="loading">Loading 3D Model...</div>
        </div>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/OBJLoader.js"></script>
        <script>
            document.getElementById('status').innerHTML = 'Three.js loaded: ' + (typeof THREE !== 'undefined');
            
            if (typeof THREE === 'undefined') {
                document.getElementById('loading').innerHTML = 'Error: Three.js failed to load';
            } else {
                let scene, camera, renderer, controls;
                
                function init() {
                    document.getElementById('status').innerHTML = 'Initializing 3D scene...';
                    
                    const container = document.getElementById('viewer');
                    
                    // Scene setup
                    scene = new THREE.Scene();
                    scene.background = new THREE.Color(0x333333);
                    
                    // Camera setup
                    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
                    camera.position.set(0, 1, 3);
                    
                    // Renderer setup
                    renderer = new THREE.WebGLRenderer({ antialias: true });
                    renderer.setSize(container.clientWidth, container.clientHeight);
                    container.appendChild(renderer.domElement);
                    
                    // Lighting
                    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
                    scene.add(ambientLight);
                    
                    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
                    directionalLight.position.set(10, 10, 5);
                    scene.add(directionalLight);
                    
                    const frontLight = new THREE.DirectionalLight(0xffffff, 0.5);
                    frontLight.position.set(0, 0, 10);
                    scene.add(frontLight);
                    
                    document.getElementById('status').innerHTML = 'Loading OBJ model...';
                    
                    // Load OBJ model
                    const loader = new THREE.OBJLoader();
                    loader.load(
                        '${objUrl}',
                        function(object) {
                            document.getElementById('status').innerHTML = 'Processing model...';
                            
                            // Center and scale the model
                            const box = new THREE.Box3().setFromObject(object);
                            const center = box.getCenter(new THREE.Vector3());
                            const size = box.getSize(new THREE.Vector3());
                            
                            object.position.sub(center);
                            
                            // Scale to fit
                            const maxDim = Math.max(size.x, size.y, size.z);
                            const scale = 2 / maxDim;
                            object.scale.multiplyScalar(scale);
                            
                            // Apply material
                            object.traverse(function(child) {
                                if (child.isMesh) {
                                    child.material = new THREE.MeshLambertMaterial({
                                        color: 0xcccccc,
                                        wireframe: false
                                    });
                                }
                            });
                            
                            scene.add(object);
                            document.getElementById('loading').style.display = 'none';
                            document.getElementById('status').innerHTML = 'Model loaded successfully!';
                            
                            // Add mouse/touch controls
                            let mouseDown = false;
                            let mouseX = 0;
                            let mouseY = 0;
                            
                            container.addEventListener('mousedown', function(e) {
                                mouseDown = true;
                                mouseX = e.clientX;
                                mouseY = e.clientY;
                            });
                            
                            container.addEventListener('mouseup', function() {
                                mouseDown = false;
                            });
                            
                            container.addEventListener('mousemove', function(e) {
                                if (!mouseDown) return;
                                const deltaX = e.clientX - mouseX;
                                const deltaY = e.clientY - mouseY;
                                object.rotation.y += deltaX * 0.01;
                                object.rotation.x += deltaY * 0.01;
                                mouseX = e.clientX;
                                mouseY = e.clientY;
                            });
                            
                            // Touch controls
                            container.addEventListener('touchstart', function(e) {
                                if (e.touches.length === 1) {
                                    mouseDown = true;
                                    mouseX = e.touches[0].clientX;
                                    mouseY = e.touches[0].clientY;
                                }
                            });
                            
                            container.addEventListener('touchend', function() {
                                mouseDown = false;
                            });
                            
                            container.addEventListener('touchmove', function(e) {
                                if (!mouseDown || e.touches.length !== 1) return;
                                e.preventDefault();
                                const deltaX = e.touches[0].clientX - mouseX;
                                const deltaY = e.touches[0].clientY - mouseY;
                                object.rotation.y += deltaX * 0.01;
                                object.rotation.x += deltaY * 0.01;
                                mouseX = e.touches[0].clientX;
                                mouseY = e.touches[0].clientY;
                            });
                        },
                        function(progress) {
                            const percent = Math.round((progress.loaded / progress.total) * 100);
                            document.getElementById('status').innerHTML = 'Loading: ' + percent + '%';
                        },
                        function(error) {
                            console.error('Error loading model:', error);
                            document.getElementById('loading').innerHTML = 'Error loading model';
                            document.getElementById('status').innerHTML = 'Failed to load model: ' + error.message;
                        }
                    );
                    
                    // Animation loop
                    function animate() {
                        requestAnimationFrame(animate);
                        renderer.render(scene, camera);
                    }
                    animate();
                }
                
                // Start when page loads
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', init);
                } else {
                    init();
                }
            }
        </script>
    </body>
    </html>
    `;
  };

  return(
    <View style={styles.container}>
      <ArrowHeaderNew navigation={navigation} title="3D Body Scan" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Upload Photos</Text>
        <View style={styles.photoRow}>
          <PhotoPicker label="Front" image={frontPhoto} onPick={()=>pickImage('front')} />
          <PhotoPicker label="Side" image={sidePhoto} onPick={()=>pickImage('side')} />
        </View>
        <TouchableOpacity style={styles.button} onPress={createMeasurement} disabled={isUploading}>
          {isUploading ? <ActivityIndicator color="#fff"/> : <Text style={styles.buttonText}>Start Scan</Text>}
        </TouchableOpacity>
        {measurement && (
          <View style={styles.resultBox}>
            <View style={styles.resultHeader}>
              <MaterialIcons name="assessment" size={24} color="#FF6A00" />
              <Text style={styles.resultTitle}>Body Scan Results</Text>
            </View>
            
            {/* Main Metrics Cards */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <MaterialIcons name="monitor-weight" size={20} color="#4CAF50" />
                <Text style={styles.metricValue}>{measurement.bmi || 'N/A'}</Text>
                <Text style={styles.metricLabel}>BMI</Text>
              </View>
              
              <View style={styles.metricCard}>
                <MaterialIcons name="fitness-center" size={20} color="#2196F3" />
                <Text style={styles.metricValue}>{measurement.lean_body_mass || 'N/A'}</Text>
                <Text style={styles.metricLabel}>Lean Mass (kg)</Text>
              </View>
              
              <View style={styles.metricCard}>
                <MaterialIcons name="pie-chart" size={20} color="#FF9800" />
                <Text style={styles.metricValue}>{measurement.estimated_fat_body_mass || 'N/A'}</Text>
                <Text style={styles.metricLabel}>Body Fat (kg)</Text>
              </View>
            </View>

            {/* 3D Model Section */}
            {measurement.model_3d_url && (
              <View style={styles.modelSection}>
                <TouchableOpacity style={styles.modelPreviewButton} onPress={open3DModel}>
                  <MaterialIcons name="3d-rotation" size={32} color="#FF6A00" />
                  <View style={styles.modelTextContainer}>
                    <Text style={styles.modelTitle}>3D Body Model</Text>
                    <Text style={styles.modelSubtitle}>Tap to view interactive model</Text>
                  </View>
                  <MaterialIcons name="open-in-new" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.detailsButton} onPress={() => setDetailsModalVisible(true)}>
                <MaterialIcons name="visibility" size={16} color="#FFF" />
                <Text style={styles.detailsButtonText}>View All Details</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.saveButton} onPress={saveMeasurementToProfile} disabled={isSaving}>
                <MaterialIcons name="save" size={16} color="#FFF" />
                <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save to Profile'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsModalVisible}
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Complete Measurements</Text>
              <TouchableOpacity onPress={() => setDetailsModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScroll}>
              {measurement && (
                <>
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Body Composition</Text>
                    <Text style={styles.modalText}>BMI: {measurement.bmi}</Text>
                    <Text style={styles.modalText}>BMR: {measurement.bmr}</Text>
                    <Text style={styles.modalText}>Body Fat %: {measurement.fat_percentage}%</Text>
                    <Text style={styles.modalText}>Lean Body Mass: {measurement.lean_body_mass} kg</Text>
                    <Text style={styles.modalText}>Fat Body Mass: {measurement.fat_body_mass} kg</Text>
                    <Text style={styles.modalText}>Estimated Weight: {measurement.estimated_weight} kg</Text>
                  </View>

                  {measurement.circumference_params && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Circumference Measurements (cm)</Text>
                      <Text style={styles.modalText}>Chest: {measurement.circumference_params.chest}</Text>
                      <Text style={styles.modalText}>Waist: {measurement.circumference_params.waist}</Text>
                      <Text style={styles.modalText}>Hips: {measurement.circumference_params.low_hips}</Text>
                      <Text style={styles.modalText}>Bicep: {measurement.circumference_params.bicep}</Text>
                      <Text style={styles.modalText}>Thigh: {measurement.circumference_params.thigh}</Text>
                      <Text style={styles.modalText}>Neck: {measurement.circumference_params.neck}</Text>
                    </View>
                  )}

                  {measurement.model_3d_url && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>3D Model</Text>
                      <TouchableOpacity style={styles.modelButton} onPress={open3DModel}>
                        <MaterialIcons name="3d-rotation" size={16} color="#FFF" />
                        <Text style={styles.modelButtonText}>View 3D Model</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 3D Model Viewer Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modelModalVisible}
        onRequestClose={() => setModelModalVisible(false)}
      >
        <View style={styles.modelModalContainer}>
          <View style={styles.modelModalHeader}>
            <Text style={styles.modelModalTitle}>3D Body Model</Text>
            <TouchableOpacity 
              style={styles.closeModelButton} 
              onPress={() => setModelModalVisible(false)}
            >
              <MaterialIcons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          {measurement?.model_3d_url && (
            <WebView
              style={styles.webview}
              source={{ html: generate3DViewerHTML(measurement.model_3d_url) }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              renderLoading={() => (
                <View style={styles.webviewLoading}>
                  <ActivityIndicator size="large" color="#FF6A00" />
                  <Text style={styles.loadingText}>Loading 3D Model...</Text>
                </View>
              )}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles=StyleSheet.create({
  container:{flex:1,backgroundColor:COLORS.dark, paddingTop: Platform.OS==='ios' ? 40 : 0},
  scroll:{padding:20},
  sectionTitle:{color:'#fff',fontSize:18,fontWeight:'bold',marginBottom:10},
  photoRow:{flexDirection:'row',justifyContent:'space-between',marginBottom:20},
  photoPicker:{width:'48%',height:200,backgroundColor:'#333',borderRadius:10,justifyContent:'center',alignItems:'center'},
  photoPlaceholder:{color:'#888',textAlign:'center'},
  photo:{width:'100%',height:'100%',borderRadius:10},
  button:{backgroundColor:COLORS.darkOrange,padding:15,borderRadius:10,alignItems:'center'},
  buttonText:{color:'#fff',fontWeight:'bold'},
  
  // Results styling
  resultBox:{marginTop:20,backgroundColor:'#333',padding:20,borderRadius:15,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.25,shadowRadius:3.84,elevation:5},
  resultHeader:{flexDirection:'row',alignItems:'center',marginBottom:15},
  resultTitle:{color:'#fff',fontSize:18,fontWeight:'bold',marginLeft:8},
  
  // Metrics grid
  metricsGrid:{flexDirection:'row',justifyContent:'space-between',marginBottom:20},
  metricCard:{flex:1,backgroundColor:'#444',padding:15,borderRadius:10,alignItems:'center',marginHorizontal:5},
  metricValue:{color:'#fff',fontSize:18,fontWeight:'bold',marginTop:5},
  metricLabel:{color:'#ccc',fontSize:12,marginTop:5,textAlign:'center'},
  
  // Action buttons
  actionButtons:{flexDirection:'row',justifyContent:'space-between'},
  detailsButton:{flex:1,flexDirection:'row',backgroundColor:'#666',padding:12,borderRadius:8,alignItems:'center',justifyContent:'center',marginRight:10},
  detailsButtonText:{color:'#fff',fontWeight:'bold',marginLeft:5},
  saveButton:{flex:1,flexDirection:'row',backgroundColor:'#4DA6FF',padding:12,borderRadius:8,alignItems:'center',justifyContent:'center'},
  saveButtonText:{color:'#fff',fontWeight:'bold',marginLeft:5},
  
  // 3D Model section styling
  modelSection:{marginBottom:20},
  modelPreviewButton:{flexDirection:'row',backgroundColor:'#444',padding:15,borderRadius:12,alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:'#555'},
  modelTextContainer:{flex:1,marginLeft:12},
  modelTitle:{color:'#fff',fontSize:16,fontWeight:'bold'},
  modelSubtitle:{color:'#ccc',fontSize:12,marginTop:2},
  
  // Modal styling
  modalOverlay:{flex:1,backgroundColor:'rgba(0,0,0,0.7)',justifyContent:'flex-end'},
  modalContent:{backgroundColor:'#333',borderTopLeftRadius:20,borderTopRightRadius:20,maxHeight:'80%'},
  modalHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:20,borderBottomWidth:1,borderBottomColor:'#555'},
  modalTitle:{color:'#fff',fontSize:18,fontWeight:'bold'},
  modalScroll:{padding:20},
  modalSection:{marginBottom:20},
  modalSectionTitle:{color:'#FF6A00',fontSize:16,fontWeight:'bold',marginBottom:10},
  modalText:{color:'#fff',fontSize:14,marginBottom:5},
  modelButton:{flexDirection:'row',backgroundColor:'#FF6A00',padding:10,borderRadius:8,alignItems:'center',justifyContent:'center'},
  modelButtonText:{color:'#fff',fontWeight:'bold',marginLeft:5},
  
  // 3D Model Viewer Modal styling
  modelModalContainer:{flex:1, paddingTop: Platform.OS==='ios' ? 40 : 0, backgroundColor:COLORS.dark},
  modelModalHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:20,backgroundColor:'#333',borderBottomWidth:1,borderBottomColor:'#555'},
  modelModalTitle:{color:'#fff',fontSize:18,fontWeight:'bold'},
  closeModelButton:{padding:5},
  webview:{flex:1},
  webviewLoading:{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:COLORS.dark},
  loadingText:{color:'#fff',marginTop:10,fontSize:16},
}); 