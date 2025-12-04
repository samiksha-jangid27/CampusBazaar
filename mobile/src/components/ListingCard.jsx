import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Alert,
  Linking,
} from "react-native";
import { Card, Button, IconButton, Text } from "react-native-paper";

export default function ListingCard({ item, onPress, onFavorite, isFav }) {
  
  const handleWhatsApp = () => {
    if (!item?.seller?.phoneNumber) {
      return Alert.alert("Error", "Seller phone number not available.");
    }

    const message =
      item.category === "Services"
        ? "Hello! I wanted to enquire about this service."
        : "Hello! Is this product still available?";

    const url = `whatsapp://send?phone=${item.seller.phoneNumber}&text=${encodeURIComponent(
      message
    )}`;

    Linking.openURL(url).catch(() =>
      Alert.alert("Error", "Unable to open WhatsApp.")
    );
  };

  return (
    <Card style={styles.card} mode="elevated" onPress={onPress}>
      <Image
        source={{ uri: item.images?.[0] || item.image }}
        style={styles.image}
      />

      <Card.Content style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.price}>₹{item.price}</Text>
      </Card.Content>

      <View style={styles.actions}>
        {/* Contact Button */}
        <Button
          mode="contained"
          buttonColor="#25D366"
          textColor="#FFF"
          style={styles.contactBtn}
          onPress={handleWhatsApp}
          icon="whatsapp"
        >
          Contact
        </Button>

        {/* View Button */}
        <Button
          mode="text"
          onPress={onPress}
          textColor="#8B0000"
          style={styles.viewBtn}
        >
          View
        </Button>

        {/* Favorite Icon */}
        <IconButton
          icon={isFav ? "heart" : "heart-outline"}
          iconColor="#8B0000"
          size={24}
          onPress={onFavorite}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    marginBottom: 16,
    backgroundColor: "#FFF",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 220,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  content: {
    paddingVertical: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#8B0000",
    marginTop: 6,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10,
    justifyContent: "space-between",
  },
  contactBtn: {
    flex: 1,
    marginRight: 8,
    borderRadius: 8,
  },
  viewBtn: {
    flex: 1,
    borderRadius: 8,
  },
});
