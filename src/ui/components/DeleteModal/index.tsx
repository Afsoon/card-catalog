import { useDeleteModal } from "../../../hooks"
import { FETCH_STATES } from "../../../services/cards/CardsSlice"
import { DeleteButton } from "../Grid/GridButtons"

interface DeleteModalProps {
  cardId: string
  cardName: string
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  cardId,
  cardName,
}) => {
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
