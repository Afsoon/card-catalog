import {
  configureStore,
  ThunkAction,
  Action,
  getDefaultMiddleware,
  Reducer,
} from "@reduxjs/toolkit"
import createSagaMiddleware from "redux-saga"
import {
  connectRouter,
  RouterState,
  routerMiddleware,
} from "connected-react-router"
import { createBrowserHistory, LocationState } from "history"
import cardsReducer from "../services/cards/CardsSlice"
import RootSagas from "../services/sagas"

export const history = createBrowserHistory()
const sagaMiddleware = createSagaMiddleware()
const middleware = [
  ...getDefaultMiddleware({ thunk: false }),
  sagaMiddleware,
  routerMiddleware(history),
]

export const store = configureStore({
  reducer: {
    cards: cardsReducer,
    router: (connectRouter(history) as any) as Reducer<
      RouterState<LocationState>
    >,
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
