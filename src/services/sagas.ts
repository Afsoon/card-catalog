import { all, call } from "redux-saga/effects"
import CardsSaga from "./cards/sagas"

export default function* rootSaga() {
  yield all([call(CardsSaga)])
}
