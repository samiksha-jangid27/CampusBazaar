import React, { useContext, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Avatar, Button, Card, Text, TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { AppContext } from "../contexts/AppProvider";

export default function ProfileScreen() {
  const { state } = useContext(AppContext);

  const [editing, setEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(state.user?.profilePicture || null);
  const [name, setName] = useState(state.user?.name || "");
  const [phone, setPhone] = useState(state.user?.phoneNumber || "");

  const initials = useMemo(() => {
    if (profileImage) return ""; // hide initials when image exists

    const name = state.user?.name || "User";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [state.user, profileImage]);

  // PICK IMAGE
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    // This will be connected to backend later
    console.log("Saving profile:");
    console.log({ name, phone, profileImage });

    setEditing(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profilePhoto} />
          ) : (
            <Avatar.Text label={initials} size={80} color="#FFFFFF" style={styles.avatar} />
          )}
        </TouchableOpacity>

        {editing ? (
          <>
            <TextInput
              mode="outlined"
              value={name}
              onChangeText={setName}
              style={styles.editInput}
              label="Name"
            />

            <TextInput
              mode="outlined"
              value={phone}
              onChangeText={setPhone}
              style={styles.editInput}
              label="Phone Number"
              keyboardType="numeric"
            />
          </>
        ) : (
          <>
            <Text style={styles.name}>{state.user?.name}</Text>
            <Text style={styles.email}>{state.user?.email}</Text>
            {state.user?.phoneNumber ? (
              <Text style={styles.phone}>{state.user.phoneNumber}</Text>
            ) : null}
          </>
        )}
      </View>

      <View style={styles.content}>
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text style={styles.sectionTitle}>Account</Text>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Listings</Text>
              <Text style={styles.rowValue}>0</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Favorites</Text>
              <Text style={styles.rowValue}>—</Text>
            </View>
          </Card.Content>
        </Card>

        {editing ? (
          <Button
            mode="contained"
            buttonColor="#8B0000"
            textColor="#FFFFFF"
            style={styles.btn}
            onPress={handleSave}
          >
            Save Changes
          </Button>
        ) : (
          <Button
            mode="contained"
            buttonColor="#8B0000"
            textColor="#FFFFFF"
            style={styles.btn}
            onPress={() => setEditing(true)}
          >
            Edit Profile
          </Button>
        )}

        {!editing && (
          <Button
            mode="outlined"
            textColor="#8B0000"
            style={styles.btnOutline}
            onPress={() => console.log("Logout pressed")}
          >
            Log out
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 16,
  },

  avatar: {
    backgroundColor: "#8B0000",
  },

  profilePhoto: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#eee",
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginTop: 10,
  },

  email: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },

  phone: {
    fontSize: 14,
    color: "#444",
    marginTop: 4,
  },

  editInput: {
    width: "80%",
    marginTop: 10,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  card: {
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    backgroundColor: "#FFFFFF",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#8B0000",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  rowLabel: { fontSize: 15, color: "#333" },
  rowValue: { fontSize: 15, color: "#8B0000", fontWeight: "600" },

  btn: {
    borderRadius: 10,
    marginBottom: 10,
  },

  btnOutline: {
    borderRadius: 10,
    borderColor: "#8B0000",
  },
});
