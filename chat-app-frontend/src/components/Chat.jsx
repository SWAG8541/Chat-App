import { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessagesRequest, sendMessageRequest } from "../redux/actions/chatActions";
import { io } from "socket.io-client";
import { Container, Box, TextField, Button, Typography, Avatar, IconButton } from "@mui/material";
import EmojiPicker from "@emoji-mart/react";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";

// ✅ WebSocket connection stored in useRef to prevent re-renders
const Chat = () => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const socketRef = useRef(null);
  const chatBoxRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const user = useSelector((state) => state.auth.user);

  // ✅ Initialize WebSocket connection once
  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    socketRef.current.on("receiveMessage", (newMessage) => {
      dispatch({ type: "SEND_MESSAGE_SUCCESS", payload: newMessage });
    });

    return () => socketRef.current.disconnect();
  }, [dispatch]);

  // ✅ Fetch messages on mount
  useEffect(() => {
    dispatch(fetchMessagesRequest());
  }, [dispatch]);

  // ✅ Scroll to latest message smoothly
  useEffect(() => {
    chatBoxRef.current?.scrollTo({ top: chatBoxRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // ✅ Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Handle sending messages with server acknowledgment
  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      sender: user._id,
      text: message,
      profilePic: user.profilePic,
      timestamp: new Date().toISOString(),
    };

    if (!user._id) {
      console.error("User ID is missing! Check authentication.");
      return;
    }

    socketRef.current.emit("sendMessage", newMessage, (acknowledgedMessage) => {
      dispatch(sendMessageRequest(acknowledgedMessage)); // ✅ Update store only when server confirms
    });

    setMessage(""); // Clear input
  };

  // ✅ Handle emoji selection
  const addEmoji = (e) => {
    setMessage((prev) => prev + e.native);
    setTimeout(() => setShowEmojiPicker(false), 100); // Prevent flicker
  };

  // ✅ Memoized message list for performance optimization
  const renderedMessages = useMemo(
    () =>
      messages.map((msg, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1,
            flexDirection: msg.sender === user.username ? "row-reverse" : "row",
          }}
        >
          {/* ✅ Display profile picture */}
          <Avatar src={msg.profilePic} sx={{ width: 30, height: 30, mx: 1 }} />
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              maxWidth: "70%",
              backgroundColor: msg.sender === user.username ? "#4caf50" : "#f1f1f1",
              color: msg.sender === user.username ? "white" : "black",
            }}
          >
            <Typography sx={{ fontSize: "14px" }}>
              <strong>{msg.sender}:</strong> {msg.text}
            </Typography>
            <Typography sx={{ fontSize: "12px", opacity: 0.6 }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </Typography>
          </Box>
        </Box>
      )),
    [messages, user.username]
  );

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Chat Room
        </Typography>

        {/* ✅ Chat Messages */}
        <Box
          ref={chatBoxRef}
          sx={{
            height: 300,
            overflowY: "auto",
            border: "1px solid gray",
            p: 2,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {renderedMessages}
        </Box>

        {/* ✅ Message Input */}
        <Box sx={{ position: "relative", display: "flex", alignItems: "center", mt: 2 }}>
          <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <SentimentSatisfiedAltIcon />
          </IconButton>

          {/* ✅ Emoji Picker - Positioned dynamically */}
          {showEmojiPicker && (
            <Box
              ref={emojiPickerRef}
              sx={{
                position: "absolute",
                bottom: 50,
                left: 0,
                zIndex: 10,
                background: "white",
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              <EmojiPicker onEmojiSelect={addEmoji} />
            </Box>
          )}

          <TextField
            fullWidth
            label="Type a message..."
            margin="normal"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button variant="contained" color="primary" sx={{ ml: 1 }} onClick={handleSendMessage}>
            Send
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Chat;
