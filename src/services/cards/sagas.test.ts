/* eslint-disable jest/expect-expect */
import { expectSaga } from "redux-saga-test-plan"
import {
  counterSliceBuilder,
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
} from "./CardsSlice"
import { CardsSagaActions } from "./sagasActions"
import { loadCardsSagas, deleteCardSagas, updateCardSagas } from "./sagas"
import { cards } from "../../mocks/cards"

test("Get all cards without filter sagas", () => {
  return expectSaga(loadCardsSagas, {
    payload: { filter: undefined },
    type: CardsSagaActions.FETCH_CARDS_SAGA,
  })
    .withReducer(counterSlice.reducer)
    .put(FETCH_CARDS())
    .put(FETCH_CARDS_SUCCESS(cards))
    .hasFinalState({
      value: cards,
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
    .hasFinalState({
      value: [cards[0]],
      fetchStatus: FETCH_STATES.SUCCESS,
      deleteStatus: FETCH_STATES.IDLE,
      updateStatus: FETCH_STATES.IDLE,
      error: undefined,
    })
    .run({ timeout: false })
})

test("Delete a card sagas", () => {
  return expectSaga(deleteCardSagas, {
    type: CardsSagaActions.DELETE_CARDS_SAGA,
    payload: { cardId: cards[0]._id },
  })
    .withReducer(
      counterSliceBuilder({
        value: cards,
        fetchStatus: FETCH_STATES.IDLE,
        deleteStatus: FETCH_STATES.IDLE,
        updateStatus: FETCH_STATES.IDLE,
        error: undefined,
      }).reducer,
    )
    .put(DELETE_CARD())
    .put(DELETE_CARD_SUCCESS(cards[0]))
    .hasFinalState({
      value: cards.slice(1),
      fetchStatus: FETCH_STATES.IDLE,
      deleteStatus: FETCH_STATES.SUCCESS,
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
    .withReducer(
      counterSliceBuilder({
        value: cards,
        fetchStatus: FETCH_STATES.IDLE,
        deleteStatus: FETCH_STATES.IDLE,
        updateStatus: FETCH_STATES.IDLE,
        error: undefined,
      }).reducer,
    )
    .put(DELETE_CARD())
    .put(
      DELETE_CARD_ERROR({ errorMessage: "Unable to delete the card selected" }),
    )
    .hasFinalState({
      value: cards,
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
    .withReducer(
      counterSliceBuilder({
        value: cards,
        fetchStatus: FETCH_STATES.IDLE,
        deleteStatus: FETCH_STATES.IDLE,
        updateStatus: FETCH_STATES.IDLE,
        error: undefined,
      }).reducer,
    )
    .put(UPDATE_CARD())
    .put(UPDATE_CARD_SUCCESS({ ...cards[0], ...updatedCard }))
    .hasFinalState({
      value: [{ ...cards[0], ...updatedCard }, ...cards.slice(1)],
      fetchStatus: FETCH_STATES.IDLE,
      deleteStatus: FETCH_STATES.IDLE,
      updateStatus: FETCH_STATES.SUCCESS,
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
    .withReducer(
      counterSliceBuilder({
        value: cards,
        fetchStatus: FETCH_STATES.IDLE,
        deleteStatus: FETCH_STATES.IDLE,
        updateStatus: FETCH_STATES.IDLE,
        error: undefined,
      }).reducer,
    )
    .put(UPDATE_CARD())
    .put(
      UPDATE_CARD_ERROR({ errorMessage: "Unable to update the card selected" }),
    )
    .hasFinalState({
      value: cards,
      fetchStatus: FETCH_STATES.IDLE,
      deleteStatus: FETCH_STATES.IDLE,
      updateStatus: FETCH_STATES.ERROR,
      error: { errorMessage: "Unable to update the card selected" },
    })
    .run({ timeout: false })
})
