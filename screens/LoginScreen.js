import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { signIn } from '../services/api';
import { Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
//"email": "newemail@binge.app",
//"password": "ExtraLongPassword"

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state


  const handleSignIn = async() => {
    try {
      setIsLoading(true);
      const result = await signIn(email, password);
      global.globalUserID = result.text.data.id; //global User ID
      global.globalAccessToken = result.text.access_token;
      console.log('Login successful');
      //console.log('Result', result);
      
      console.log("ID: ", globalUserID);
      console.log("AccessToken: ", globalAccessToken);
      navigation.navigate('Sessions', {AccessToken: result.text.access_token, user_id: result.text.data.id});
    } catch (error) {
      console.error('Login failed', error.message);
      Alert.alert(
        "Login Failed",
        "Your email or password is incorrect. Please try again.",
        [
          {
            text: "OK",
            onPress: () => console.log("OK Pressed"),
          },
        ]
      );
     }finally {
      setIsLoading(false);
    }
    
    if (email && password) {
      
      console.log('Email:', email);
      console.log('Password:', password);
      
      
    }
  };

  useEffect(() => {
    return () => {
      // Reset loading state when the component unmounts
      setIsLoading(false);
    };
  }, []);

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
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={!isPasswordVisible}
          />
          <FontAwesome
            name={isPasswordVisible ? 'eye' : 'eye-slash'}
            size={24}
            padding ={5}
            color="black"
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={{ paddingRight: 15 }}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.buttonText}>Let's Binge!</Text>
          )}
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
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    width: '95%',
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
