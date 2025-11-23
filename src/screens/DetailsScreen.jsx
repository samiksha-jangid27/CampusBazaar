import React, { useContext, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, ScrollView, Image } from "react-native";
import { Appbar, Button, Text, IconButton, Divider } from "react-native-paper";
import { AppContext } from "../contexts/AppProvider";

export default function DetailsScreen({ route, navigation }) {
  const { id } = route.params || {};
  const { state, dispatch } = useContext(AppContext);

  const item = useMemo(() => state.listings.find((l) => l.id === id), [state.listings, id]);
  const isFav = state.favorites.includes(id);

  if (!item) {
    return (
      <SafeAreaView style={styles.safe}>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction color="#FFF" onPress={() => navigation.goBack()} />
          <Appbar.Content title="Details" color="#FFF" />
        </Appbar.Header>
        <View style={styles.missingWrap}>
          <Text style={styles.missingText}>Item not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction color="#FFF" onPress={() => navigation.goBack()} />
        <Appbar.Content title="Product Details" color="#FFF" />
       
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={{ uri: item.image }} style={styles.image} />

        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>₹{item.price.toFixed(2)}</Text>
          <Text style={styles.desc}>
            {item.desc || "No description available."}
          </Text>
        </View>
      </ScrollView>

      <Divider />

      <View style={styles.footer}>
        <IconButton
          icon={isFav ? "heart" : "heart-outline"}
          size={24}
          iconColor={"#8B0000"}
          onPress={() => dispatch({ type: "toggleFavorite", payload: id })}
        />

        <Button
          mode="contained"
          buttonColor="#8B0000"
          textColor="#FFFFFF"
          style={styles.addBtn}
          icon="cart"
          onPress={() => dispatch({ type: "addToCart", payload: item })}
        >
          Add to cart
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#8B0000",
  },
  scroll: {
    paddingBottom: 20,
  },
  image: {
    width: "100%",
    height: 320,
    backgroundColor: "#EEE",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 6,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#8B0000",
    marginBottom: 10,
  },
  desc: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0.6,
    borderColor: "#E5E5E5",
  },
  addBtn: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 10,
  },
  missingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  missingText: {
    fontSize: 18,
    color: "#8B0000",
    fontWeight: "600",
  },
});


