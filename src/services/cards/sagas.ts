import { PayloadAction } from "@reduxjs/toolkit"
import {
  all,
  call,
  put,
  take,
  takeEvery,
  takeLatest,
  delay,
} from "redux-saga/effects"
import { CardsSagaActions } from "./sagasActions"
import { getCards, deleteCard, updateCard } from "./api"
import {
  FETCH_CARDS,
  FETCH_CARDS_SUCCESS,
  FETCH_CARDS_ERROR,
  DELETE_CARD,
  DELETE_CARD_ERROR,
  DELETE_CARD_SUCCESS,
  RESET_DELETE_STATUS,
  UPDATE_CARD,
  UPDATE_CARD_ERROR,
  UPDATE_CARD_SUCCESS,
} from "./CardsSlice"
import { CardUpdateRequest } from "../../types"

async function extractCards(filter: string | undefined) {
  const response = await getCards(filter)

  if (response.status > 399) {
    throw Error("Unable to retrieve the cards")
  }

  const body = await response.json()
  return body.data
}

async function extractDeletedCard(cardId: string) {
  const response = await deleteCard(cardId)

  if (response.status > 499 || response.status === 400) {
    throw Error("Unable to retrieve the cards")
  }

  const body = await response.json()
  return body.data
}

async function extractUpdatedCard(
  cardId: string,
  cardRequest: CardUpdateRequest,
) {
  const response = await updateCard(cardId, cardRequest)

  if (response.status > 399) {
    throw Error("Unable to retrieve the cards")
  }

  const body = await response.json()
  return body.data
}

interface FilterCardsPayload {
  filter?: string | undefined
}

export function* loadCardsSagas({
  payload,
}: PayloadAction<FilterCardsPayload | undefined>) {
  yield put(FETCH_CARDS())
  try {
    const result = yield call(extractCards, payload?.filter)
    yield put(FETCH_CARDS_SUCCESS(result))
  } catch (exception) {
    yield put(FETCH_CARDS_ERROR({ errorMessage: "Unable to load the cards" }))
  }
}

interface DeleteCardPayload {
  cardId: string
}

export function* deleteCardSagas({
  payload,
}: PayloadAction<DeleteCardPayload>) {
  yield put(DELETE_CARD())
  try {
    const result = yield call(extractDeletedCard, payload.cardId)
    yield put(DELETE_CARD_SUCCESS(result))
    yield take(CardsSagaActions.HIDE_DELETE_MODAL)
    yield put(RESET_DELETE_STATUS())
  } catch (exception) {
    yield put(
      DELETE_CARD_ERROR({ errorMessage: "Unable to delete the card selected" }),
    )
  }
}

interface UpdateCardPayload {
  cardId: string
  cardRequest: CardUpdateRequest
}

export function* updateCardSagas({
  payload,
}: PayloadAction<UpdateCardPayload>) {
  yield put(UPDATE_CARD())
  try {
    const result = yield call(
      extractUpdatedCard,
      payload.cardId,
      payload.cardRequest,
    )
    yield put(UPDATE_CARD_SUCCESS(result))
  } catch (exception) {
    yield put(
      UPDATE_CARD_ERROR({ errorMessage: "Unable to update the card selected" }),
    )
  }
}

export function* searchInputSagas({
  payload,
}: PayloadAction<FilterCardsPayload>) {
  delay(1000)
  yield put({ type: CardsSagaActions.FETCH_CARDS_SAGA, payload })
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function* () {
  yield all([
    takeEvery(CardsSagaActions.FETCH_CARDS_SAGA, loadCardsSagas),
    takeEvery(CardsSagaActions.DELETE_CARDS_SAGA, deleteCardSagas),
    takeEvery(CardsSagaActions.UPDATE_CARD_SAGA, updateCardSagas),
    takeLatest(CardsSagaActions.INPUT_SEARCH, loadCardsSagas),
  ])
}
