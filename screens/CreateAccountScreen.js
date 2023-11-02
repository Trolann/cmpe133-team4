import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

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
      <Text style={styles.title}>Create Account</Text>
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
      <Button title="Create Account" onPress={handleCreateAccount} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth:
     1,
    marginBottom: 12,
    padding: 8,
    backgroundColor: 'white', // Set an input background color
  },
});

export default CreateAccountScreen
