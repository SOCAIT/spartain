import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../constants';
import Dropdown from '../Dropdown';

const LeaderboardHeader = ({ 
  selectedType = 'prs',
  onTypeChange,
  selectedScope = 'global',
  onScopeChange,
  selectedKey,
  onKeyChange,
  prKeys = [
    { label: 'Bench Press', value: 'bench' },
    { label: 'Squat', value: 'squat' },
    { label: 'Deadlift', value: 'deadlift' },
    { label: '5K Run', value: '5k' },
  ]
}) => {
  const types = [
    { id: 'prs', label: 'PRs' },
    { id: 'streaks', label: 'Streaks' },
    { id: 'badges', label: 'Badges' },
  ];

  const scopes = [
    { id: 'global', label: 'Global' },
    { id: 'friends', label: 'Friends' },
    { id: 'group', label: 'Group' },
  ];

  return (
    <View style={styles.container}>
      {/* Type Segments */}
      <View style={styles.segmentedContainer}>
        {types.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.segment,
              selectedType === type.id && styles.segmentActive
            ]}
            onPress={() => onTypeChange(type.id)}
          >
            <Text style={[
              styles.segmentText,
              selectedType === type.id && styles.segmentTextActive
            ]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* PR Key Dropdown (only show for PRs) */}
      {selectedType === 'prs' && (
        <View style={styles.dropdownContainer}>
          <Dropdown 
            data={prKeys}
            onSelect={(item) => onKeyChange(item.value)}
            label="Select Exercise"
          />
        </View>
      )}

      {/* Scope Chips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scopeContainer}
      >
        {scopes.map((scope) => (
          <TouchableOpacity
            key={scope.id}
            style={[
              styles.scopeChip,
              selectedScope === scope.id && styles.scopeChipActive
            ]}
            onPress={() => onScopeChange(scope.id)}
          >
            <Text style={[
              styles.scopeChipText,
              selectedScope === scope.id && styles.scopeChipTextActive
            ]}>
              {scope.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.dark,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightDark,
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  segmentActive: {
    backgroundColor: COLORS.darkOrange,
  },
  segmentText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
  segmentTextActive: {
    color: COLORS.white,
  },
  dropdownContainer: {
    marginBottom: 12,
  },
  scopeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  scopeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.lightDark,
    marginRight: 8,
  },
  scopeChipActive: {
    backgroundColor: COLORS.darkOrange,
    borderColor: COLORS.darkOrange,
  },
  scopeChipText: {
    color: COLORS.lightGray5,
    fontSize: 14,
    fontWeight: '500',
  },
  scopeChipTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
});

export default LeaderboardHeader;

