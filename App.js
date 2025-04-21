import React, { useEffect, useState } from 'react';
import SetWallpaper from 'react-native-set-wallpaper';
import { Alert, Button, Platform } from 'react-native';

import {
  View,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import { PIXABAY_API_KEY } from '@env';

const { width, height } = Dimensions.get('window');

const API_URL = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&orientation=vertical&image_type=photo`;

const App = () => {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchWallpapers = async () => {
    try {
      const response = await axios.get(API_URL);
      setWallpapers(response.data.hits);
    } catch (error) {
      console.error('Failed to fetch wallpapers:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallpapers();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedImage(item.largeImageURL);
        setIsModalVisible(true);
      }}
    >
      <Image source={{ uri: item.webformatURL }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <FlatList
            data={wallpapers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            numColumns={2}
            contentContainerStyle={styles.list}
          />
          <Modal visible={isModalVisible} transparent={true} animationType="fade">
            <View style={styles.modalContainer}>
              <Pressable style={styles.closeArea} onPress={() => setIsModalVisible(false)} />
              <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
              {Platform.OS === 'android' && (
  <View style={{ marginTop: 20 }}>
    <Button
      title="Set as Wallpaper"
      onPress={() => {
        SetWallpaper.setWallpaper(
          { uri: selectedImage },
          (res) => {
            Alert.alert('Success', 'Wallpaper set successfully!');
          },
          (err) => {
            console.error(err);
            Alert.alert('Error', 'Failed to set wallpaper.');
          }
        );
      }}
    />
  </View>
)}

            </View>
          </Modal>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 40 },
  list: { paddingHorizontal: 10 },
  image: {
    width: (width / 2) - 20,
    height: 300,
    margin: 5,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  fullImage: {
    width: width * 0.95,
    height: height * 0.8,
    borderRadius: 10,
  },
});

export default App;
