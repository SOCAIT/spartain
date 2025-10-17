import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, TextInput, Switch, ScrollView } from 'react-native';
import { COLORS } from '../../constants';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';

const CreateGroupScreen = ({ navigation }) => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleCreate = () => {
    // Implement group creation logic
    console.log('Creating group:', { groupName, description, isPrivate });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ArrowHeaderNew 
        navigation={navigation} 
        title="Create Group" 
        paddingTop={0}
        rightIcon={null}
        onRightIconPress={null}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.form}>
          <Text style={styles.label}>Group Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter group name"
            placeholderTextColor={COLORS.lightGray5}
            value={groupName}
            onChangeText={setGroupName}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your group..."
            placeholderTextColor={COLORS.lightGray5}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchLabel}>Private Group</Text>
              <Text style={styles.switchSubtext}>Members need approval to join</Text>
            </View>
            <Switch
              value={isPrivate}
              onValueChange={setIsPrivate}
              trackColor={{ false: COLORS.lightDark, true: COLORS.darkOrange }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.createButton, !groupName && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={!groupName}
        >
          <Text style={styles.createButtonText}>Create Group</Text>
        </TouchableOpacity>
      </ScrollView>
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
    padding: 16,
  },
  form: {
    marginBottom: 24,
  },
  label: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    color: COLORS.white,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  switchLabel: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  switchSubtext: {
    color: COLORS.lightGray5,
    fontSize: 12,
    marginTop: 4,
  },
  createButton: {
    backgroundColor: COLORS.darkOrange,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: COLORS.lightDark,
  },
  createButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateGroupScreen;

