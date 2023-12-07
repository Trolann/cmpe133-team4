import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createAccount } from '../services/api';

const CreateAccountScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state
  
  const handleCreateAccount = async () => {
    if (email && password && password === confirmPassword) {
      if (password.length < 10) {
        // Password is too short, show an alert to the user
        Alert.alert('Password Error', 'Password must be at least 10 characters long');
        return;
      }

      try {
        setIsLoading(true);
        const result = await createAccount(email, password);
        console.log('Create account successful', result);
        console.log('Access token', AccessToken);
        navigation.navigate('Sessions', {AccessToken: result.AccessToken});
      } catch (error) {
        console.error('Create account failed', error.message);
        console.log('Access token', AccessToken);
        Alert.alert(
         "Account Creation Failed",
         error.message,
         [
           {
             text: "OK",
             onPress: () => console.log("OK Pressed"),
           },
         ]
        );
       }
       finally {
        setIsLoading(false);
      }
    } else {
      // Handle invalid input or password mismatch
      console.log('Invalid input or password mismatch');
    }
  };

  useEffect(() => {
    return () => {
      // Reset loading state when the component unmounts
      setIsLoading(false);
    };
  }, []);
  
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
      <TouchableOpacity style={styles.button} onPress={handleCreateAccount} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
        )}
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
