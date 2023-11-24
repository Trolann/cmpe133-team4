import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Font } from 'expo-font';
import { useFonts } from 'expo-font';
import { Montserrat } from '@expo-google-fonts/montserrat'; // Import Montserrat font
const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('C:/Users/minston/expoprojects/FirebaseAuth/UpdatedBingeLogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Swipe. Share. Savor.</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CreateAccount')}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  latoText: {
    fontFamily: 'Lato', // Use the font family name that matches your file name
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 85,
    marginBottom: 20,
  },
  title: {
    fontFamily: Montserrat,
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#FF0000',
  },
  buttonContainer: {
    width: '80%',
    flexDirection: 'row', // Make buttons horizontal
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    width: '45%', // Adjust button width as needed
    height: 60, // Increase button height
    backgroundColor: '#FF0000',
    borderRadius: 30, // Make buttons oval
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;