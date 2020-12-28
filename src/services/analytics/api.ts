import { AnalyticsRequest } from "../../types"
const BASE_HEADERS = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
}

const buildRequest = async (
  path: string,
  options?: RequestInit | undefined,
) => {
  return fetch(`${path}`, Object.assign(BASE_HEADERS, options))
}

export const postAnalyticsA = (analyticRequest: AnalyticsRequest) => {
  return buildRequest(`/analyticsA`, {
    method: "POST",
    body: JSON.stringify(analyticRequest),
  })
}

export const postAnalyticsB = (analyticRequest: AnalyticsRequest) => {
  return buildRequest(`/analyticsB`, {
    method: "POST",
    body: JSON.stringify(analyticRequest),
  })
}
