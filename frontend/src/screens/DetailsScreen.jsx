import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { Text, IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../services/api";
import { AppContext } from "../contexts/AppProvider";

export default function ProductDetailsScreen({ route, navigation }) {
  const { id } = route.params;

  const { state, dispatch } = useContext(AppContext);
  const isFav = state.favorites.includes(id);

  const [item, setItem] = useState(null);

  useEffect(() => {
    fetchItem();
  }, []);

  const fetchItem = async () => {
    try {
      const res = await api.get(`/listings/${id}`);
      setItem(res.data);
    } catch (err) {
      console.log("Details error", err);
    }
  };

  if (!item) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const seller = item.seller;
  const initials = seller.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleWhatsApp = () => {
    if (!seller.phoneNumber) {
      return Alert.alert("No Phone", "Seller has not added a phone number.");
    }

    const num = seller.phoneNumber.replace(/\D/g, "");
    const url = `https://wa.me/91${num}?text=Hi ${seller.name}, I'm interested in your listing "${item.title}"`;

    Linking.openURL(url).catch(() =>
      Alert.alert("Error", "Unable to open WhatsApp.")
    );
  };

  const toggleFav = () => {
    dispatch({ type: "toggleFavorite", payload: id });
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IconButton icon="arrow-left" size={26} iconColor="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Product Details</Text>

        <View style={{ width: 40 }} />
      </View>

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: item.images?.[0] }} style={styles.mainImage} />

        <View style={styles.contentBox}>
          <Text style={styles.title}>{item.title}</Text>

          <Text style={styles.price}>₹{item.price}</Text>
          <Text style={styles.category}>
            {item.category} · {item.subcategory}
          </Text>

          {/* DESCRIPTION */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{item.description}</Text>

          {/* SELLER INFO */}
          <Text style={styles.sectionTitle}>Seller Info</Text>

          <View style={styles.sellerRow}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerInitials}>{initials}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.sellerName}>{seller.name}</Text>

              {/* REMOVE EMAIL → it is long and breaks UI */}

              {seller.phoneNumber && (
                <Text style={styles.sellerPhone}>+91 {seller.phoneNumber}</Text>
              )}
            </View>

            <TouchableOpacity style={styles.chatBtn} onPress={handleWhatsApp}>
              <Text style={styles.chatText}>💬 Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.heartBtn} onPress={toggleFav}>
          <IconButton
            icon={isFav ? "heart" : "heart-outline"}
            size={28}
            iconColor="#8B0000"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactBtn} onPress={handleWhatsApp}>
          <Text style={styles.contactBtnText}>💬 Contact Seller</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  header: {
    height: 60,
    backgroundColor: "#8B0000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    justifyContent: "space-between",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  scrollContent: {
    paddingBottom: 160,
  },

  mainImage: {
    width: "100%",
    height: 250,
    backgroundColor: "#eee",
  },

  contentBox: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  title: { fontSize: 20, fontWeight: "700" },

  price: {
    fontSize: 22,
    fontWeight: "700",
    color: "#8B0000",
    marginTop: 4,
  },

  category: { marginTop: 4, fontSize: 14, color: "#666" },

  sectionTitle: {
    marginTop: 18,
    fontSize: 16,
    fontWeight: "700",
    color: "#8B0000",
  },

  description: { marginTop: 4, fontSize: 14, color: "#444" },

  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#8B0000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  sellerInitials: { color: "#fff", fontWeight: "700" },

  sellerName: { fontSize: 16, fontWeight: "600" },

  sellerPhone: { fontSize: 13, color: "#444" },

  chatBtn: {
    borderWidth: 1,
    borderColor: "#25D366",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },

  chatText: { color: "#25D366", fontWeight: "600" },

  footer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  heartBtn: {
    width: 55,
    height: 55,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: "#8B0000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  contactBtn: {
    flex: 1,
    backgroundColor: "#25D366",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  contactBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
