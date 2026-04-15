import React, { createContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import appReducer, { initialState } from "../reducers/AppReducer";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load favorites from storage
  useEffect(() => {
    (async () => {
      const favs = await AsyncStorage.getItem("favorites");
      if (favs) {
        dispatch({ type: "SET_FAVORITES", payload: JSON.parse(favs) });
      }
    })();
  }, []);

  // Save favorites on change
  useEffect(() => {
    AsyncStorage.setItem("favorites", JSON.stringify(state.favorites));
  }, [state.favorites]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
