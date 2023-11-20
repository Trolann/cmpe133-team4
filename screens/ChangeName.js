import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const ChangeName = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSaveName = () => {
    // Implement logic to save the updated name to your backend
    // Placeholder logic for demonstration
    console.log('Updated Name:', firstName, lastName);

    // Navigate to the desired screen after saving
    navigation.navigate('Settings');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Change Name</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveName}>
        <Text style={styles.buttonText}>Save Name</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF0000',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#E8E8E8',
    borderWidth: 1,
    marginBottom: 20,
    padding: 15,
    borderRadius: 25,
  },
  saveButton: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default ChangeName;
