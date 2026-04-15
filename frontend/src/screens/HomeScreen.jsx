import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Avatar, Chip } from "react-native-paper";

import { AuthContext } from "../contexts/AuthContext";
import { AppContext } from "../contexts/AppProvider";   
import api from "../services/api";
import ListingCard from "../components/ListingCard";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 46) / 2;

const banners = [
  "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&q=60",
  "https://images.unsplash.com/photo-1503602642458-232111445657?w=1200&q=60",
];

export default function HomeScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);
  const { state, dispatch } = useContext(AppContext);   

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  const [category, setCategory] = useState(route?.params?.category || "Products");
  const [searchText, setSearchText] = useState("");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const bannerIndex = useRef(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  /* FETCH LISTINGS */
  useEffect(() => {
    fetchListings();
  }, [category]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/listings?category=${category}`);
      setListings(res.data || []);
    } catch (err) {
      console.error("fetchListings error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setInterval(() => {
      bannerIndex.current = (bannerIndex.current + 1) % banners.length;
      flatListRef.current?.scrollToOffset({
        offset: bannerIndex.current * width,
        animated: true,
      });
    }, 4500);

    return () => clearInterval(t);
  }, []);

  const filtered = listings.filter((l) =>
    l.title?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Text style={styles.menuText}>≡</Text>
        </TouchableOpacity>

        <Text style={styles.appTitle}>CampusBazaar</Text>

        <TouchableOpacity onPress={() => navigation.navigate("ProfileTab")}>
          <Avatar.Text size={36} label={initials} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      {/* BANNER */}
      <View style={styles.bannerWrap}>
        <Animated.FlatList
          ref={flatListRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          data={banners}
          keyExtractor={(_, i) => `banner-${i}`}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.bannerImage} />
          )}
        />
      </View>

      {/* SEARCH INPUT */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search items around campus..."
          placeholderTextColor="#777"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
      </View>

      {/* CATEGORIES */}
      <View style={styles.chipsRow}>
        {["Products", "Services"].map((c) => (
          <Chip
            key={c}
            mode="outlined"
            selected={category === c}
            onPress={() => setCategory(c)}
            style={[styles.chip, category === c && styles.chipActive]}
            textStyle={[
              styles.chipText,
              category === c && styles.chipTextActive,
            ]}
          >
            {c}
          </Chip>
        ))}
      </View>

      {/* LISTINGS GRID */}
      <View style={styles.gridWrap}>
        {loading ? (
          <View style={{ paddingTop: 30 }}>
            <ActivityIndicator size="large" color="#8B0000" />
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.row}
            contentContainerStyle={{
              paddingBottom: 120,
              paddingHorizontal: 12,
            }}
            renderItem={({ item }) => (
              <View style={{ width: CARD_WIDTH }}>
                                <ListingCard
                  item={item}
                  onPress={() => navigation.navigate("Details", { id: item.id })}
                  isFav={state.favorites.some(f => f.id === item.id)}
                  onFavorite={() =>
                    dispatch({
                      type: "TOGGLE_FAVORITE",
                      payload: item, // FULL OBJECT
                    })
                  }
                />

              </View>
            )}
            ListEmptyComponent={
              <View style={{ padding: 30, alignItems: "center" }}>
                <Text>No items found</Text>
              </View>
            }
          />
        )}
      </View>

      {/* ADD LISTING BUTTON */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddListing")}
      >
        <Text style={styles.fabPlus}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8f8f8" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#8B0000",
    justifyContent: "space-between",
  },

  menuText: { fontSize: 28, color: "#fff" },
  appTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  avatar: { backgroundColor: "#550000" },

  bannerWrap: { height: 140, marginTop: 8 },
  bannerImage: { width, height: 140, resizeMode: "cover" },

  searchRow: { paddingHorizontal: 14, marginTop: -26 },
  searchInput: {
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  chipsRow: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chip: {
    marginRight: 10,
    borderRadius: 8,
    borderColor: "#8B0000",
  },
  chipActive: { backgroundColor: "#8B0000" },
  chipText: { color: "#8B0000", fontWeight: "600" },
  chipTextActive: { color: "#fff" },

  gridWrap: { flex: 1, marginTop: 6 },
  row: { justifyContent: "space-between", marginBottom: 12 },

  fab: {
    position: "absolute",
    right: 18,
    bottom: 78,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#8B0000",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  fabPlus: { color: "#fff", fontSize: 30 },
});
