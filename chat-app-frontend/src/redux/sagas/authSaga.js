// authSaga.js - Handles authentication API calls using Redux-Saga

import { put, takeLatest, call } from "redux-saga/effects";
import axios from "axios";

// Saga for login request
function* loginSaga(action) {
  try {
    // API call to login endpoint
    const response = yield call(axios.post, "http://localhost:5000/api/auth/login", action.payload);
    
    // Dispatch success action with user data
    yield put({ type: "LOGIN_SUCCESS", payload: response.data });

    // Store token in localStorage for persistence
    localStorage.setItem("token", response.data.token);
  } catch (error) {
    yield put({ type: "LOGIN_FAILURE", payload: error.response.data });
  }
}

// Saga for register request
function* registerSaga(action) {
  try {
    const response = yield call(axios.post, "http://localhost:5000/api/auth/register", action.payload);
    yield put({ type: "REGISTER_SUCCESS", payload: response.data });
  } catch (error) {
    yield put({ type: "REGISTER_FAILURE", payload: error.response.data });
  }
}

// Watcher saga for authentication-related actions
export function* watchAuthSaga() {
  yield takeLatest("LOGIN_REQUEST", loginSaga);
  yield takeLatest("REGISTER_REQUEST", registerSaga);
}
