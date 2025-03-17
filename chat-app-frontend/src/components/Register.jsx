import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { registerRequest } from "../redux/actions/authActions";
import { useNavigate, useLocation } from "react-router-dom";
import { TextField, Button, Container, Typography, Box, Avatar, Alert } from "@mui/material";
import axios from "axios";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    profilePic: "",
  });

  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(""); // ✅ State for error messages

  // ✅ Auto-fill fields if redirected from Login
  useEffect(() => {
    const savedUsername = sessionStorage.getItem("pendingUsername");
    const savedPassword = sessionStorage.getItem("pendingPassword");

    if (savedUsername || savedPassword) {
      setFormData((prev) => ({
        ...prev,
        username: savedUsername || "",
        password: savedPassword || "",
        confirmPassword: savedPassword || "",
      }));

      sessionStorage.removeItem("pendingUsername");
      sessionStorage.removeItem("pendingPassword");
    }
  }, [location]);

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Profile Picture Upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    // Upload image (simulate Cloudinary)
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", "your_preset_here");

    try {
      const res = await axios.post("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", uploadData);
      setFormData((prev) => ({ ...prev, profilePic: res.data.secure_url }));
    } catch (error) {
      console.error("Image upload failed", error);
      setError("Failed to upload image. Try again.");
    }
  };

  // ✅ Handle Registration
  const handleRegister = () => {
    setError("");

    // ✅ Basic Form Validation
    if (!formData.fullName || !formData.email || !formData.username || !formData.password) {
      setError("All fields are required!");
      return;
    }

    // ✅ Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Invalid email format!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // ✅ Dispatch Register Request
    dispatch(registerRequest(formData));

    alert("Registration successful! Redirecting to Login...");
    navigate("/");
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" align="center">Register</Typography>

        {/* ✅ Display error message if exists */}
        {error && <Alert severity="error">{error}</Alert>}

        {/* ✅ Profile Picture Preview */}
        <Avatar src={preview} sx={{ width: 70, height: 70, mx: "auto", mb: 2 }} />

        <TextField fullWidth label="Full Name" name="fullName" margin="normal" value={formData.fullName} onChange={handleChange} />
        <TextField fullWidth label="Email" name="email" margin="normal" type="email" value={formData.email} onChange={handleChange} />
        <TextField fullWidth label="Username" name="username" margin="normal" value={formData.username} onChange={handleChange} />
        <TextField fullWidth label="Password" name="password" type="password" margin="normal" value={formData.password} onChange={handleChange} />
        <TextField fullWidth label="Confirm Password" name="confirmPassword" type="password" margin="normal" value={formData.confirmPassword} onChange={handleChange} />

        {/* ✅ File Upload Button */}
        <Button variant="contained" component="label" fullWidth sx={{ mt: 1 }}>
          Upload Profile Picture
          <input type="file" hidden accept="image/*" onChange={handleFileChange} />
        </Button>

        {/* ✅ Register Button */}
        <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleRegister}>
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default Register;
