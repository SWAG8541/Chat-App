import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest } from "../redux/actions/authActions";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box, Alert, CircularProgress } from "@mui/material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Get loading/error state from Redux
  const { loading, error } = useSelector((state) => state.auth);

  // ✅ Handle Login Logic
  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      alert("Username and password are required!");
      return;
    }

    dispatch(loginRequest({ username: username.trim(), password: password.trim() }));
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          fullWidth
          label="Username"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleLogin} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Login"}
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
