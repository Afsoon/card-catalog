import { postAnalyticsA, postAnalyticsB } from "./api"

const eventDummy = {
  eventName: "DISPLAY_CARD",
  eventProperties: {
    some: "text",
  },
}

test("Save event on Analytics A", async () => {
  const response = await postAnalyticsA(eventDummy)
  expect(response.status).toEqual(204)
  const analytics = localStorage.getItem("analyticsA")
  const parseData = JSON.parse(analytics || "[]")
  expect(parseData).toHaveLength(1)
  expect(parseData).toStrictEqual([eventDummy])
})

test("Save event on Analytics B", async () => {
  const response = await postAnalyticsB(eventDummy)
  expect(response.status).toEqual(204)
  const analytics = localStorage.getItem("analyticsB")
  const parseData = JSON.parse(analytics || "[]")
  expect(parseData).toHaveLength(1)
  expect(parseData).toStrictEqual([eventDummy])
})
