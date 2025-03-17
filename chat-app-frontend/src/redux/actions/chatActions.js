// chatActions.js - Actions related to chat messages

// Action to request fetching messages
export const fetchMessagesRequest = () => ({
  type: "FETCH_MESSAGES_REQUEST",
});

// Action to send a new message
export const sendMessageRequest = (messageData) => ({
  type: "SEND_MESSAGE_REQUEST",
  payload: messageData, // Contains message content, sender, timestamp
});
