import React, { useState, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, Modal, View, FlatList, Alert } from 'react-native';
import { COLORS, SIZES } from '../constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { backend_url } from '../config/config';

const PlanDropdown = ({ label, data, onSelect, onDelete }) => {
  const [visible, setVisible] = useState(false);
  const DropdownButton = useRef();
  const [dropdownTop, setDropdownTop] = useState(0);
  const [selected, setSelected] = useState(data[0]);

  const renderDropdown = () => {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View
              style={{
                height: 400,
                width: SIZES.width * 0.8,
                backgroundColor: COLORS.primary,
                borderRadius: SIZES.radius,
              }}
            >
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, ind) => `${item.value}-${ind}`} // Ensure the key is unique by combining item.value and index                showsVerticalScrollIndicator={false}
                style={{
                  padding: SIZES.padding * 2,
                  marginBottom: SIZES.padding * 2,
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  const toggleDropdown = () => {
    visible ? setVisible(false) : openDropdown();
  };

  const openDropdown = () => {
    DropdownButton.current.measure((_fx, _fy, _w, h, _px, py) => {
      setDropdownTop(py + h);
    });
    setVisible(true);
  };

  const handleDeletePlan = (item, event) => {
    event.stopPropagation();
    
    Alert.alert(
      'Delete Plan',
      `Are you sure you want to delete "${item.label}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${backend_url}workouts/plans/delete/${item.value}/`);
              Alert.alert('Success', 'Plan deleted successfully');
              setVisible(false);
              if (onDelete) {
                onDelete(item.value);
              }
            } catch (error) {
              console.error('Error deleting plan:', error);
              Alert.alert('Error', 'Failed to delete plan');
            }
          },
        },
      ],
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
        <Text style={styles.buttonText}>{item.label ? (item.label!=="" ? item.label : "Awesome Plan") : "Awesome Plan" }</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={(e) => handleDeletePlan(item, e)}
      >
        <MaterialIcons name="delete" size={24} color={COLORS.red || '#FF4444'} />
      </TouchableOpacity>
    </View>
  );

  const onItemPress = (item) => {
    setSelected(item);
    onSelect(item.value); // Ensure only the value is passed to the parent
    setVisible(false);
  };
 
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={toggleDropdown}
      ref={DropdownButton}
    >
      {renderDropdown()}
      <Text style={styles.buttonText}>{selected.label ? (selected.label!=="" ? selected.label : "Awesome Plan") : "Awesome Plan"}</Text>
      <MaterialIcons name="expand-more" size={30} color="#FF6A00" style={{marginTop:5}} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightDark,
    borderRadius: SIZES.radius / 1.5,
    margin: 10,
    width: '70%',
    padding: 10,
  },
  buttonText: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.white,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: SIZES.padding,
  },
  item: {
    padding: SIZES.padding,
    flexDirection: 'row',
    flex: 1,
  },
  deleteButton: {
    padding: SIZES.padding / 2,
    marginLeft: 10,
  },
});

export default PlanDropdown;
