import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { Text, TextInput, Button, SegmentedButtons, useTheme } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import api from "../services/api";

export default function AddListingScreen({ navigation }) {
  const { colors } = useTheme();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Products");
  const [subcategory, setSubcategory] = useState("");
  const [images, setImages] = useState([]); // store max 4 images

  const [loading, setLoading] = useState(false);

  // --- PICK IMAGES ---
  const pickImage = async () => {
    if (images.length >= 4) {
      return Alert.alert("Limit reached", "You can upload up to 4 images.");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title || !description || !price || !subcategory) {
      return Alert.alert("Error", "Please fill all required fields");
    }

    const payload = {
      title,
      description,
      price: parseFloat(price),
      category,
      subcategory,
      images, // array of URIs
    };

    setLoading(true);
    try {
      await api.post("/listings", payload);
      Alert.alert("Success", "Your listing has been created!");
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create a New Listing</Text>

      {/* IMAGE UPLOAD SECTION */}
      <Text style={styles.sectionLabel}>Upload Images (max 4)</Text>

      <View style={styles.imageRow}>
        {images.map((uri, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => removeImage(index)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>X</Text>
            </TouchableOpacity>
          </View>
        ))}

        {images.length < 4 && (
          <TouchableOpacity style={styles.addImageBox} onPress={pickImage}>
            <Text style={styles.addImageText}>+</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* INPUTS */}
      <TextInput
        label="Title"
        mode="outlined"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        label="Description"
        mode="outlined"
        multiline
        numberOfLines={3}
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <TextInput
        label="Price (₹)"
        mode="outlined"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
      />

      <Text style={styles.sectionLabel}>Category</Text>
      <SegmentedButtons
        value={category}
        onValueChange={setCategory}
        buttons={[
          { label: "Products", value: "Products" },
          { label: "Services", value: "Services" },
        ]}
        style={styles.segment}
      />

      <TextInput
        label="Subcategory (Books, Tutoring...)"
        mode="outlined"
        value={subcategory}
        onChangeText={setSubcategory}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        style={styles.submitBtn}
      >
        Create Listing
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#8B0000",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#444",
  },

  // IMAGE UPLOAD
  imageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  addImageBox: {
    width: 90,
    height: 90,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  addImageText: {
    fontSize: 32,
    color: "#8B0000",
    fontWeight: "700",
  },
  imageWrapper: {
    width: 90,
    height: 90,
    marginRight: 10,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  removeBtn: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 12,
    paddingHorizontal: 5,
  },

  // INPUTS
  input: {
    marginBottom: 15,
    backgroundColor: "#fff",
  },

  segment: {
    marginBottom: 20,
  },

  submitBtn: {
    backgroundColor: "#8B0000",
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 10,
  },
});
