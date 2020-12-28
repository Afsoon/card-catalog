import { deleteCard, getCards, updateCard } from "./api"
import { cards } from "../../mocks/cards"

test("Get all cards", async () => {
  const response = await getCards()
  const body = await response.json()
  const cards = await body.data

  expect(cards).toHaveLength(72)
})

test("Get all cards by filter", async () => {
  const response = await getCards("Du")
  const body = await response.json()
  const cards = await body.data

  expect(cards).toHaveLength(1)
})

test("Delete one card", async () => {
  const cardToDelete = cards[0]
  const deletedCardResponse = await deleteCard(cardToDelete._id)
  const bodyDelete = await deletedCardResponse.json()
  const deletedCard = await bodyDelete.data

  expect(deletedCard).toStrictEqual(cardToDelete)
})

test("Unable to delete a card because doesn't exist", async () => {
  const deletedCardResponse = await deleteCard("NOT EXISTS")

  expect(deletedCardResponse.status).toBe(404)
})

test("Update a card", async () => {
  const newCardData = { name: "test", imageUrl: "https//test.jest" }
  const updateCardResponse = await updateCard(cards[0]._id, newCardData)
  const updateResponse = await updateCardResponse.json()
  const bodyUpdate = await updateResponse.data

  expect(updateCardResponse.status).toBe(200)
  expect(bodyUpdate).toStrictEqual({ ...cards[0], ...newCardData })
})

test("Unable to update card", async () => {
  const emptyUrl = { name: "test", imageUrl: "" }
  const emptyName = { name: "", imageUrl: "asdadasdasd" }
  const emptyData = { name: "", imageUrl: "" }
  let updateCardResponse = await updateCard(cards[0]._id, emptyUrl)
  expect(updateCardResponse.status).toBe(400)
  updateCardResponse = await updateCard(cards[0]._id, emptyName)
  expect(updateCardResponse.status).toBe(400)
  updateCardResponse = await updateCard(cards[0]._id, emptyData)
  expect(updateCardResponse.status).toBe(400)
})

test("Unable to delete a card that doesn't exist after delete it", async () => {
  const cardToDelete = cards[0]
  const deletedCardResponse = await deleteCard(cardToDelete._id)
  const bodyDelete = await deletedCardResponse.json()
  const deletedCard = await bodyDelete.data

  expect(deletedCard).toStrictEqual(cardToDelete)

  const newCardData = { name: "test", imageUrl: "https//test.jest" }
  const updateCardResponse = await updateCard(cards[0]._id, newCardData)

  expect(updateCardResponse.status).toBe(404)
})
