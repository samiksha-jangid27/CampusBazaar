import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
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
import api from "../services/api";
import ListingCard from "../components/ListingCard"; // use the polished card you already have

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 46) / 2; // two columns with padding

const banners = [
  // simple local list of banners or urls
  "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&q=60&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503602642458-232111445657?w=1200&q=60&auto=format&fit=crop",
];

export default function HomeScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0,2).join("").toUpperCase()
    : "U";

  const [category, setCategory] = useState(route.params?.category || "Products");
  const [searchText, setSearchText] = useState("");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // banner auto-scroll
  const bannerIndex = useRef(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  useEffect(() => {
    fetchListings();
  }, [category]);

  useEffect(() => {
    const t = setInterval(() => {
      bannerIndex.current = (bannerIndex.current + 1) % banners.length;
      flatListRef.current?.scrollToOffset({ offset: bannerIndex.current * width, animated: true });
    }, 4500);
    return () => clearInterval(t);
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/listings?category=${category}`);
      setListings(res.data || []);
    } catch (err) {
      console.error("fetchListings error", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = listings.filter(l =>
    l.title?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleOpenDrawer = () => navigation.openDrawer();

  return (
    <SafeAreaView style={styles.safe}>
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleOpenDrawer} style={styles.menuBtn}>
          <Text style={styles.menuText}>≡</Text>
        </TouchableOpacity>

        <Text style={styles.appTitle}>CampusBazaar</Text>

        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Avatar.Text size={36} label={initials} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      {/* banner carousel */}
      <View style={styles.bannerWrap}>
        <Animated.FlatList
          ref={flatListRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          data={banners}
          keyExtractor={(_, i) => `b-${i}`}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.bannerImage} />
          )}
        />
      </View>

      {/* search */}
      <View style={styles.searchRow}>
        <TouchableOpacity style={styles.searchBox} onPress={() => { /* keep your search UI if needed */ }}>
          <Text style={styles.searchPlaceholder}>🔍 Search items around campus...</Text>
        </TouchableOpacity>
      </View>

      {/* categories chips */}
      <View style={styles.chipsRow}>
        {["Products","Services"].map(c => (
          <Chip
            key={c}
            mode="outlined"
            selected={category === c}
            onPress={() => setCategory(c)}
            style={[
              styles.chip,
              category === c && styles.chipActive
            ]}
            textStyle={[styles.chipText, category === c && styles.chipTextActive]}
          >
            {c}
          </Chip>
        ))}
      </View>

      {/* grid */}
      <View style={styles.gridWrap}>
        {loading ? (
          <View style={{paddingTop: 30}}><ActivityIndicator color="#8B0000" size="large" /></View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={item => String(item.id || item._id)}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.row}
            contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 12 }}
            renderItem={({ item }) => (
              <View style={{ width: CARD_WIDTH }}>
                <ListingCard
                  item={item}
                  onPress={() => navigation.navigate("Details", { id: item.id || item._id })}
                />
              </View>
            )}
            ListEmptyComponent={<View style={{padding:30,alignItems:'center'}}><Text>No items yet</Text></View>}
          />
        )}
      </View>

      {/* animated FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddListing")}
      >
        <Text style={styles.fabPlus}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

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
  menuBtn: { padding: 6 },
  menuText: { fontSize: 28, color: "#fff" },
  appTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  avatar: { backgroundColor: "#550000" },

  bannerWrap: {
    height: 140,
    marginTop: 8,
  },
  bannerImage: {
    width,
    height: 140,
    resizeMode: "cover",
  },

  searchRow: { paddingHorizontal: 14, marginTop: -28 },
  searchBox: {
    height: 44,
    borderRadius: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 14,
    elevation: 2,
  },
  searchPlaceholder: { color: "#777" },

  chipsRow: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: "flex-start",
  },
  chip: {
    marginRight: 10,
    borderRadius: 8,
    borderColor: "#8B0000",
    backgroundColor: "#fff",
  },
  chipActive: {
    backgroundColor: "#8B0000",
  },
  chipText: { color: "#8B0000", fontWeight: "600" },
  chipTextActive: { color: "#fff" },

  gridWrap: { flex: 1, marginTop: 6 },

  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },

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
  fabPlus: { color: "#fff", fontSize: 30, marginBottom: 2 },
});
