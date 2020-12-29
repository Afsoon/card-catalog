import { useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useDialogState } from "reakit/Dialog"
import { CardsSagaActions } from "../services/cards/sagasActions"
import { AnalyticsSagaActions } from "../services/analytics/sagasActions"
import {
  selectDeleteCardStatus,
  FETCH_STATES,
} from "../services/cards/CardsSlice"

export const useDeleteModal = (cardId: string) => {
  const dialog = useDialogState()
  const dispatch = useDispatch()
  const fetchStatus = useSelector(selectDeleteCardStatus)

  const onClick = useCallback(() => {
    dispatch({ type: CardsSagaActions.DELETE_CARDS_SAGA, payload: { cardId } })
    dispatch({
      type: AnalyticsSagaActions.SEND_ANALYTICS,
      payload: {
        eventName: "DELETE_CARD_MODAL",
        eventProperties: {
          cardId,
        },
      },
    })
  }, [dispatch, cardId])

  const onClickCancel = useCallback(() => {
    dispatch({
      type: AnalyticsSagaActions.SEND_ANALYTICS,
      payload: {
        eventName: "CANCEL_DELETE_CARD_MODAL",
        eventProperties: {
          cardId,
        },
      },
    })
  }, [dispatch, cardId])

  useEffect(() => {
    if (fetchStatus === FETCH_STATES.SUCCESS) {
      dispatch({ type: CardsSagaActions.HIDE_DELETE_MODAL })
      dialog.hide()
    }
  }, [fetchStatus, dialog, dispatch])

  if (fetchStatus === FETCH_STATES.ERROR) {
    // TODO Mostrar el mensaje de error
  }

  return { dialog, fetchStatus, onClick, onClickCancel }
}
