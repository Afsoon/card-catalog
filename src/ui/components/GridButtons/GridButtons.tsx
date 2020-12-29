import {
  Dialog,
  DialogDisclosure,
  DialogBackdrop,
  DialogStateReturn,
} from "reakit/Dialog"
import { Button } from "reakit"
import { useCallback } from "react"
import { Link } from "react-router-dom"

interface DeleteButtonProps {
  dialog: DialogStateReturn
  titleModal: string
  textModal: string
  errorText?: string
  onClick: () => void
  onClickCancel: () => void
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  dialog,
  onClick,
  children,
  titleModal,
  textModal,
  errorText,
  onClickCancel,
}) => {
  const submitAction = useCallback(() => {
    onClick()
  }, [onClick])
  const cancelAction = useCallback(() => {
    onClickCancel()
    dialog.hide()
  }, [onClickCancel, dialog])

  return (
    <div className="w-0 flex-1 flex">
      <DialogDisclosure
        {...dialog}
        className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {children}
      </DialogDisclosure>
      <DialogBackdrop
        {...dialog}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          ></span>
          &#8203;
          <Dialog
            {...dialog}
            role="alertdialog"
            className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
            aria-labelledby="modal-headline"
          >
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  className="h-6 w-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-headline"
                >
                  {titleModal}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{textModal}</p>
                </div>
                {errorText && (
                  <div className="mt-2">
                    <p className="text-sm text-red-500">{errorText}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:ml-10 sm:pl-4 sm:flex">
              <Button
                onClick={submitAction}
                className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm"
              >
                Delete
              </Button>
              <Button
                onClick={cancelAction}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </Button>
            </div>
          </Dialog>
        </div>
      </DialogBackdrop>
    </div>
  )
}

interface EditCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  to: string | Record<string, any>
  onClick: () => void
}

export const EditCard: React.FC<EditCardProps> = ({ to, onClick }) => {
  return (
    <div className="-ml-px w-0 flex-1 flex">
      <Link
        to={to}
        onClick={onClick}
        className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500"
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
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>

        <span className="ml-3">Edit Card</span>
      </Link>
    </div>
  )
}

export const GridButtonsActions: React.FC = ({ children }) => {
  return (
    <>
      {children}
      <div className="-ml-px w-0 flex-1 flex">
        <a
          href="/"
          className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500"
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>

          <span className="ml-3">Edit Card</span>
        </a>
      </div>
    </>
  )
}
