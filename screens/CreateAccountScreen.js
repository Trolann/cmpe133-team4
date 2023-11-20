import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createAccount } from '../services/api';

const CreateAccountScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleCreateAccount = async () => {
    if (email && password && password === confirmPassword) {
      if (password.length < 10) {
        // Password is too short, show an alert to the user
        Alert.alert('Password Error', 'Password must be at least 10 characters long');
        return;
      }

      try {
        const result = await createAccount(email, password);
        console.log('Login successful', result);
        navigation.navigate('Swiping');
      } catch (error) {
        console.error('Login failed', error.message);
        // handling errors
      }
    } else {
      // Handle invalid input or password mismatch
      console.log('Invalid input or password mismatch');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateAccount}
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF0000', // Red color to match the theme
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#E8E8E8', // Light gray border
    borderWidth: 1,
    marginBottom: 20,
    padding: 15,
    borderRadius: 25, // Round the input field
  },
  button: {
    backgroundColor: '#FF0000', // Red background
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25, // Round the button
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateAccountScreen;
