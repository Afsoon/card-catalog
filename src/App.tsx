import { useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useHistory } from "react-router-dom"
import { Layout } from "./ui/layout/App"
import {
  GridCardsLayout,
  GridActionsLayout,
  GridDataLayout,
  GridItemLayout,
} from "./ui/layout/Grid"
import { DeleteButton, EditCard } from "./ui/components/GridButtons/GridButtons"
import { CardsSagaActions } from "./services/cards/sagasActions"
import { AnalyticsSagaActions } from "./services/analytics/sagasActions"
import {
  selectFetchCardsStatus,
  FETCH_STATES,
  selectCards,
  selectFilter,
} from "./services/cards/CardsSlice"
import { useDeleteModal } from "./hooks"

interface DeleteModalProps {
  cardId: string
  cardName: string
}

const DeleteModal: React.FC<DeleteModalProps> = ({ cardId, cardName }) => {
  const { dialog, fetchStatus, onClick, onClickCancel } = useDeleteModal(cardId)

  return (
    <DeleteButton
      dialog={dialog}
      onClick={onClick}
      onClickCancel={onClickCancel}
      errorText={
        fetchStatus === FETCH_STATES.ERROR
          ? "Unable to delete the card. Try more later"
          : undefined
      }
      titleModal={`Delete ${cardName} from the catalog`}
      textModal="Are you sure want to delete this card?. This action can't
      be undone."
    >
      <svg
        className="w-5 h-5 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
      <span className="ml-3">Delete Card</span>
    </DeleteButton>
  )
}

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

  if (fetchStatus === FETCH_STATES.LOADING) {
    return (
      <Layout>
        <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
          <h3 className="text-4xl">Loading...</h3>
        </div>
      </Layout>
    )
  }

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
      <GridCardsLayout>
        {cards.map((card, idx) => {
          return (
            <GridItemLayout key={card._id}>
              <GridDataLayout>
                <img
                  className="w-imgWidth h-imgHeight flex-shrink-0 mx-auto bg-black "
                  src={card.imageUrl}
                  alt=""
                  loading="lazy"
                />
                <h3 className="mt-6 text-gray-900 text-sm font-medium">
                  {card.name}
                </h3>
              </GridDataLayout>
              <GridActionsLayout>
                <DeleteModal cardId={card._id} cardName={card.name} />
                <EditCard
                  to={{ pathname: `/cards/${card._id}`, state: { idx } }}
                  onClick={goToFormClick(card._id)}
                />
              </GridActionsLayout>
            </GridItemLayout>
          )
        })}
      </GridCardsLayout>
    </Layout>
  )
}

export default App
