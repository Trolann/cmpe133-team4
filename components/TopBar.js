import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Montserrat_400Regular, FontAwesome5_Regular } from '@expo-google-fonts/montserrat';

const TopBar = () => {
  const navigation = useNavigation();

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const handleUserIconPress = () => {
    // Navigate to the "Sessions" screen when the user icon is pressed
    navigation.navigate('Sessions');
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleUserIconPress}>
        <FontAwesome5 name="users" size={23} color="black" />
      </TouchableOpacity>

      <Image
        source={require('../UpdatedBingeLogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <TouchableOpacity onPress={handleSettingsPress}>
        <MaterialIcons name="settings" size={23} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5.46,
    elevation: 0,
  },
  logo: {
    width: 220,
    height: 52,
  },
});

export default TopBar;
