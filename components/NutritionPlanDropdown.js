import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, Modal, View, FlatList } from 'react-native';
import { Icon } from '@rneui/themed';
import { COLORS, SIZES } from '../constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const NutritionPlanDropdown = ({ label, data, onSelect }) => {
  const [visible, setVisible] = useState(false);
  const DropdownButton = useRef();
  const [dropdownTop, setDropdownTop] = useState(0);
  const [selected, setSelected] = useState(data[0]);

  useEffect(() => {
    console.log("data")
    console.log(data)
  },[])

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

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
      <Text style={styles.buttonText}>{item.label }</Text>
    </TouchableOpacity>
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
      <Text style={styles.buttonText}>{ selected.label }</Text>
      <Icon type='ionicon' name='chevron-down' color={COLORS.white} />
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
  item: {
    padding: SIZES.padding,
    flexDirection: 'row',
  },
});

export default NutritionPlanDropdown;
