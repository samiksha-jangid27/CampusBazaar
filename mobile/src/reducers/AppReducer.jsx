export const initialState = {
  listings: [],
  favorites: [], // ❤️ full objects
  user: null,
};

export default function appReducer(state, action) {
  switch (action.type) {
    case "SET_LISTINGS":
      return { ...state, listings: action.payload };

    case "ADD_FAVORITE":
      return {
        ...state,
        favorites: [...state.favorites, action.payload], // add full item
      };

    case "REMOVE_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.filter((f) => f.id !== action.payload),
      };

    case "CLEAR_FAVORITES":
      return { ...state, favorites: [] };

    default:
      return state;
  }
}
