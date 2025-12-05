// src/screens/FavoritesScreen.js

import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Text, StyleSheet, View } from "react-native";
import { AppContext } from "../contexts/AppProvider";
import ListingCard from "../components/ListingCard";

export default function FavoritesScreen({ navigation }) {
  const { state, dispatch } = useContext(AppContext);

  // ❤️ favorites ARE FULL ITEMS, not IDs
  const favListings = state.favorites;

  return (
    <SafeAreaView style={styles.safe}>
      {favListings.length === 0 ? (
        <View style={styles.emptyfav}>
          <Text style={styles.emptyTitle}>No favorites yet ❤️</Text>
          <Text style={styles.emptySubText}>
            Start browsing and save your favorite items!
          </Text>
        </View>
      ) : (
        <FlatList
          data={favListings}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ListingCard
              item={item}
              onPress={() =>
                navigation.navigate("Details", { id: item.id })
              }
              isFav={true}
              onFavorite={() =>
                dispatch({
                  type: "REMOVE_FAVORITE",
                  payload: item.id,
                })
              }
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },

  list: { padding: 10, paddingBottom: 20 },

  emptyfav: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#8B0000",
  },
  emptySubText: {
    fontSize: 15,
    color: "#666",
    marginTop: 6,
    textAlign: "center",
  },
});
