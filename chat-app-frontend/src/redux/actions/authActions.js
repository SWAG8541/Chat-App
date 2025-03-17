// authActions.js - Action creators for authentication

// Action to request login
export const loginRequest = (user) => ({
  type: "LOGIN_REQUEST",
  payload: user, // ✅ Only store user details (not token)
});


// Action to request registration
export const registerRequest = (userData) => ({
  type: "REGISTER_REQUEST",
  payload: userData, // Contains user details for registration
});

// Action to log out the user
export const logout = () => ({
  type: "LOGOUT",
});
