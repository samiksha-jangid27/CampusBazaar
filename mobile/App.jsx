import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AppProvider } from "./src/contexts/AppProvider";
import { AuthProvider } from "./src/contexts/AuthContext";
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <AuthProvider>
            <AppProvider>
              <AppNavigator />
            </AppProvider>
          </AuthProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
