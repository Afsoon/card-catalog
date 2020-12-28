import { setupServer } from "msw/node"
import { handlers, resetLocalStorage } from "./handlers"

// Setup requests interception using the given handlers.
export const server = setupServer(...handlers)
export const resetData = resetLocalStorage
