import { all, call } from "redux-saga/effects"
import CardsSaga from "./cards/sagas"
import AnalyticsSaga from "./analytics/sagas"

export default function* rootSaga() {
  yield all([call(CardsSaga), call(AnalyticsSaga)])
}
