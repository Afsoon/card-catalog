import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { useHistory, useLocation } from "react-router-dom"
import { CardsSagaActions } from "../../../services/cards/sagasActions"

const formatSearch = (value: string) => {
  return value ? `?q=${value}` : ""
}

const useInputSearch = () => {
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()
  const onChange = useCallback(
    (event) => {
      dispatch({
        type: CardsSagaActions.INPUT_SEARCH,
        payload: { filter: event.target.value },
      })
      history.replace({
        pathname: "/",
        search: formatSearch(event.target.value),
      })
    },
    [dispatch, history],
  )

  return { onChange, location }
}

export const Layout: React.FC = ({ children }) => {
  const { onChange, location } = useInputSearch()
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-indigo-600 pb-32">
        <nav className="bg-indigo-600 border-b border-indigo-300 border-opacity-25 lg:border-none">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="relative h-16 flex items-center justify-between lg:border-b lg:border-indigo-400 lg:border-opacity-25">
              <div className="px-2 flex items-center lg:px-0">
                <div className="flex-shrink-0">
                  <img
                    className="block h-8 w-8"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-300.svg"
                    alt="Workflow"
                  />
                </div>
              </div>
              {location.pathname === "/" && (
                <div className="flex-1 px-2 flex justify-center lg:ml-6 lg:justify-end">
                  <div className="max-w-lg w-full lg:max-w-xs">
                    <label htmlFor="search" className="sr-only">
                      Search
                    </label>
                    <div className="relative text-gray-400 focus-within:text-gray-600">
                      <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <input
                        id="search"
                        value={
                          new URLSearchParams(location.search).get("q") || ""
                        }
                        onChange={onChange}
                        className="block w-full bg-white py-2 pl-10 pr-3 border border-transparent rounded-md leading-5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white focus:border-white sm:text-sm"
                        placeholder="Search"
                        type="search"
                        name="search"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
        <header className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          </div>
        </header>
      </div>
      <main className="-mt-32">
        <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
