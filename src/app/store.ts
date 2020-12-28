import {
  configureStore,
  ThunkAction,
  Action,
  getDefaultMiddleware,
} from "@reduxjs/toolkit"
import createSagaMiddleware from "redux-saga"
import cardsReducer from "../services/cards/CardsSlice"
import RootSagas from "../services/sagas"

const sagaMiddleware = createSagaMiddleware()
const middleware = [...getDefaultMiddleware({ thunk: false }), sagaMiddleware]

export const store = configureStore({
  reducer: {
    cards: cardsReducer,
  },
  middleware,
})

sagaMiddleware.run(RootSagas)

export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
