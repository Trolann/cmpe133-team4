import { StyleSheet, Text, View, Image, Button } from 'react-native'
import React from 'react'

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('C:/Users/minston/expoprojects/FirebaseAuth/BingeLogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Login"
          onPress={() => navigation.navigate('Login')}
          style={styles.button}
        />
        <Button
          title="Create Account"
          onPress={() => navigation.navigate('CreateAccount')}
          style={styles.button}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
  buttonContainer: {
    width: '80%', // Adjust the width as needed
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    width: '100%', // Make buttons take up the entire width
  },
})

export default HomeScreen
