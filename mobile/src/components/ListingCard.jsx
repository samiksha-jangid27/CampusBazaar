import React from "react";
import { Card, Button, IconButton, Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";

export default function ListingCard({ item, onPress, onFavorite, isFav, onCart }) {
  return (
    <Card style={styles.card} mode="elevated" onPress={onPress}>
      <Card.Cover source={{ uri: item.images?.[0] || item.image || "https://via.placeholder.com/300" }} style={styles.image} />
      <Card.Content style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description || item.desc || "No description available."}
        </Text>
        <Text style={styles.price}>₹{item.price?.toFixed(2)}</Text>
      </Card.Content>

      <View style={styles.actions}>
        <IconButton
          icon={isFav ? "heart" : "heart-outline"}
          iconColor="#8B0000"
          size={22}
          onPress={onFavorite}
          style={styles.iconBtn}
        />

        <Button
        onPress={onContact}
        textColor="#fff"
        buttonColor="#25D366"
        mode="contained"
        style={styles.contactBtn}
      >
        Contact
      </Button>

      <Button
        onPress={onPress}
        textColor="#8B0000"
        mode="text"
        compact
      >
        View
      </Button>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    // ❌ overflow removed
  },
  image: {
    height: 300,
    borderRadius: 0,
    resizeMode: "cover",
  },
  content: {
    paddingVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  description: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8B0000",
    marginTop: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  iconBtn: {
    marginHorizontal: 0,
  },
  contactBtn: {
  flex: 1,
  marginRight: 8,
  borderRadius: 8
},
  viewBtn: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
  },
});
