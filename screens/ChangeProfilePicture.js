import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ChangeProfilePicture = ({ navigation }) => {
  const [profilePicture, setProfilePicture] = useState(null);

  const handleUpload = async () => {
    // Implement logic to upload the image to your backend
    // You can use libraries like axios for making HTTP requests

    // Placeholder logic for demonstration
    console.log('Uploading image:', profilePicture);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Change Profile Picture</Text>

      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.profileImage} />
        ) : (
          <Text style={styles.uploadText}>Upload Profile Picture</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
        <Text style={styles.buttonText}>Upload</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF0000',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1, // Maintain a square aspect ratio
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  uploadText: {
    fontSize: 18,
    color: '#555555',
  },
  uploadButton: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default ChangeProfilePicture;
