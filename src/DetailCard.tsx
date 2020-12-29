import * as React from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, Link } from "react-router-dom"
import { Layout } from "./ui/layout/App"
import {
  selectUpdateCardStatus,
  selectFetchCardsStatus,
  FETCH_STATES,
  selectCard,
} from "./services/cards/CardsSlice"
import { CardsSagaActions } from "./services/cards/sagasActions"
import { AnalyticsSagaActions } from "./services/analytics/sagasActions"

interface ErrorsRecord {
  name?: string
  imageUrl?: string
}

interface FormData {
  name?: string
  imageUrl?: string
}

const validateForm = (form: FormData) => {
  const errors: ErrorsRecord = {}
  if (!form.name) {
    errors.name = "Name can't be blank. Please insert a value"
  }
  if (!form.imageUrl) {
    errors.imageUrl = "Image can't be blank. Please insert a value"
  }
  return errors
}

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label: string
  as?: React.ElementType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: Record<string, any>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: () => void
} & React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >

const Field: React.FC<InputProps> = ({
  name = "",
  label,
  children = null,
  required,
  errors = {},
  as = "input",
  onChange,
  onBlur,
  ...props
}) => {
  if (!name) {
    console.error("Provide a name for the input")
  }
  return (
    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
      >
        {label}
      </label>
      <div className="mt-1 sm:mt-0 sm:col-span-2">
        <div className="max-w-lg flex flex-col rounded-md shadow-sm">
          <input
            {...props}
            id={name}
            name={name}
            onChange={onChange}
            onBlur={onBlur}
          />
          {errors[name] && (
            <span className="hidden mt-2 text-sm text-red-600 sm:block">
              {errors[name]}
            </span>
          )}
        </div>
      </div>
      {errors[name] && (
        <span className="mt-2 text-sm text-red-600 sm:hidden">
          {errors[name]}
        </span>
      )}
      {children}
    </div>
  )
}

interface FormState {
  name?: string
  imageUrl?: string
  errors?: ErrorsRecord
}

function App() {
  const dispatch = useDispatch()
  const { cardId } = useParams<{ cardId: string }>()
  const card = useSelector(selectCard(cardId))
  const [formState, setFormState] = React.useState<FormState>({
    errors: {},
    ...(card || { name: "", imageUrl: "" }),
  })
  const updateStatus = useSelector(selectUpdateCardStatus)
  const fetchStatus = useSelector(selectFetchCardsStatus)

  const onChange = React.useCallback(
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
    [formState],
  )

  const onBlur = React.useCallback(() => {
    const { errors, ...formData } = formState
    setFormState({ ...formState, errors: validateForm(formData) })
  }, [formState])

  const leavingClink = React.useCallback(() => {
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

  const onSubmit = React.useCallback(
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

  React.useEffect(() => {
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

  if (!card) {
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
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 h-full overflow-auto space-y-8 divide-y divide-gray-200"
      >
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div>
            <div>
              <Link
                onClick={leavingClink}
                to="/"
                className="mt-3 sm:mt-0 sm:ml-4 border-transparent inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                <svg
                  className="mr-1 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <h2 className="text-2xl ml-2 leading-6 font-medium text-gray-900">
                  Edit card
                </h2>
              </Link>
            </div>

            <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
              <Field
                errors={formState.errors}
                required
                name="name"
                label="Card Name"
                type="text"
                onChange={onChange}
                onBlur={onBlur}
                value={formState.name}
                className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300"
              />
              <Field
                errors={formState.errors}
                required
                name="imageUrl"
                label="Image URL"
                type="text"
                onChange={onChange}
                onBlur={onBlur}
                value={formState.imageUrl}
                className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300"
              />
            </div>
          </div>
        </div>
        <div className="pt-5">
          <div className="flex justify-end">
            <Link
              to="/"
              onClick={leavingClink}
              title="Go back to home page"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </Link>
            <button
              disabled={updateStatus === FETCH_STATES.LOADING}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </Layout>
  )
}

export default App
