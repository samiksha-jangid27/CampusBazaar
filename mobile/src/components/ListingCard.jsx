// src/components/ListingCard.js
import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { Text, IconButton } from "react-native-paper";

// ----------------------------
// UTIL: OPEN WHATSAPP
// ----------------------------
async function openWhatsApp(number, message = "") {
  if (!number) return Alert.alert("Error", "Seller phone number missing.");
  const digits = number.replace(/\D/g, "");
  if (!digits || digits.length < 6) return Alert.alert("Error", "Invalid phone number.");

  let sanitized = digits;
  if (digits.length <= 10) sanitized = "91" + digits;

  const url = `https://wa.me/${sanitized}?text=${encodeURIComponent(message)}`;

  try {
    const can = await Linking.canOpenURL(url);
    if (can) Linking.openURL(url);
    else Alert.alert("Error", "Unable to open WhatsApp.");
  } catch (err) {
    Alert.alert("Error", "Unable to open WhatsApp.");
  }
}

export default function ListingCard({ item, onPress, onFavorite, isFav }) {
  const sellerPhone = item?.seller?.phoneNumber || null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* IMAGE */}
      <View style={styles.imageWrap}>
        {item.images?.length ? (
          <Image source={{ uri: item.images[0] }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.noImg]}>
            <Text>No image</Text>
          </View>
        )}

        {/* PRICE */}
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>₹{item.price}</Text>
        </View>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.desc} numberOfLines={2}>
          {item.description}
        </Text>

        {/* ACTIONS ROW */}
        <View style={styles.row}>
          {/* WHATSAPP */}
          <IconButton
            icon="whatsapp"
            size={22}
            onPress={() =>
              openWhatsApp(
                sellerPhone,
                `Hi! I'm interested in your listing "${item.title}".`
              )
            }
            iconColor="#fff"
            containerColor="#25D366"
            style={styles.actionBtn}
          />

          {/* HEART */}
          <IconButton
            icon={isFav ? "heart" : "heart-outline"}
            size={18}
            onPress={() => onFavorite(item)}
            style={styles.iconBtn}
            iconColor="#8B0000"
          />

        </View>
      </View>
    </TouchableOpacity>
  );
}

// ----------------------------
// STYLES
// ----------------------------
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    elevation: 3,
    marginBottom: 16,
    width: "100%",
  },

  imageWrap: {
    width: "100%",
    height: 150,
    backgroundColor: "#f2f2f2",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  noImg: {
    justifyContent: "center",
    alignItems: "center",
  },

  priceBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#8B0000",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  priceText: {
    color: "#fff",
    fontWeight: "700",
  },

  content: {
    padding: 12,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
  },

  desc: {
    color: "#666",
    fontSize: 13,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 6,
  },

  heartBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
});
