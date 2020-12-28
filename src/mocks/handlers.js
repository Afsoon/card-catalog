import { rest } from "msw"
import { cards } from "./cards"

export const resetLocalStorage = () => {
  localStorage.setItem("cards", JSON.stringify(cards))
}

localStorage.setItem("cards", JSON.stringify(cards))

const responseStructure = (data) => ({
  data,
})

const loadData = () => {
  return JSON.parse(localStorage.getItem("cards"))
}

const findById = (id) => {
  const data = loadData()
  return data.find((card) => card._id === id)
}

const validateUpdateRequest = (body) => {
  const errors = {}
  if (!body.name) {
    errors.name = "Name can't be blank. Please insert a value"
  }
  if (!body.imageUrl) {
    errors.imageUrl = "Image can't be blank. Please insert a value"
  }
  return errors
}

export const handlers = [
  rest.get("/cards", (req, res, ctx) => {
    const query = req.url.searchParams.get("q")
    const data = loadData()
    if (query) {
      const filteredData = data.filter((card) => card.name.includes(query))
      return res(ctx.json(responseStructure(filteredData)))
    } else {
      return res(ctx.json(responseStructure(data)))
    }
  }),
  rest.delete("/cards/:cardId", (req, res, ctx) => {
    const card = findById(req.params.cardId)
    if (card) {
      const newData = loadData().filter(
        (card) => card._id !== req.params.cardId,
      )
      localStorage.setItem("cards", JSON.stringify(newData))
      return res(ctx.json(responseStructure(card)))
    } else {
      return res(ctx.status(404, "Not found"))
    }
  }),
  rest.put("/cards/:cardId", (req, res, ctx) => {
    const errors = validateUpdateRequest(req.body)
    if (Object.keys(errors).length) {
      return res(ctx.status(400))
    }

    const oldCard = findById(req.params.cardId)
    if (oldCard) {
      const body = req.body
      const newCard = { ...oldCard, ...body }
      const newData = loadData().map((card) => {
        if (card._id === newCard._id) {
          return newCard
        } else {
          return card
        }
      })
      localStorage.setItem("cards", JSON.stringify(newData))
      return res(ctx.json(responseStructure(newCard)))
    } else {
      return res(ctx.status(404, "Not found"))
    }
  }),
  rest.post("/analyticsA", (req, res, ctx) => {
    const key = "analyticsA"
    let analytics = localStorage.getItem(key)
    if (analytics) {
      analytics = JSON.parse(analytics)
      localStorage.setItem(key, JSON.stringify([...analytics, req.body]))
    } else {
      localStorage.setItem(key, JSON.stringify([req.body]))
    }
    return res(ctx.status(204))
  }),
  rest.post("/analyticsB", (req, res, ctx) => {
    const key = "analyticsB"
    let analytics = localStorage.getItem(key)
    if (analytics) {
      analytics = JSON.parse(analytics)
      localStorage.setItem(key, JSON.stringify([...analytics, req.body]))
    } else {
      localStorage.setItem(key, JSON.stringify([req.body]))
    }
    return res(ctx.status(204))
  }),
]
