import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Modal, Text, FlatList } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const TopBar = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const sessions = [
    { id: 'solo', name: 'Solo Session' },
    { id: 'group', name: 'Group Session' },
    // Add more sessions as needed
  ];

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const handleSessionSelect = (session) => {
    setSelectedSession(session);
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <FontAwesome5 name="users" size={23} color="black" />
      </TouchableOpacity>

      <Image
        source={require('C:/Users/minston/expoprojects/FirebaseAuth/UpdatedBingeLogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <TouchableOpacity onPress={handleSettingsPress}>
        <MaterialIcons name="settings" size={23} color="black" />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <FlatList
            data={sessions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.sessionItem}
                onPress={() => handleSessionSelect(item)}
              >
                <Text style={styles.sessionText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
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
  modalContainer: {
    position: 'absolute',
    top: 120, // Adjust the top value as needed
    left: 60, // Adjust the left value as needed
    backgroundColor: 'white',
    maxHeight: 200, // Adjust the max height as needed
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sessionItem: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  sessionText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  textShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.80)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});

export default TopBar;
