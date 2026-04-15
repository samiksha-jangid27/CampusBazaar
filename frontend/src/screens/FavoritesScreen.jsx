// src/screens/FavoritesScreen.js

import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { AppContext } from "../contexts/AppProvider";
import ListingCard from "../components/ListingCard";
import { IconButton } from "react-native-paper";

export default function FavoritesScreen({ navigation }) {
  const { state, dispatch } = useContext(AppContext);

  const favListings = state.favorites;

  return (
    <SafeAreaView style={styles.safe}>
      {/* 🔥 Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Wishlist ❤️</Text>
      </View>

      {/* If No Favorites */}
      {favListings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No favorites yet ❤️</Text>
          <Text style={styles.emptySubtitle}>
            Start exploring and save items you like!
          </Text>
        </View>
      ) : (
        <FlatList
          data={favListings}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <ListingCard
                item={item}
                isFav={true}
                onPress={() => navigation.navigate("Details", { id: item.id })}
                onFavorite={() =>
                  dispatch({
                    type: "REMOVE_FAVORITE",
                    payload: item.id,
                  })
                }
              />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  /* 🔥 HEADER */
  header: {
    height: 60,
    backgroundColor: "#8B0000",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  /* LIST STYLE */
  list: {
    padding: 14,
    paddingBottom: 50,
  },
  cardWrapper: {
    marginBottom: 16,
  },

  /* EMPTY STATE */
  emptyContainer: {
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
  emptySubtitle: {
    marginTop: 6,
    fontSize: 15,
    textAlign: "center",
    color: "#555",
  },
});
