import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Text, TextInput, Button, SegmentedButtons, useTheme } from "react-native-paper";
import api from "../services/api";

const AddListingScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Products");
  const [subcategory, setSubcategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !description || !price || !subcategory) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title,
        description,
        price: parseFloat(price),
        category,
        subcategory,
        images: imageUrl ? [imageUrl] : [],
      };

      await api.post("/listings", payload);
      Alert.alert("Success", "Listing created successfully!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Add New Listing</Text>

        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <TextInput
          label="Price (₹)"
          value={price}
          onChangeText={setPrice}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Category</Text>
        <SegmentedButtons
          value={category}
          onValueChange={setCategory}
          buttons={[
            { value: "Products", label: "Products" },
            { value: "Services", label: "Services" },
          ]}
          style={styles.segment}
        />

        <TextInput
          label="Subcategory (e.g., Books, Tutoring)"
          value={subcategory}
          onChangeText={setSubcategory}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Image URL (Optional)"
          value={imageUrl}
          onChangeText={setImageUrl}
          mode="outlined"
          style={styles.input}
          placeholder="https://example.com/image.jpg"
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          style={styles.button}
          contentStyle={{ paddingVertical: 8 }}
        >
          Create Listing
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#8B0000",
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  segment: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#8B0000",
  },
});

export default AddListingScreen;
