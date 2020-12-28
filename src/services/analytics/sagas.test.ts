/* eslint-disable jest/expect-expect */
import { expectSaga } from "redux-saga-test-plan"
import { rest } from "msw"
import { AnalyticsSagaActions } from "./sagasActions"
import { sendAnalytics, sendAnalyticsASaga, sendAnalyticsBSaga } from "./sagas"
import { server } from "../../mocks/server"

const eventDummy = {
  eventName: "DISPLAY_CARD",
  eventProperties: {
    some: "text",
  },
}

test("We send a dummy event after a click to analytics A", () => {
  return expectSaga(sendAnalyticsASaga, eventDummy)
    .put({ type: AnalyticsSagaActions.SAVED_ON_ANALYTICS_A })
    .run({ timeout: false })
})

test("We send a dummy event after a click to analytics B", () => {
  return expectSaga(sendAnalyticsBSaga, eventDummy)
    .put({ type: AnalyticsSagaActions.SAVED_ON_ANALYTICS_B })
    .run({ timeout: false })
})

test("We send a dummy event after a click to analytics A but we can't", () => {
  server.use(
    rest.post("/analyticsA", (_req, res, ctx) => {
      return res(ctx.status(500))
    }),
  )
  return expectSaga(sendAnalyticsASaga, eventDummy)
    .put({ type: AnalyticsSagaActions.UNABLE_TO_SAVE_ANALYTICS_A })
    .run({ timeout: false })
})

test("We send a dummy event after a click to analytics B but we can't", () => {
  server.use(
    rest.post("/analyticsB", (_req, res, ctx) => {
      return res(ctx.status(500))
    }),
  )
  return expectSaga(sendAnalyticsBSaga, eventDummy)
    .put({ type: AnalyticsSagaActions.UNABLE_TO_SAVE_ANALYTICS_B })
    .run({ timeout: false })
})

test("We send async the anaylitcs requests to avoid block", () => {
  return expectSaga(sendAnalytics, {
    type: AnalyticsSagaActions.SEND_ANALYTICS,
    payload: eventDummy,
  })
    .fork(sendAnalyticsASaga, eventDummy)
    .fork(sendAnalyticsBSaga, eventDummy)
    .put({ type: AnalyticsSagaActions.SAVED_ON_ANALYTICS_B })
    .put({ type: AnalyticsSagaActions.SAVED_ON_ANALYTICS_A })
    .run({ timeout: false })
})
