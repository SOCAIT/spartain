import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, TextInput } from 'react-native';
import { COLORS } from '../../constants';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const JoinGroupScreen = ({ navigation }) => {
  const [joinCode, setJoinCode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleJoinByCode = () => {
    console.log('Joining with code:', joinCode);
    // Implement join logic
  };

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    // Implement search logic
  };

  return (
    <View style={styles.container}>
      <ArrowHeaderNew 
        navigation={navigation} 
        title="Join Group" 
        paddingTop={0}
        rightIcon={null}
        onRightIconPress={null}
      />

      <View style={styles.content}>
        {/* Join by Code */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Join by Code</Text>
          <Text style={styles.sectionSubtext}>Enter the invitation code shared with you</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter group code"
              placeholderTextColor={COLORS.lightGray5}
              value={joinCode}
              onChangeText={setJoinCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity 
              style={[styles.joinButton, !joinCode && styles.joinButtonDisabled]}
              onPress={handleJoinByCode}
              disabled={!joinCode}
            >
              <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Search Groups */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Search Groups</Text>
          <Text style={styles.sectionSubtext}>Find groups by name or description</Text>
          
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color={COLORS.lightGray5} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for groups..."
              placeholderTextColor={COLORS.lightGray5}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity 
            style={[styles.searchButton, !searchQuery && styles.searchButtonDisabled]}
            onPress={handleSearch}
            disabled={!searchQuery}
          >
            <MaterialIcons name="search" size={20} color={COLORS.white} />
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Results placeholder */}
        <View style={styles.resultsContainer}>
          <MaterialIcons name="groups" size={64} color={COLORS.lightGray5} />
          <Text style={styles.emptyText}>No groups found</Text>
          <Text style={styles.emptySubtext}>Try searching or enter a group code</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
    paddingTop: Platform.OS === 'ios' ? 45 : 0,
    paddingHorizontal: Platform.OS === 'ios' ? 20 : 0,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtext: {
    color: COLORS.lightGray5,
    fontSize: 14,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    color: COLORS.white,
    fontSize: 16,
  },
  joinButton: {
    backgroundColor: COLORS.darkOrange,
    borderRadius: 12,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  joinButtonDisabled: {
    backgroundColor: COLORS.lightDark,
  },
  joinButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.lightDark,
  },
  dividerText: {
    color: COLORS.lightGray5,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 16,
    marginLeft: 12,
  },
  searchButton: {
    backgroundColor: COLORS.darkOrange,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  searchButtonDisabled: {
    backgroundColor: COLORS.lightDark,
  },
  searchButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    color: COLORS.lightGray5,
    fontSize: 14,
    marginTop: 8,
  },
});

export default JoinGroupScreen;

