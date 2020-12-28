import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import { Card } from "../../types"

export enum FETCH_STATES {
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  IDLE = "IDLE",
}

interface CardsState {
  value: Card[]
  fetchStatus: FETCH_STATES
  deleteStatus: FETCH_STATES
  updateStatus: FETCH_STATES
  error: Record<string, any> | undefined
}

const initialState: CardsState = {
  value: [],
  fetchStatus: FETCH_STATES.IDLE,
  deleteStatus: FETCH_STATES.IDLE,
  updateStatus: FETCH_STATES.IDLE,
  error: undefined,
}

export const counterSliceBuilder = (initialState: CardsState) =>
  createSlice({
    name: "cards",
    initialState,
    reducers: {
      FETCH_CARDS: (state) => {
        state.fetchStatus = FETCH_STATES.LOADING
      },
      DELETE_CARD: (state) => {
        state.deleteStatus = FETCH_STATES.LOADING
      },
      UPDATE_CARD: (state) => {
        state.updateStatus = FETCH_STATES.LOADING
      },
      FETCH_CARDS_ERROR: (
        state,
        action: PayloadAction<Record<string, any>>,
      ) => {
        state.fetchStatus = FETCH_STATES.ERROR
        state.error = action.payload
      },
      DELETE_CARD_ERROR: (
        state,
        action: PayloadAction<Record<string, any>>,
      ) => {
        state.deleteStatus = FETCH_STATES.ERROR
        state.error = action.payload
      },
      UPDATE_CARD_ERROR: (
        state,
        action: PayloadAction<Record<string, any>>,
      ) => {
        state.updateStatus = FETCH_STATES.ERROR
        state.error = action.payload
      },
      FETCH_CARDS_SUCCESS: (state, action: PayloadAction<Card[]>) => {
        state.fetchStatus = FETCH_STATES.SUCCESS
        state.value = action.payload
      },
      DELETE_CARD_SUCCESS: (state, action: PayloadAction<Card>) => {
        state.deleteStatus = FETCH_STATES.SUCCESS
        state.value = state.value.filter(
          (card) => card._id !== action.payload._id,
        )
      },
      UPDATE_CARD_SUCCESS: (state, action: PayloadAction<Card>) => {
        state.updateStatus = FETCH_STATES.SUCCESS
        state.value = state.value.map((card) => {
          if (card._id === action.payload._id) {
            return action.payload
          } else {
            return card
          }
        })
      },
      RESET_DELETE_STATUS: (state) => {
        state.deleteStatus = FETCH_STATES.IDLE
      },
    },
  })

export const counterSlice = counterSliceBuilder(initialState)

export const {
  FETCH_CARDS,
  FETCH_CARDS_ERROR,
  FETCH_CARDS_SUCCESS,
  DELETE_CARD,
  DELETE_CARD_ERROR,
  DELETE_CARD_SUCCESS,
  UPDATE_CARD,
  UPDATE_CARD_ERROR,
  UPDATE_CARD_SUCCESS,
  RESET_DELETE_STATUS,
} = counterSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCards = (state: RootState) => state.cards.value
export const selectFetchCardsStatus = (state: RootState) =>
  state.cards.fetchStatus
export const selectDeleteCardStatus = (state: RootState) =>
  state.cards.deleteStatus

export default counterSlice.reducer
