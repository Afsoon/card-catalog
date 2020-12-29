import { Layout } from "./ui/layout/App"
import { FormFieldLayout, FormInputsLayout, FormLayout } from "./ui/layout/Form"
import { FormButtons, FormFieldsTitle } from "./ui/components/Form"
import { Field } from "./ui/components/Field/"
import { FETCH_STATES } from "./services/cards/CardsSlice"
import { useCardForm, FormData, ErrorsRecord } from "./hooks/"

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

function App() {
  const {
    fetchStatus,
    onChange,
    onBlur,
    onLeavingClick,
    onSubmit,
    updateStatus,
    formState,
    card,
  } = useCardForm(validateForm)

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
      <FormLayout onSubmit={onSubmit}>
        <FormFieldLayout>
          <FormFieldsTitle onLeavingClick={onLeavingClick}>
            Edit card
          </FormFieldsTitle>

          <FormInputsLayout>
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
          </FormInputsLayout>
        </FormFieldLayout>
        <FormButtons
          disabled={updateStatus === FETCH_STATES.LOADING}
          onLeavingClick={onLeavingClick}
        />
      </FormLayout>
    </Layout>
  )
}

export default App
