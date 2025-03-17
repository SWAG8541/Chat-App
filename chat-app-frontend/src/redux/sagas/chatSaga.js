// chatSaga.js - Handles chat API calls using Redux-Saga

import { takeLatest, put, call } from "redux-saga/effects";
import axios from "axios";

// Saga for sending messages
function* sendMessageSaga(action) {
  try {
    const token = localStorage.getItem("token"); // Retrieve authentication token

    if (!token) {
      throw new Error("No authentication token found");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Attach token for authentication
      },
    };

    const response = yield call(axios.post, "http://localhost:5000/api/chat", action.payload, config);

    // Dispatch success action with new message
    yield put({ type: "SEND_MESSAGE_SUCCESS", payload: response.data });
  } catch (error) {
    console.error("Error sending message:", error.response?.data || error.message);
    yield put({ type: "SEND_MESSAGE_FAILURE", error: error.message });
  }
}

// Watcher saga for chat actions
export function* watchSendMessage() {
  yield takeLatest("SEND_MESSAGE_REQUEST", sendMessageSaga);
}
