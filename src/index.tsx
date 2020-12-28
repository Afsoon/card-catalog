import React from "react"
import ReactDOM from "react-dom"
import { Switch, Route } from "react-router-dom"
import { ConnectedRouter } from "connected-react-router"
import "./index.css"
import App from "./App"
import { store, history } from "./app/store"
import { Provider } from "react-redux"
import * as serviceWorker from "./serviceWorker"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { worker } = require("./mocks/browser")
worker.start()

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/cards/:cardId">Something</Route>
          <Route exact path="/">
            <App />
          </Route>
          <Route path="*">Not Found</Route>
        </Switch>
      </ConnectedRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root"),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
