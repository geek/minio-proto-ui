import { reduxBatch } from '@manaflair/redux-batch';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { ApolloClient, createNetworkInterface } from 'react-apollo';
import { reducer as valuesReducer } from 'react-redux-values';

const {
  REACT_APP_GQL_PORT,
  REACT_APP_GQL_PROTOCOL,
  REACT_APP_GQL_HOSTNAME
} = process.env;

const GLOBAL_FALLBACK = { location: { hostname: '0.0.0.0' } };
const GLOBAL = typeof window === 'object' ? window : GLOBAL_FALLBACK;

const GQL_PORT = REACT_APP_GQL_PORT || 443;
const GQL_PROTOCOL = REACT_APP_GQL_PROTOCOL || 'https';
const GQL_HOSTNAME = REACT_APP_GQL_HOSTNAME || GLOBAL.location.hostname;
const GQL_URL = `${GQL_PROTOCOL}://${GQL_HOSTNAME}:${GQL_PORT}/graphql`;

export const client = new ApolloClient({
  dataIdFromObject: o => {
    const id = o.id
      ? o.id
      : o.slug
        ? o.slug
        : o.uuid
          ? o.uuid
          : o.timestamp
            ? o.timestamp
            : o.name && o.instance
              ? `${o.name}-${o.instance}`
              : o.name
                ? o.name
                : o.time && o.value
                  ? `${o.time}-${o.value}`
                  : 'apollo-cache-key-not-defined';

    return `${o.__typename}:${id}`;
  },
  networkInterface: createNetworkInterface({
    uri: GQL_URL
    // opts: {
    //   credentials: process.env.REACT_APP_GQL_URL ? 'include' : 'same-origin',
    //   headers: {
    //     'X-CSRF-Token': document.cookie.replace(
    //       /(?:(?:^|.*;\s*)crumb\s*=\s*([^;]*).*$)|^.*$/,
    //       '$1'
    //     )
    //   }
    // }
  })
});

export const store = createStore(
  combineReducers({
    values: valuesReducer,
    apollo: client.reducer(),
    form: formReducer,
    ui: (currState = {}) => currState
  }),
  {}, // Initial state
  compose(
    reduxBatch,
    applyMiddleware(client.middleware()),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);
