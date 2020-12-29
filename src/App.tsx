import { useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useHistory } from "react-router-dom"
import { Layout } from "./ui/layout/App"
import { GridCardsLayout } from "./ui/layout/Grid"
import { CardsSagaActions } from "./services/cards/sagasActions"
import { AnalyticsSagaActions } from "./services/analytics/sagasActions"
import {
  selectFetchCardsStatus,
  FETCH_STATES,
  selectCards,
  selectFilter,
} from "./services/cards/CardsSlice"

function App() {
  const dispatch = useDispatch()
  const location = useLocation()
  const history = useHistory()
  const filter = useSelector(selectFilter)
  useEffect(() => {
    if (filter) {
      history.replace({
        pathname: "/",
        search: filter ? `?q=${filter}` : "",
      })
    }
    if (fetchStatus === FETCH_STATES.IDLE) {
      dispatch({
        type: CardsSagaActions.FETCH_CARDS_SAGA,
        payload: {
          filter: filter || new URLSearchParams(location.search).get("q") || "",
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const fetchStatus = useSelector(selectFetchCardsStatus)
  const cards = useSelector(selectCards)

  const goToFormClick = useCallback(
    (cardId) => () => {
      dispatch({
        type: AnalyticsSagaActions.SEND_ANALYTICS,
        payload: {
          eventName: "GO_TO_EDIT_FORM",
          eventProperties: {
            cardId,
          },
        },
      })
    },
    [dispatch],
  )

  if (fetchStatus === FETCH_STATES.ERROR) {
    return (
      <Layout>
        <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
          <h3 className="text-4xl text-red-600">
            Unable to load cards, retry more later
          </h3>
        </div>
      </Layout>
    )
  }

  if (cards.length === 0) {
    return (
      <Layout>
        <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
          <h3 className="text-4xl">You don't have any more cards</h3>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <GridCardsLayout
        goToFormClick={goToFormClick}
        items={cards}
        hasNextPage={cards.length < 100000}
        isNextPageLoading={fetchStatus === FETCH_STATES.LOADING}
        loadNextPage={(...args: any[]) => {
          dispatch({
            type: CardsSagaActions.FETCH_CARDS_SAGA,
            payload: {
              filter:
                filter || new URLSearchParams(location.search).get("q") || "",
            },
          })
          return null
        }}
      />
    </Layout>
  )
}

export default App
