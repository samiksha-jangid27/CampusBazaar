import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, ScrollView, Image, ActivityIndicator, Linking, Alert } from "react-native";
import { Appbar, Button, Text, IconButton, Divider } from "react-native-paper";
import { AppContext } from "../contexts/AppProvider";
import api from "../services/api";

export default function DetailsScreen({ route, navigation }) {
  const { id } = route.params || {};
  const { state, dispatch } = useContext(AppContext);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListingDetails();
  }, [id]);

  const fetchListingDetails = async () => {
    try {
      const response = await api.get(`/listings/${id}`);
      setItem(response.data);
    } catch (error) {
      console.error("Error fetching listing details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (item?.seller?.phoneNumber) {
      const message = `Hi, I'm interested in your listing: ${item.title}`;
      const url = `whatsapp://send?phone=${item.seller.phoneNumber}&text=${encodeURIComponent(message)}`;
      
      Linking.canOpenURL(url)
        .then((supported) => {
          if (!supported) {
            Alert.alert("Error", "WhatsApp is not installed");
          } else {
            return Linking.openURL(url);
          }
        })
        .catch((err) => console.error("An error occurred", err));
    } else {
      Alert.alert("Info", "Seller phone number not available");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B0000" />
      </View>
    );
  }

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

  const isFav = state.favorites.includes(item._id || item.id);

  return (
    <SafeAreaView style={styles.safe}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction color="#FFF" onPress={() => navigation.goBack()} />
        <Appbar.Content title="Product Details" color="#FFF" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Image 
          source={{ uri: item.images?.[0] || item.image || "https://via.placeholder.com/300" }} 
          style={styles.image} 
        />

        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>₹{item.price.toFixed(2)}</Text>
          <Text style={styles.category}>{item.category} • {item.subcategory}</Text>
          
          <Divider style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.desc}>
            {item.description || item.desc || "No description available."}
          </Text>

          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>Seller Info</Text>
          <View style={styles.sellerInfo}>
            <Text style={styles.sellerName}>{item.seller?.name || "Unknown Seller"}</Text>
            {item.seller?.phoneNumber && (
               <Button 
                 mode="outlined" 
                 icon="whatsapp" 
                 onPress={handleWhatsApp}
                 textColor="#25D366"
                 style={{ borderColor: "#25D366" }}
               >
                 Chat Now
               </Button>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <IconButton
          icon={isFav ? "heart" : "heart-outline"}
          size={24}
          iconColor={"#8B0000"}
          onPress={() => dispatch({ type: "toggleFavorite", payload: item._id || item.id })}
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
    height: 300,
    backgroundColor: "#EEE",
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: "#8B0000",
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  divider: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  desc: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
  },
  sellerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: "500",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
