export const initialState = {
  listings: [],        // 🟢 Loaded from backend only
  favorites: [],       // 🟢 Stored locally for quick UI update
};

export default function appReducer(state, action) {
  switch (action.type) {
    
    // Save listings from backend
    case "setListings":
      return {
        ...state,
        listings: action.payload,
      };

    // Add/remove from favorites
    case "toggleFavorite": {
      const id = action.payload;

      return state.favorites.includes(id)
        ? {
            ...state,
            favorites: state.favorites.filter(f => f !== id),
          }
        : {
            ...state,
            favorites: [...state.favorites, id],
          };
    }

    default:
      return state;
  }
}
