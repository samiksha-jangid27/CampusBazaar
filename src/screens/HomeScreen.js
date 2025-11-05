import React , {useState , useContext} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, FlatList, View } from "react-native";
import { Appbar, Card, Button, TextInput, Text } from "react-native-paper";
import { AppContext } from "../contexts/AppProvider";
import ListingCard from "../components/ListingCard";

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { state, dispatch } = useContext(AppContext);

  return (
    <SafeAreaView style={styles.safe}>

      <Appbar.Header style={styles.header}>
        <Appbar.Action icon="menu" color="#fff" onPress={() => {}} size={22} />
        <Appbar.Content title="Campus Bazaar" titleStyle={styles.title} />
        <Appbar.Action icon="magnify" color="#fff" onPress={() => {}} size={22} />
      </Appbar.Header>

      <View style={styles.searchWrapper}>
        <TextInput
          mode="outlined"
          placeholder="Search items near you..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          left={<TextInput.Icon icon="magnify" color="#8B0000" />}
          outlineColor="#eee"
          activeOutlineColor="#8B0000"
        />
      </View>

      <FlatList
        data={state.listings.filter((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10, paddingTop: 10 }}
        renderItem={({ item }) => (
          <ListingCard
            item={item}
            onPress={() => navigation.navigate("Details", { id: item.id })}
            onFavorite={() => dispatch({ type: "toggleFavorite", payload: item.id })}
            isFav={state.favorites.includes(item.id)}
            onCart={() => dispatch({ type: "addToCart", payload: item })}
          />
        )}
      />
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
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,

  },
  searchWrapper: {
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  searchInput: {
    backgroundColor: "#fff",
    fontSize: 14,
    height: 40,
  },
  card: {
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
    borderRadius:20
  },
  cardInner: {
    overflow: "hidden",
  },
});
