import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const ChangePassword = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = () => {
    // Implement logic to change the password on your backend
    // Placeholder logic for demonstration
    console.log('Changed Password:', currentPassword, newPassword);

    // Navigate to the desired screen after changing the password
    navigation.navigate('Settings');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Change Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Current Password"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Change Password</Text>
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

export default ChangePassword;
