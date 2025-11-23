import React, { createContext, useReducer } from "react";
import appReducer from "../reducers/AppReducer";
import { initialState } from "../reducers/AppReducer";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
