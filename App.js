import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import HomeScreen from "./src/screens/HomeScreen";
import FavoritesScreen from "./src/screens/FavoritesScreen";
import { AppProvider } from "./src/contexts/AppProvider";
import AppNavigator from "./src/navigation/AppNavigator";

const theme = {
  colors: {
    primary: "#8B0000",    // Dark Red
    accent: "#FF5C5C",     // Light Red
    background: "#FFFFFF",
    surface: "#FFFFFF",
    text: "#8B0000",
    placeholder: "#FF5C5C",
    error: "#B00020",
  },
  roundness: 10,
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AppProvider>
        <AppNavigator />
      </AppProvider>
        
    </PaperProvider>
  );
}

