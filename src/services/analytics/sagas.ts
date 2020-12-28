import { PayloadAction } from "@reduxjs/toolkit"
import { all, call, put, takeEvery, delay, fork } from "redux-saga/effects"
import { AnalyticsSagaActions } from "./sagasActions"
import { postAnalyticsA, postAnalyticsB } from "./api"
import { AnalyticsRequest } from "../../types"

const MAXIMUM_RETRIES = 3

async function saveAnalyticsA(event: AnalyticsRequest) {
  const response = await postAnalyticsA(event)

  if (response.status !== 204) {
    throw Error("Unable to retrieve the cards")
  }
}

async function saveAnalyticsB(event: AnalyticsRequest) {
  const response = await postAnalyticsB(event)

  if (response.status !== 204) {
    throw Error("Unable to retrieve the cards")
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* retryOperation(fn: any, ...args: any) {
  let retry = 0
  while (retry < MAXIMUM_RETRIES) {
    try {
      yield call(fn, ...args)
      return undefined
    } catch (exception) {
      if (retry === 2) {
        throw Error("Unable to complete the operation")
      } else {
        retry++
        delay(Math.floor(2 ** retry * 1000))
      }
    }
  }
}

export function* sendAnalyticsASaga(payload: AnalyticsRequest) {
  try {
    yield retryOperation(saveAnalyticsA, payload)
    yield put({ type: AnalyticsSagaActions.SAVED_ON_ANALYTICS_A })
  } catch (exception) {
    yield put({ type: AnalyticsSagaActions.UNABLE_TO_SAVE_ANALYTICS_A })
  }
}

export function* sendAnalyticsBSaga(payload: AnalyticsRequest) {
  try {
    yield retryOperation(saveAnalyticsB, payload)
    yield put({ type: AnalyticsSagaActions.SAVED_ON_ANALYTICS_B })
  } catch (exception) {
    yield put({ type: AnalyticsSagaActions.UNABLE_TO_SAVE_ANALYTICS_B })
  }
}

export function* sendAnalytics({ payload }: PayloadAction<AnalyticsRequest>) {
  yield fork(sendAnalyticsASaga, payload)
  yield fork(sendAnalyticsBSaga, payload)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function* () {
  yield all([takeEvery(AnalyticsSagaActions.SEND_ANALYTICS, sendAnalytics)])
}
