import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Button, Linking} from 'react-native';
import { COLORS } from '../../constants'
import ProfileCard from '../../components/ProfileCard'
import { AuthContext } from '../helpers/AuthContext'

const gyms = [
  {
    id: '1',
    name: 'Gym A',
    images: ['https://via.placeholder.com/400', 'https://via.placeholder.com/400', 'https://via.placeholder.com/400'],
    description: 'A great place to workout',
    link: 'https://gyma.com',
    address: '123 Gym Street, Fit City, 12345',
  },
  {
    id: '2',
    name: 'Gym B',
    images: ['https://via.placeholder.com/400', 'https://via.placeholder.com/400', 'https://via.placeholder.com/400'],
    description: 'Fitness and wellness center',
    link: 'https://gymb.com',
    address: '456 Wellness Ave, Healthy Town, 67890',
  },
  {
    id: '3',
    name: 'Gym C',
    images: ['https://via.placeholder.com/400', 'https://via.placeholder.com/400', 'https://via.placeholder.com/400'],
    description: 'Your local gym',
    link: 'https://gymc.com',
    address: '789 Local Blvd, Gymville, 11223',
  },
];

const clothes = [
  {
    id: '1',
    name: 'Shirt',
    images: ['https://via.placeholder.com/400', 'https://via.placeholder.com/400', 'https://via.placeholder.com/400'],
    description: 'Comfortable workout shirt',
    link: 'https://shirt.com'
  },
  {
    id: '2',
    name: 'Shorts',
    images: ['https://via.placeholder.com/400', 'https://via.placeholder.com/400', 'https://via.placeholder.com/400'],
    description: 'Lightweight shorts',
    link: 'https://shorts.com'
  },
  {
    id: '3',
    name: 'Shoes',
    images: ['https://via.placeholder.com/400', 'https://via.placeholder.com/400', 'https://via.placeholder.com/400'],
    description: 'Running shoes',
    link: 'https://shoes.com'
  },
];

const trainers = [
  {
    id: '1',
    name: 'Protein Powder',
    images: ['https://via.placeholder.com/400', 'https://via.placeholder.com/400', 'https://via.placeholder.com/400'],
    description: 'High-quality protein powder',
    link: 'https://protein.com'
  },
  {
    id: '2',
    name: 'Creatine',
    images: ['https://via.placeholder.com/400', 'https://via.placeholder.com/400', 'https://via.placeholder.com/400'],
    description: 'Creatine for strength',
    link: 'https://creatine.com'
  },
  {
    id: '3',
    name: 'Vitamins',
    images: ['https://via.placeholder.com/400', 'https://via.placeholder.com/400', 'https://via.placeholder.com/400'],
    description: 'Daily vitamins',
    link: 'https://vitamins.com'
  },
];

const ListScreen = ({ data, navigation }) => (
  <View style={styles.container}>
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ItemDetails', { item })}>
          <Image source={{ uri: item.images[0] }} style={styles.image} />
          <Text style={styles.text}>{item.name}</Text>
        </TouchableOpacity>
      )}
      numColumns={2}
      columnWrapperStyle={styles.row}
    />
  </View>
);

const DetailsScreen = ({ route }) => {
  const { item } = route.params;
  return (
    <View style={styles.detailsContainer}>
      <Image source={{ uri: item.images[0] }} style={styles.image} />
      <Text style={styles.detailsTitle}>{item.name}</Text>
      <Text style={styles.detailsDescription}>{item.description}</Text>
      <Button title="Visit Website" onPress={() => Linking.openURL(item.link)} />
    </View>
  );
};

const Gyms = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('Gyms');

  const renderContent = () => {
    switch (selectedTab) {
      case 'Gyms':
        return <ListScreen data={gyms} navigation={navigation} />;
      case 'Clothes':
        return <ListScreen data={clothes} navigation={navigation} />;
      case 'Trainers':
        return <ListScreen data={trainers} navigation={navigation} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.appContainer}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'Gyms' && styles.activeTab]}
          onPress={() => setSelectedTab('Gyms')}
        >
          <Text style={styles.tabText}>Gyms</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'Clothes' && styles.activeTab]}
          onPress={() => setSelectedTab('Clothes')}
        >
          <Text style={styles.tabText}>Clothes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'Trainers' && styles.activeTab]}
          onPress={() => setSelectedTab('Trainers')}
        >
          <Text style={styles.tabText}>Trainers</Text>
        </TouchableOpacity>
      </View>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
  },
  tabButton: {
    padding: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  tabText: {
    fontSize: 16,
    color: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.dark,

  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 8,
    borderRadius: 50,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  detailsImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailsDescription: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default Gyms