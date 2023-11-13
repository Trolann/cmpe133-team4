import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function BottomBar({ handleLikePress, handlePassPress }) {
  return (
    <View style={styles.container}>
      <View />
      <TouchableOpacity style={styles.passButton} onPress={handlePassPress}>
        <FontAwesome name="times" size={27} color="#FF69B4"></FontAwesome>
      </TouchableOpacity>
      <TouchableOpacity style={styles.heartButton} onPress={handleLikePress}>
        <FontAwesome name="heart" size={27} color="white"></FontAwesome>
      </TouchableOpacity>
      <View />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 75,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  passButton: {
    width: 50,
    height: 50,
    backgroundColor: 'white', // Passionate red color for the "X" button
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6.46,
    elevation: 9,
  },
  heartButton: {
    width: 50,
    height: 50,
    backgroundColor: '#FF3E3E', // Passionate red color for the heart button background
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6.46,
    elevation: 9,
  },
});
