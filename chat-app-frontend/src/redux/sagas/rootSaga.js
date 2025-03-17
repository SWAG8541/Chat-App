// rootSaga.js - Combines all sagas into a single saga middleware

import { all } from "redux-saga/effects";
import { watchAuthSaga } from "./authSaga";
import { watchSendMessage } from "./chatSaga";

// Root saga to run all watcher sagas in parallel
export default function* rootSaga() {
  yield all([watchAuthSaga(), watchSendMessage()]);
}
