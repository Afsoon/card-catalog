import { FixedSizeList as List } from "react-window"
import InfiniteLoader from "react-window-infinite-loader"
import { DeleteModal } from "../../components/DeleteModal"
import { EditCard } from "../../components/Grid/GridButtons"

export const GridCardsLayout = ({
  hasNextPage,
  isNextPageLoading,
  items,
  loadNextPage,
  goToFormClick,
}) => {
  const itemCount = hasNextPage ? items.length + 1 : items.length
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage

  const isItemLoaded = (index) => !hasNextPage || index < items.length

  const Item = ({ index, style }) => {
    if (!isItemLoaded(index)) {
      return (
        <div
          style={style}
          className="flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200"
        >
          <GridDataLayout>
            <h3 className="mt-6 text-gray-900 text-3xl font-medium">
              Loading...
            </h3>
          </GridDataLayout>
        </div>
      )
    } else {
      const card = items[index]
      return (
        <div
          style={style}
          className="flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200"
        >
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
              to={{ pathname: `/cards/${card._id}` }}
              onClick={goToFormClick(card._id)}
            />
          </GridActionsLayout>
        </div>
      )
    }
  }

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <List
          className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          height={500}
          itemCount={itemCount}
          itemSize={400}
          onItemsRendered={onItemsRendered}
          ref={ref}
          width={300}
        >
          {Item}
        </List>
      )}
    </InfiniteLoader>
  )
}

export const GridDataLayout = ({ children }) => {
  return <div className="flex-1 flex flex-col p-8">{children}</div>
}

export const GridActionsLayout = ({ children }) => {
  return (
    <div>
      <div className="-mt-px flex divide-x divide-gray-200">{children}</div>
    </div>
  )
}
