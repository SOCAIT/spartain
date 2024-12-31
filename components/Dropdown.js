import React, { FC, useState, useRef} from 'react';
import { StyleSheet, Text, TouchableOpacity,TouchableWithoutFeedback,  Modal, View, FlatList} from 'react-native';

import { COLORS, SIZES, FONTS } from '../constants';

// interface Props {
//   label: string;
// }

const Dropdown =  ({ label, data , onSelect}) => {
  const [visible, setVisible] = useState(false);

  const DropdownButton = useRef();
const [dropdownTop, setDropdownTop] = useState(0);
const [selected, setSelected] = useState(data[0]);
 

  const renderDropdown = () => {
    return (
      <Modal visible={visible} transparent animationType="slider" >
            <TouchableWithoutFeedback
            onPress={() => setVisible(false)}         
        >
            <View style={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
              <View
                style={{
                  height: 400,
                  width: SIZES.width * 0.8,
                  backgroundColor: COLORS.primary,
                  borderRadius: SIZES.radius
                }}
              >
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item, ind) => ind}
                    showsVerticalScrollIndicator={false}
                    style={{
                      padding: SIZES.padding * 2,
                      marginBottom: SIZES.padding * 2
                    }}
                >

                </FlatList>
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
      <Text style={styles.buttonText}>
        {(item.label) }
      </Text>
    </TouchableOpacity>
  );

  const onItemPress = (item) => {
    setSelected(item);
    onSelect(item);
    setVisible(false);
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={toggleDropdown}
      ref={DropdownButton}
    >
      {renderDropdown()}
      <Text style={styles.buttonText}>{selected.label}</Text>
      {/* <Icon type='ionicon' name='chevron-down' color={COLORS.white}/> */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightDark,
    borderRadius: SIZES.radius / 1.5,
    margin:10,
    width: '70%',
    padding: 10
    // zIndex: 1,
    // height: 50,
  },
  buttonText: {
    flex: 1,
    textAlign: 'center',
    color :COLORS.white,
    // size: 5
  },
  dropdown: {
    //position: 'absolute',
    backgroundColor: COLORS.lightDark,
    width: '100%',
    shadowColor: '#000000',
    shadowRadius: 4,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.5,
  },
  item: {
    
    padding: SIZES.padding, flexDirection: 'row'
  },
});

export default Dropdown;