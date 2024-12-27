import { View, Text, StyleSheet, Button, Image, Dimensions, ScrollView, TouchableOpacity} from 'react-native'
import React, {useEffect, useState, useContext} from 'react'
import { useNavigation } from '@react-navigation/native';
import ArrowHeader from '../../components/ArrowHeader';
import { AuthContext } from '../../helpers/AuthContext';
import { COLORS, FONTS, SIZES } from '../../constants';
import Carousel from 'react-native-snap-carousel';

const renderCarouselItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.carouselImage} />
  );
const ItemDetails = ({ route }) => {
    const navigation = useNavigation();
    const {authState} = useContext(AuthContext)
    const { item } = route.params;
    return (
      <View style={styles.container}>
        <ArrowHeader navigation={navigation} title={item.name} /> 
        <ScrollView contentContainerStyle={styles.detailsContainer}>
            <View style={styles.mapSnippet}>
                <Text style={styles.mapText}>Map Snippet</Text>
            </View>
            <View style={styles.detailsCard}>
                <Carousel
                data={item.images}
                renderItem={renderCarouselItem}
                sliderWidth={Dimensions.get('window').width}
                itemWidth={Dimensions.get('window').width}
                loop={true}
                />
                <View style={styles.detailsContent}>
                <Text style={styles.detailsTitle}>{item.name}</Text>
                <Text style={styles.detailsAddress}>{item.address}</Text>
                <Text style={styles.detailsDescription}>{item.description}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(item.link)}>
                    {/* <Ionicons name="ios-navigate" size={20} color="#fff" /> */}
                    <Text style={styles.buttonText}> Directions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('tel:+1234567890')}>
                    {/* <Ionicons name="ios-call" size={20} color="#fff" /> */}
                    <Text style={styles.buttonText}> Call</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </View>
        </ScrollView>
      </View>

    );
  };


  const styles = StyleSheet.create({
   
    container: {
        flex: 1,
        backgroundColor: COLORS.dark,
        //alignItems: 'center',
      },
      detailsContainer: {
        //flexGrow: 1,
        backgroundColor: '#f8f8f8',
      },
      mapSnippet: {
        height: 200,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
      },
      mapText: {
        color: '#fff',
        fontSize: 18,
      },
      detailsCard: {
        backgroundColor: COLORS.primary,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        marginTop: -20,
      },
      carouselImage: {
        width: Dimensions.get('window').width - 40,
        height: 200,
        resizeMode: 'cover',
        borderRadius: 10,
        marginBottom: 20,
      },
      detailsContent: {
        padding: 10,
      },
      detailsTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.white,
        //marginVertical: 10,
      },
      detailsAddress: {
        fontSize: 16,
        color: COLORS.lightGray,
        marginBottom: 10,
      },
      detailsDescription: {
        fontSize: 16,
        color: '#777',
        marginBottom: 20,
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
      },
      button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.dark,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
      },
      buttonText: {
        color: '#fff',
        fontSize: 16,
      },
  });

export default ItemDetails