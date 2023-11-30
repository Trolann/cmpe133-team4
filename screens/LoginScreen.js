import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { signIn } from '../services/api';
//"email": "newemail@binge.app",
//"password": "ExtraLongPassword"

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async() => {
    try {
      const result = await signIn(email, password);
      console.log('Login successful', result);
      navigation.navigate('Swiping', {AccessToken: result.access_token, result});
    } catch (error) {
      console.error('Login failed', error.message);
      // handling errors
    }
    
    if (email && password) {
      
      console.log('Email:', email);
      console.log('Password:', password);
      
      
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.card}>
        <Text style={styles.title}>Binge</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleSignIn}
        >
          <Text style={styles.buttonText}>Let's Binge!</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Change the background color to match the home page
  },
  card: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },
  title: {
    fontSize: 28, // Increase font size to match the home page
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF0000', // Match the theme color
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16, // Increase padding
    marginBottom: 20, // Increase margin
    borderRadius: 10, // Make input fields more rounded
  },
  button: {
    backgroundColor: '#FF0000',
    padding: 16,
    borderRadius: 30, // Make the button oval
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
