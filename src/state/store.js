import { reduxBatch } from '@manaflair/redux-batch';
import { createStore, combineReducers, compose } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { ReduxCache, apolloReducer } from 'apollo-cache-redux';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { reducer as valuesReducer } from 'react-redux-values';

const {
  REACT_APP_GQL_PORT,
  REACT_APP_GQL_PROTOCOL,
  REACT_APP_GQL_HOSTNAME
} = process.env;

const GLOBAL_FALLBACK = {
  location: { hostname: '0.0.0.0', protocol: 'http:', port: 8080 }
};
const GLOBAL = typeof window === 'object' ? window : GLOBAL_FALLBACK;

const GQL_PORT = REACT_APP_GQL_PORT || GLOBAL.location.port;
const GQL_PROTOCOL = REACT_APP_GQL_PROTOCOL || GLOBAL.location.protocol;
const GQL_HOSTNAME = REACT_APP_GQL_HOSTNAME || GLOBAL.location.hostname;
const GQL_URL = `${GQL_PROTOCOL}//${GQL_HOSTNAME}:${GQL_PORT}/graphql`;


export const store = createStore(
  combineReducers({
    values: valuesReducer,
    apollo: apolloReducer,
    form: formReducer,
    ui: (currState = {}) => currState
  }),
  {}, // Initial state
  compose(
    ...[
      reduxBatch,
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    ].filter(Boolean)
  )
);

const cache = new ReduxCache({
  store,
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
  }
});

export const client = new ApolloClient({
  cache,
  link: createHttpLink({
    uri: GQL_URL,
    credentials: process.env.REACT_APP_GQL_URL ? 'include' : 'same-origin'
  })
});


