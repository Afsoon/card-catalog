/* eslint-disable jest/expect-expect */
import { expectSaga } from "redux-saga-test-plan"
import {
  cardsSliceBuilder,
  counterSlice,
  FETCH_STATES,
  FETCH_CARDS,
  FETCH_CARDS_SUCCESS,
  DELETE_CARD,
  DELETE_CARD_ERROR,
  DELETE_CARD_SUCCESS,
  UPDATE_CARD,
  UPDATE_CARD_ERROR,
  UPDATE_CARD_SUCCESS,
  RESET_DELETE_STATUS,
  RESET_UPDATE_STATUS,
} from "./CardsSlice"
import { CardsSagaActions } from "./sagasActions"
import { AnalyticsSagaActions } from "../analytics/sagasActions"
import {
  loadCardsSagas,
  deleteCardSagas,
  updateCardSagas,
  searchInputSagas,
} from "./sagas"
import { cards } from "../../mocks/cards"

const formatInitialState = () => {
  return {
    value: [cards[0]],
    mapIdToValue: Object.fromEntries(
      [cards[0]].map((card) => {
        return [card._id, card]
      }),
    ),
    fetchStatus: FETCH_STATES.IDLE,
    deleteStatus: FETCH_STATES.IDLE,
    updateStatus: FETCH_STATES.IDLE,
    error: undefined,
  }
}

test("Get all cards without filter sagas", () => {
  return expectSaga(loadCardsSagas, {
    payload: { filter: undefined },
    type: CardsSagaActions.FETCH_CARDS_SAGA,
  })
    .withReducer(counterSlice.reducer)
    .put(FETCH_CARDS())
    .put(FETCH_CARDS_SUCCESS(cards))
    .put({
      type: AnalyticsSagaActions.SEND_ANALYTICS,
      payload: {
        eventName: "LOADING_CARDS",
        eventProperties: {
          filter: "NO FILTER",
          count: 0,
          cardsThatHave: [],
        },
      },
    })
    .hasFinalState({
      value: cards,
      mapIdToValue: Object.fromEntries(
        cards.map((card) => {
          return [card._id, card]
        }),
      ),
      fetchStatus: FETCH_STATES.SUCCESS,
      deleteStatus: FETCH_STATES.IDLE,
      updateStatus: FETCH_STATES.IDLE,
      error: undefined,
    })
    .run({ timeout: false })
})

test("Get all cards with filter sagas", () => {
  return expectSaga(loadCardsSagas, {
    payload: { filter: "Du" },
    type: CardsSagaActions.FETCH_CARDS_SAGA,
  })
    .withReducer(counterSlice.reducer)
    .put(FETCH_CARDS())
    .put(FETCH_CARDS_SUCCESS([cards[0]]))
    .put({
      type: AnalyticsSagaActions.SEND_ANALYTICS,
      payload: {
        eventName: "LOADING_CARDS",
        eventProperties: {
          filter: "Du",
          count: 0,
          cardsThatHave: [],
        },
      },
    })
    .hasFinalState({
      value: [cards[0]],
      mapIdToValue: Object.fromEntries(
        [cards[0]].map((card) => {
          return [card._id, card]
        }),
      ),
      fetchStatus: FETCH_STATES.SUCCESS,
      deleteStatus: FETCH_STATES.IDLE,
      updateStatus: FETCH_STATES.IDLE,
      error: undefined,
    })
    .run({ timeout: false })
})

test("Get all cards with filter sagas from an input", () => {
  return expectSaga(searchInputSagas, {
    payload: { filter: "Du" },
    type: CardsSagaActions.INPUT_SEARCH,
  })
    .put({ type: CardsSagaActions.FETCH_CARDS_SAGA, payload: { filter: "Du" } })
    .run({ timeout: false })
})

test("Delete a card sagas", () => {
  return expectSaga(deleteCardSagas, {
    type: CardsSagaActions.DELETE_CARDS_SAGA,
    payload: { cardId: cards[0]._id },
  })
    .withReducer(cardsSliceBuilder(formatInitialState()).reducer)
    .put(DELETE_CARD())
    .put(DELETE_CARD_SUCCESS(cards[0]))
    .put(RESET_DELETE_STATUS())
    .dispatch({ type: CardsSagaActions.HIDE_DELETE_MODAL })
    .hasFinalState({
      value: [],
      mapIdToValue: {},
      fetchStatus: FETCH_STATES.IDLE,
      deleteStatus: FETCH_STATES.IDLE,
      updateStatus: FETCH_STATES.IDLE,
      error: undefined,
    })
    .run({ timeout: false })
})

test("Unable to delete a card sagas because doesn't exist", () => {
  return expectSaga(deleteCardSagas, {
    type: CardsSagaActions.DELETE_CARDS_SAGA,
    payload: { cardId: "NOTHING" },
  })
    .withReducer(cardsSliceBuilder(formatInitialState()).reducer)
    .put(DELETE_CARD())
    .put(
      DELETE_CARD_ERROR({ errorMessage: "Unable to delete the card selected" }),
    )
    .hasFinalState({
      value: [cards[0]],
      mapIdToValue: Object.fromEntries(
        [cards[0]].map((card) => {
          return [card._id, card]
        }),
      ),
      fetchStatus: FETCH_STATES.IDLE,
      deleteStatus: FETCH_STATES.ERROR,
      updateStatus: FETCH_STATES.IDLE,
      error: { errorMessage: "Unable to delete the card selected" },
    })
    .run({ timeout: false })
})

test("Update a card sagas", () => {
  const updatedCard = { name: "Test", imageUrl: "https://jest.com" }
  return expectSaga(updateCardSagas, {
    type: CardsSagaActions.UPDATE_CARD_SAGA,
    payload: { cardId: cards[0]._id, cardRequest: updatedCard },
  })
    .withReducer(cardsSliceBuilder(formatInitialState()).reducer)
    .put(UPDATE_CARD())
    .put(UPDATE_CARD_SUCCESS({ ...cards[0], ...updatedCard }))
    .put(RESET_UPDATE_STATUS())
    .hasFinalState({
      value: [{ ...cards[0], ...updatedCard }],
      mapIdToValue: Object.fromEntries(
        [{ ...cards[0], ...updatedCard }].map((card) => {
          return [card._id, card]
        }),
      ),
      fetchStatus: FETCH_STATES.IDLE,
      deleteStatus: FETCH_STATES.IDLE,
      updateStatus: FETCH_STATES.IDLE,
      error: undefined,
    })
    .run({ timeout: false })
})

test("Unable to update a card sagas because doesn't exist", () => {
  const updatedCard = { name: "Test", imageUrl: "https://jest.com" }
  return expectSaga(updateCardSagas, {
    type: CardsSagaActions.UPDATE_CARD_SAGA,
    payload: { cardId: "NOTHING", cardRequest: updatedCard },
  })
    .withReducer(cardsSliceBuilder(formatInitialState()).reducer)
    .put(UPDATE_CARD())
    .put(
      UPDATE_CARD_ERROR({ errorMessage: "Unable to update the card selected" }),
    )
    .hasFinalState({
      value: [cards[0]],
      mapIdToValue: Object.fromEntries(
        [cards[0]].map((card) => {
          return [card._id, card]
        }),
      ),
      fetchStatus: FETCH_STATES.IDLE,
      deleteStatus: FETCH_STATES.IDLE,
      updateStatus: FETCH_STATES.ERROR,
      error: { errorMessage: "Unable to update the card selected" },
    })
    .run({ timeout: false })
})
