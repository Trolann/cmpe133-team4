import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { getSettings, updateSettings } from '../services/api';

<Slider
  style={{width: 200, height: 40}}
  minimumValue={0}
  maximumValue={1}
  minimumTrackTintColor="#FFFFFF"
  maximumTrackTintColor="#000000"
/>
const SettingsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState(true);
  const [location, setLocationPreference] = useState(false);

  const [distance, setDistance] = useState(50); // Initial distance value

  const toggleNotifications = () => {
    setNotifications(!notifications);
  };

  const toggleLocation = () => {
    setLocationPreference(!location);
    
    if (!location) {
      // If location is toggled to true, navigate to the ChooseLocation screen
      navigation.navigate('ChooseLocation', { distance: distance });
    }
  };

  const saveSettings = async () => {
    try {
      // Assuming you have user_id and access_token, modify as needed
      const user_id = global.user_id; // Replace with actual user_id
      const access_token = global.access_token; // Replace with actual access_token

      // Construct the settings object based on your requirements
      const newSettings = {
        notifications,
        location,
        distance,
        // Add other settings as needed
      };

      // Use the updateSettings function from api.js to update the settings
      await updateSettings(user_id, access_token, newSettings);

      // Navigate to the desired screen after successful update
      navigation.navigate('Swiping');

    } catch (error) {
      console.error('Failed to save settings', error);
      // Handle error, show alert or log as needed
      Alert.alert(
        "Settings Update Failed",
        "Unable to save settings. Please try again.",
        [
          {
            text: "OK",
            onPress: () => console.log("OK Pressed"),
          },
        ]
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Account</Text>

        <TouchableOpacity
          style={styles.setting}
          onPress={() => navigation.navigate('ChangeProfilePicture')}
        >
          <Text style={styles.settingText}>Change Profile Picture</Text>
          {/* You can add a profile picture icon here */}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.setting}
          onPress={() => navigation.navigate('ChangeName')}
        >
          <Text style={styles.settingText}>Change Name</Text>
          {/* You can add a name icon here */}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.setting}
          onPress={() => navigation.navigate('ChangePassword')}
        >
          <Text style={styles.settingText}>Change Password</Text>
          {/* You can add a password icon here */}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Preferences</Text>

        <TouchableOpacity
          style={styles.setting}
          onPress={toggleNotifications}
        >
          <Text style={styles.settingText}>Receive Notifications</Text>
          <Switch value={notifications} onValueChange={toggleNotifications} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.setting}
          onPress={toggleLocation}
        >
          <Text style={styles.settingText}>Enable Location</Text>
          <Switch value={location} onValueChange={toggleLocation} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveSettings}
      >
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF0000',
  },
  section: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#EAEAEA',
    paddingBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  settingText: {
    fontSize: 18,
  },
  saveButton: {
    backgroundColor: '#FF0000',
    padding: 5,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default SettingsScreen;
