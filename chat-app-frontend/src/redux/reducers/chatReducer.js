// chatReducer.js - Manages chat messages state

const initialState = {
  messages: [], // Stores all chat messages
  loading: false, // Tracks loading state for messages
  error: null, // Stores errors related to fetching/sending messages
};

export const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_MESSAGES_REQUEST":
      return { ...state, loading: true };

    case "FETCH_MESSAGES_SUCCESS":
      return { ...state, loading: false, messages: action.payload };

    case "FETCH_MESSAGES_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "SEND_MESSAGE_SUCCESS":
      return { ...state, messages: [...state.messages, action.payload] };

    case "SEND_MESSAGE_FAILURE":
      return { ...state, error: action.error };

    default:
      return state;
  }
};
