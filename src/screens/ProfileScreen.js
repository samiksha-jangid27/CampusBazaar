import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {Text, StyleSheet} from "react-native";


export default function FavoritesScreen({ navigation }) {

  return (
    <SafeAreaView style={styles.safe}>
      <Text>hello</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF"}
});
