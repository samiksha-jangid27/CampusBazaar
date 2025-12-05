import React, { useEffect, useState } from "react";
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
import api from "../services/api";

export default function ProductDetailsScreen({ route, navigation }) {
  const { id } = route.params;
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
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

    const number = seller.phoneNumber.replace(/\D/g, "");
    const url = `https://wa.me/91${number}?text=Hi ${seller.name}, I'm interested in your listing "${item.title}"`;

    Linking.openURL(url).catch(() =>
      Alert.alert("Error", "Unable to open WhatsApp.")
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IconButton icon="arrow-left" size={26} iconColor="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={{ uri: item.images?.[0] }}
          style={styles.mainImage}
        />

        <View style={styles.infoBox}>
          <Text style={styles.title}>{item.title}</Text>

          <Text style={styles.price}>₹{item.price}</Text>
          <Text style={styles.category}>
            {item.category} · {item.subcategory}
          </Text>

          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.description}>{item.description}</Text>

          {/* SELLER INFO */}
          <Text style={styles.sectionLabel}>Seller Info</Text>

          <View style={styles.sellerRow}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerInitials}>{initials}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.sellerName}>{seller.name}</Text>
              <Text style={styles.sellerEmail}>{seller.email}</Text>
              {seller.phoneNumber ? (
                <Text style={styles.sellerPhone}>+91 {seller.phoneNumber}</Text>
              ) : null}
            </View>

            {/* Chat Button */}
            <TouchableOpacity style={styles.chatBtn} onPress={handleWhatsApp}>
              <Text style={styles.chatText}>💬 Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER BAR */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.heartBtn}>
          <IconButton icon="heart-outline" size={28} iconColor="#8B0000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactBtn} onPress={handleWhatsApp}>
          <Text style={styles.contactBtnText}>💬 Contact Seller</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ------------------------- STYLES ------------------------- */

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: "#8B0000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  container: {
    paddingBottom: 120,
  },

  mainImage: {
    width: "100%",
    height: 260,
    backgroundColor: "#eee",
  },

  infoBox: {
    padding: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },
  price: {
    fontSize: 22,
    fontWeight: "700",
    color: "#8B0000",
    marginTop: 4,
  },
  category: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },

  sectionLabel: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "700",
    color: "#8B0000",
  },
  description: {
    marginTop: 4,
    fontSize: 14,
    color: "#444",
  },

  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#8B0000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sellerInitials: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: "600",
  },
  sellerEmail: {
    fontSize: 13,
    color: "#666",
  },
  sellerPhone: {
    fontSize: 13,
    color: "#444",
  },

  chatBtn: {
    borderWidth: 1,
    borderColor: "#25D366",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  chatText: {
    color: "#25D366",
    fontWeight: "600",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
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
});
