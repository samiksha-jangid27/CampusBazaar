export const initialState = {
  favorites: [], // store full objects
};

export default function appReducer(state, action) {
  switch (action.type) {
    case "ADD_FAVORITE":
      // avoid duplicates
      if (state.favorites.some((item) => item.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };

    case "REMOVE_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.filter(
          (item) => item.id !== action.payload
        ),
      };

    case "TOGGLE_FAVORITE":
      const exists = state.favorites.find(
        (item) => item.id === action.payload.id
      );
      if (exists) {
        return {
          ...state,
          favorites: state.favorites.filter(
            (i) => i.id !== action.payload.id
          ),
        };
      }
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };

    default:
      return state;
  }
}
