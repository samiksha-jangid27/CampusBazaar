import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Text, StyleSheet, View } from "react-native";
import { AppContext } from "../contexts/AppProvider";
import { Button, Card, Divider } from "react-native-paper";

export default function CartScreen() {
  const { state, dispatch } = useContext(AppContext);
  const total = state.cart.reduce((sum, item) => sum + item.price, 0);

  const renderItem = ({ item }) => (
    <Card style={styles.card} mode="elevated">
      <View style={styles.cardRow}>
        <Card.Cover source={{ uri: item.image }} style={styles.image} />
        <View style={styles.cardContent}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>

          <Button
            textColor="#8B0000"
            icon="delete-outline"
            mode="text"
            onPress={() =>
              dispatch({ type: "removeFromCart", payload: item.id })
            }
          >
            Remove
          </Button>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {state.cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛍️</Text>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubText}>Start shopping and add items!</Text>
        </View>
      ) : (
        <>
          <Text style={styles.header}>🛒 Your Cart</Text>

          <FlatList
            data={state.cart}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />

          <Divider style={styles.divider} />

          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalAmount}>₹{total.toFixed(2)}</Text>
            </View>

            <Button
              mode="contained"
              buttonColor="#8B0000"
              textColor="#FFFFFF"
              style={styles.checkoutBtn}
              icon="credit-card"
              onPress={() => console.log("Checkout pressed")}
            >
              Proceed to Checkout
            </Button>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#8B0000",
    textAlign: "center",
    marginVertical: 16,
  },
  list: {
    paddingHorizontal: 14,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 14,
    borderRadius: 14,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
    // ❌ overflow removed
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  cardContent: {
    flex: 1,
    padding: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
    color: "#8B0000",
    fontWeight: "500",
    marginBottom: 6,
  },
  footer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 0.6,
    borderColor: "#E5E5E5",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 16,
    color: "#555",
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: "700",
    color: "#8B0000",
  },
  checkoutBtn: {
    borderRadius: 8,
    marginTop: 6,
  },
  divider: {
    marginVertical: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 70,
    marginBottom: 15,
  },
  emptyText: {
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
