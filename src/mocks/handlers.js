import { rest } from "msw"
import { cards } from "./cards"

let data = cards

const responseStructure = (data) => ({
  data,
})

const findById = (id) => {
  return data.find((card) => card.id === id)
}

export const handlers = [
  rest.get("/cards", (_req, res, ctx) => {
    return res(ctx.json(responseStructure(data)))
  }),
  rest.delete("/cards/:cardId", (req, res, ctx) => {
    const card = findById(req.params.phoneId)
    if (card) {
      data = data.filter((card) => card.id !== req.params.phoneId)
      return res(ctx.json(responseStructure(card)))
    } else {
      return res(ctx.status(404, "Not found"))
    }
  }),
  rest.put("/cards/:cardId", (req, res, ctx) => {
    const oldCard = findById(req.params.cardId)
    if (oldCard) {
      const body = JSON.parse(req.body)
      const newCard = { ...oldCard, ...body }
      data.map((card) => {
        if (card.id === newCard.id) {
          return newCard
        } else {
          return card
        }
      })
      return res(ctx.json(responseStructure(newCard)))
    } else {
      return res(ctx.status(404, "Not found"))
    }
  }),
]
