import React, { useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, FlatList, View } from "react-native";
import { Appbar, TextInput, Text } from "react-native-paper";
import { AppContext } from "../contexts/AppProvider";
import ListingCard from "../components/ListingCard";

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { state, dispatch } = useContext(AppContext);

  const filteredListings = state.listings.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe}>

      <Appbar.Header style={styles.header}>
        <Appbar.Action icon="menu" color="#fff" onPress={() => {}} />
          <Appbar.Content title="Campus Bazaar" titleStyle={styles.title} />
      </Appbar.Header>


      <View style={styles.searchWrapper}>
        <TextInput
          mode="outlined"
          placeholder="Search items near you..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          left={<TextInput.Icon icon="magnify" color="#8B0000" />}
          outlineColor="#ddd"
          activeOutlineColor="#8B0000"
          theme={{ roundness: 10 }}
        />
      </View>

      <FlatList
        data={filteredListings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 120 }}
        renderItem={({ item }) => (
          <ListingCard
            item={item}
            onPress={() => navigation.navigate("Details", { id: item.id })}
            onFavorite={() =>
              dispatch({ type: "toggleFavorite", payload: item.id })
            }
            isFav={state.favorites.includes(item.id)}
            onCart={() => dispatch({ type: "addToCart", payload: item })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🛍️</Text>
            <Text style={styles.emptyText}>No items found</Text>
            <Text style={styles.emptySubText}>
              Try a different search or explore categories.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    backgroundColor: "#8B0000",
    // elevation: 3,
    // paddingHorizontal:16,

  },
    subtitle: {
    fontSize: 12,
    color: "#777",
    marginTop: 6,
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18,
  },
  searchWrapper: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: "#FFFFFF",
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    fontSize: 15,
    height: 45,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8B0000",
  },
  emptySubText: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },
});
