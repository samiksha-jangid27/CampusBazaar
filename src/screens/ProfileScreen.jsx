import React, { useContext, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { AppContext } from "../contexts/AppProvider";

export default function ProfileScreen() {
  const { state } = useContext(AppContext);

  const initials = useMemo(() => {
    const name = state.user?.name || "User";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [state.user]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Avatar.Text label={initials} size={68} color="#FFFFFF" style={styles.avatar} />
        <Text style={styles.name}>{state.user?.name}</Text>
        <Text style={styles.email}>{state.user?.email}</Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Orders</Text>
              <Text style={styles.rowValue}>0</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Favorites</Text>
              <Text style={styles.rowValue}>—</Text>
            </View>
          </Card.Content>
        </Card>

        <Button mode="contained" buttonColor="#8B0000" textColor="#FFFFFF" style={styles.btn}>
          Edit Profile
        </Button>
        <Button mode="outlined" textColor="#8B0000" style={styles.btnOutline}>
          Log out
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  avatar: { backgroundColor: "#8B0000" },
  name: { fontSize: 20, fontWeight: "700", color: "#222", marginTop: 10 },
  email: { fontSize: 14, color: "#666", marginTop: 4 },
  content: { paddingHorizontal: 16, paddingTop: 16 },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    backgroundColor: "#FFFFFF",
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#8B0000", marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  rowLabel: { fontSize: 15, color: "#333" },
  rowValue: { fontSize: 15, color: "#8B0000", fontWeight: "600" },
  btn: { borderRadius: 10 },
  btnOutline: { borderRadius: 10, borderColor: "#8B0000" },
});
