import { CardUpdateRequest } from "../../types"
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

export const getCards = (filter?: string) => {
  return buildRequest(`/cards${filter ? `?q=${filter}` : ""}`)
}

export const deleteCard = (cardId: string) => {
  return buildRequest(`/cards/${cardId}`, { method: "DELETE" })
}

export const updateCard = (cardId: string, cardRequest: CardUpdateRequest) => {
  return buildRequest(`/cards/${cardId}`, {
    method: "PUT",
    body: JSON.stringify(cardRequest),
  })
}
