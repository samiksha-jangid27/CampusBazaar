import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Text, StyleSheet, View } from "react-native";
import { AppContext } from "../contexts/AppProvider";
import ListingCard from "../components/ListingCard";

export default function FavoritesScreen({ navigation }) {
  const { state, dispatch } = useContext(AppContext);
  const favListings = state.listings.filter((l) =>
    state.favorites.includes(l.id)
  );

  return (
    <SafeAreaView style={styles.safe}>
      {favListings.length === 0 ? (
        <View style={styles.emptyfav}>
          <Text style={{fontSize: 22,fontWeight: "700", color: "#8B0000",}}>No favorites yet ❤️</Text>
          <Text style={styles.emptySubText}>Start shopping and add your favorite items!</Text>
        </View>
        
      ) : (
        <FlatList
          data={favListings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ListingCard
              item={item}
              onPress={() => navigation.navigate("Details", { id: item.id })}
              onFavorite={() =>
                dispatch({ type: "toggleFavorite", payload: item.id })
              }
              isFav
              onCart={() => dispatch({ type: "addToCart", payload: item })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF"},
  list: { padding: 10, paddingBottom: 20 },
  emptyfav: { flex:1, justifyContent:"center" , alignItems: "center" , marginTop: 50, fontSize: 16, color: "#8B0000" },
  emptySubText: {
    fontSize: 15,
    color: "#666",
    marginTop: 6,
    textAlign: "center",
  }
});
