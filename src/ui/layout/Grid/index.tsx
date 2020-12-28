export const GridCardsLayout: React.FC = ({ children }) => {
  return (
    <ul className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {children}
    </ul>
  )
}

export const GridItemLayout: React.FC = ({ children }) => {
  return (
    <li className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200">
      {children}
    </li>
  )
}

export const GridDataLayout: React.FC = ({ children }) => {
  return <div className="flex-1 flex flex-col p-8">{children}</div>
}

export const GridActionsLayout: React.FC = ({ children }) => {
  return (
    <div>
      <div className="-mt-px flex divide-x divide-gray-200">{children}</div>
    </div>
  )
}
