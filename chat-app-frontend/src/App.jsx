// App.js - Main entry point for the React application
// Handles routing and authentication-based navigation

import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./components/Login";
import Register from "./components/Register";
import Chat from "./components/Chat";

const App = () => {
  // Get the authenticated user from Redux store
  const user = useSelector((state) => state.auth.user);

  return (
    <Router>
      <Routes>
        {/* Default Route ("/") - Redirects authenticated users to Chat, otherwise shows Login */}
        <Route path="/" element={user ? <Navigate to="/chat" /> : <Login />} />

        {/* Register Route - Redirects authenticated users to Chat, otherwise shows Register */}
        <Route path="/register" element={user ? <Navigate to="/chat" /> : <Register />} />

        {/* Chat Route - Only accessible if the user is logged in, otherwise redirects to Login */}
        <Route path="/chat" element={user ? <Chat /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
