This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />


## Assumptions

- The app has 2 mocked endpoints to simulate external analytics services. This data is saved on the LocalStorage with the keys `analyticsA` and `analyticsB`. The sagas to manage, it execute this fetch without waiting the response. Each saga spawned have a retry policy based on the `exponential backoff` formula.
- I use the same data, to fake a infinite or a very long list of data. The data is displayed on chunk for the following reasons:
  - Performance: The user doesn't have to download a long payload of data.
  - Because an screen can display a maximun number of elements.
- The app assume always the happy path.
- The components design are from TailwindUI, I assume that the design and components are made by another team.


## Techonologies

- Redux Sagas to manage effects.
- Redux Saga test plan to test sagas.
- MockServiceWorker to mock fetchs during test and development
- TailwindCSS and TailwindUI for style
- React Window for virtualize longs list and infinite list
- React Router for manage routes, and Connected React Router
- Typescript
- Reakit for A11y on dialog.
- Jest testing
