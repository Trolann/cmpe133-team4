import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const CreateAccountScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleCreateAccount = () => {
    if (email && password && password === confirmPassword) {
      // Implement your account creation logic here
      console.log('Account created:');
      console.log('Email:', email);
      console.log('Password:', password);

      // Navigate to another screen, e.g., HomeScreen
      navigation.navigate('Settings');
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
