import React, { useContext } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Avatar, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AuthContext } from "../contexts/AuthContext";

export default function CustomDrawerContent(props) {
  const { navigation } = props;
  const auth = useContext(AuthContext);

  const handleLogout = () => {
    // prefer AuthContext.logout if exists
    if (auth?.logout) {
      auth.logout();
    } else if (props.logout) {
      props.logout();
    } else {
      Alert.alert("Logout", "Logout function not implemented");
    }
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.top}>
        <Avatar.Text size={68} label={(auth.user?.name || "U").split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase()} style={styles.avatar} />
        <Text style={styles.name}>{auth.user?.name || "Guest"}</Text>
        <Text style={styles.email}>{auth.user?.email || ""}</Text>
      </View>

      <View style={styles.list}>
        <DrawerItem
          label="Home"
          icon={({ color, size }) => <MaterialCommunityIcons name="home-outline" color={color} size={size} />}
          onPress={() => navigation.navigate("Home")}
        />

        <DrawerItem
          label="Products"
          icon={({ color, size }) => <MaterialCommunityIcons name="shopping-outline" color={color} size={size} />}
          onPress={() => navigation.navigate("Products")}
        />

        <DrawerItem
          label="Services"
          icon={({ color, size }) => <MaterialCommunityIcons name="hammer-wrench" color={color} size={size} />}
          onPress={() => navigation.navigate("Services")}
        />

        <DrawerItem
          label="Profile"
          icon={({ color, size }) => <MaterialCommunityIcons name="account-outline" color={color} size={size} />}
          onPress={() => navigation.navigate("Profile")}
        />

        <DrawerItem
          label="Logout"
          icon={({ color, size }) => <MaterialCommunityIcons name="logout" color={color} size={size} />}
          onPress={handleLogout}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  top: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  avatar: { backgroundColor: "#550000" },
  name: { marginTop: 10, fontWeight: "700", fontSize: 16 },
  email: { color: "#666", marginTop: 4, fontSize: 13 },
  list: { marginTop: 10 },
});
