// src/screens/ProfileScreen.js

import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

import { AuthContext } from "../contexts/AuthContext";
import { AppContext } from "../contexts/AppProvider";

export default function ProfileScreen({ navigation }) {
  const { user, updateProfile, logout } = useContext(AuthContext);
  const { state } = useContext(AppContext);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [image, setImage] = useState(user?.profilePicture || null);

  // Pick image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert("Enter your name");

    const payload = { name, phoneNumber: phone, profilePicture: image };

    const success = await updateProfile(payload);
    if (success) {
      Alert.alert("Updated", "Profile updated successfully");
      setEditing(false);
    } else {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "U";

  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <Text style={styles.headerTitle}>My Profile</Text>

      {/* PROFILE SECTION */}
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={editing ? pickImage : null}>
          {image ? (
            <Image source={{ uri: image }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
          )}
        </TouchableOpacity>

        {editing ? (
          <>
            <TextInput
              mode="outlined"
              label="Full Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label="Phone Number"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
            />
          </>
        ) : (
          <>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            {user?.phoneNumber ? (
              <Text style={styles.phone}>+91 {user?.phoneNumber}</Text>
            ) : null}
          </>
        )}
      </View>

      {/* MENU */}
      <View style={styles.menuSection}>
        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => navigation.navigate("MyListings")}
        >
          <Text style={styles.menuText}>My Listings</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => navigation.navigate("Favorites")}
        >
          <Text style={styles.menuText}>My Wishlist</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* BUTTONS */}
      {editing ? (
        <Button mode="contained" textColor="#fff" buttonColor="#8B0000" style={styles.btn} onPress={handleSave}>
          Save Changes
        </Button>
      ) : (
        <Button mode="contained" textColor="#fff" buttonColor="#8B0000" style={styles.btn} onPress={() => setEditing(true)}>
          Edit Profile
        </Button>
      )}

      <Button
        mode="outlined"
        textColor="#8B0000"
        style={styles.logoutBtn}
        onPress={logout}
      >
        Log Out
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 20,
    color: "#8B0000",
    textAlign: "center",
  },

  profileSection: {
    alignItems: "center",
    marginBottom: 25,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 10,
  },

  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  avatarInitials: {
    fontSize: 36,
    fontWeight: "700",
    color: "#8B0000",
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
  },

  email: {
    fontSize: 15,
    color: "#666",
    marginTop: 4,
  },

  phone: {
    fontSize: 15,
    color: "#444",
    marginTop: 2,
  },

  input: {
    width: "90%",
    marginVertical: 8,
  },

  menuSection: {
    backgroundColor: "#fafafa",
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 20,
    elevation: 2,
  },

  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },

  menuText: {
    fontSize: 17,
    color: "#333",
    fontWeight: "500",
  },

  arrow: {
    fontSize: 22,
    color: "#999",
  },

  btn: {
    borderRadius: 10,
    marginBottom: 10,
  },

  logoutBtn: {
    borderRadius: 10,
    borderColor: "#8B0000",
  },
});
