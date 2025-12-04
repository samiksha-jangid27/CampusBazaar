import React, { useContext } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { ActivityIndicator, View } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import DetailsScreen from "../screens/DetailsScreen";
import AddListingScreen from "../screens/AddListingScreen";

// AUTH SCREENS
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import OTPVerificationScreen from "../screens/OTPVerificationScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AuthContext } from "../contexts/AuthContext";
import CustomDrawerContent from "./CustomDrawerContent";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#FFFFFF",
    primary: "#8B0000",
    text: "#8B0000",
    card: "#FFFFFF",
    border: "#FF5C5C",
  },
};

/* ------------------------------ */
/*     BOTTOM TABS (WITH ADD)     */
/* ------------------------------ */
function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#8B0000",
        tabBarInactiveTintColor: "#B94D4D",
        tabBarStyle: { backgroundColor: "#FFFFFF", height: 62, paddingBottom: 6 },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="AddListing"
        component={AddListingScreen}
        options={{
          title: "Add",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="plus-circle" size={34} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "heart" : "heart-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "account" : "account-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

/* ------------------------------ */
/*      DRAWER MENU (wrap tabs)   */
/* ------------------------------ */
function DrawerMenu({ logout }) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} logout={logout} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: "#8B0000",
        drawerInactiveTintColor: "#333",
        drawerActiveBackgroundColor: "#fff2f2",
      }}
    >
      <Drawer.Screen name="Home" component={Tabs} />
      <Drawer.Screen
        name="Products"
        component={HomeScreen}
        initialParams={{ category: "Products" }}
      />
      <Drawer.Screen
        name="Services"
        component={HomeScreen}
        initialParams={{ category: "Services" }}
      />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}

/* ------------------------------ */
/*          MAIN NAVIGATOR        */
/* ------------------------------ */
export default function AppNavigator() {
  const { user, loading, logout } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#8B0000" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* AUTH FLOW */}
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          </>
        ) : (
          <>
            {/* MAIN APP -> Drawer (wraps Tabs) */}
            <Stack.Screen name="MainApp">
              {() => <DrawerMenu logout={logout} />}
            </Stack.Screen>

            {/* Deep screens */}
            <Stack.Screen name="Details" component={DetailsScreen} />
            {/* Keep AddListing in stack too so navigation.push works */}
            <Stack.Screen name="AddListing" component={AddListingScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
