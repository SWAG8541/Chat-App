const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null, 
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_REQUEST":
      return { ...state, loading: true, error: null };

      case "LOGIN_SUCCESS":
        return { 
          ...state, 
          user: action.payload.user, 
          token: action.payload.token,
          loading: false 
        };

    case "LOGIN_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return { ...state, user: null, token: null };

    default:
      return state;
  }
};
