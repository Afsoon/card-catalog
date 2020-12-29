import { useState, useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import {
  selectUpdateCardStatus,
  selectFetchCardsStatus,
  FETCH_STATES,
  selectCard,
} from "../services/cards/CardsSlice"
import { CardsSagaActions } from "../services/cards/sagasActions"
import { AnalyticsSagaActions } from "../services/analytics/sagasActions"

export interface ErrorsRecord {
  name?: string
  imageUrl?: string
}

export interface FormState {
  name?: string
  imageUrl?: string
  errors?: ErrorsRecord
}

export interface FormData {
  name?: string
  imageUrl?: string
}

export const useCardForm = (
  validateForm: (data: FormData) => Record<string, any>,
) => {
  const dispatch = useDispatch()
  const { cardId } = useParams<{ cardId: string }>()
  const card = useSelector(selectCard(cardId))
  const [formState, setFormState] = useState<FormState>({
    errors: {},
    ...(card || { name: "", imageUrl: "" }),
  })
  const updateStatus = useSelector(selectUpdateCardStatus)
  const fetchStatus = useSelector(selectFetchCardsStatus)

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { errors, ...newState } = {
        ...formState,
        [e.currentTarget.name]: e.currentTarget.value,
      }
      setFormState({
        ...newState,
        errors: validateForm(newState),
      })
    },
    [formState, validateForm],
  )

  const onBlur = useCallback(() => {
    const { errors, ...formData } = formState
    setFormState({ ...formState, errors: validateForm(formData) })
  }, [formState, validateForm])

  const onLeavingClick = useCallback(() => {
    dispatch({
      type: AnalyticsSagaActions.SEND_ANALYTICS,
      payload: {
        eventName: "LEAVING_CARD_EDIT_FORM",
        eventProperties: {
          cardId,
        },
      },
    })
  }, [dispatch, cardId])

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const { errors, ...formData } = formState
      if (Object.keys(formState.errors || {}).length === 0) {
        dispatch({
          type: CardsSagaActions.UPDATE_CARD_SAGA,
          payload: { cardRequest: formData, cardId },
        })
        dispatch({
          type: AnalyticsSagaActions.SEND_ANALYTICS,
          payload: {
            eventName: "SUBMIT_NEW_CARD_DATA",
            eventProperties: {
              data: formData,
              cardId,
            },
          },
        })
      }
    },
    [dispatch, formState, cardId],
  )

  useEffect(() => {
    if (fetchStatus === FETCH_STATES.IDLE) {
      dispatch({
        type: CardsSagaActions.FETCH_CARDS_SAGA,
      })
    }

    if (fetchStatus === FETCH_STATES.SUCCESS) {
      setFormState({
        name: card.name,
        imageUrl: card.imageUrl,
        errors: undefined,
      })
    }
  }, [fetchStatus, dispatch, card])

  return {
    fetchStatus,
    onChange,
    onBlur,
    onLeavingClick,
    onSubmit,
    updateStatus,
    formState,
    card,
  }
}
