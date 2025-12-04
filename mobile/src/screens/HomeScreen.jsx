import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Avatar, Text, TextInput } from "react-native-paper";
import { AuthContext } from "../contexts/AuthContext";
import ListingCard from "../components/ListingCard";
import api from "../services/api";

export default function HomeScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);
  const categoryFromDrawer = route.params?.category || null;
  const initials = user?.name ? user.name.split(" ").map((n) => n[0]).join("") : "U";

  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState(categoryFromDrawer || "Products");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, [categoryFromDrawer]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/listings?category=${category}`);
      setListings(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Text style={styles.menu}>≡</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Campus Bazaar</Text>

        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Avatar.Text size={40} label={initials} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <TextInput
          mode="outlined"
          placeholder="Search items…"
          value={searchText}
          onChangeText={setSearchText}
          left={<TextInput.Icon icon="magnify" color="#8B0000" />}
          style={styles.searchInput}
        />
      </View>

      {/* LISTINGS GRID */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#8B0000" />
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <ListingCard
              item={item}
              onPress={() => navigation.navigate("Details", { id: item._id })}
            />
          )}
        />
      )}

      {/* ADD LISTING BUTTON */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddListing")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFF" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#8B0000",
  },

  menu: {
    fontSize: 30,
    color: "#FFF",
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFF",
  },

  avatar: {
    backgroundColor: "#550000",
  },

  searchBox: { padding: 10 },
  searchInput: { backgroundColor: "#FFF" },

  gridRow: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },

  fab: {
    position: "absolute",
    bottom: 70,
    right: 20,
    backgroundColor: "#8B0000",
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  fabText: {
    fontSize: 30,
    color: "#FFF",
  },
});
