import { Link } from "react-router-dom"

interface FormButtonsProps {
  disabled: boolean
  onLeavingClick: () => void
}

export const FormButtons: React.FC<FormButtonsProps> = ({
  disabled,
  onLeavingClick,
}) => {
  return (
    <div className="pt-5">
      <div className="flex justify-end">
        <Link
          to="/"
          onClick={onLeavingClick}
          title="Go back to home page"
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </Link>
        <button
          disabled={disabled}
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save
        </button>
      </div>
    </div>
  )
}

interface FormFieldsTitleProps {
  onLeavingClick: () => void
}

export const FormFieldsTitle: React.FC<FormFieldsTitleProps> = ({
  children,
  onLeavingClick,
}) => {
  return (
    <div>
      <Link
        onClick={onLeavingClick}
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
          {children}
        </h2>
      </Link>
    </div>
  )
}
