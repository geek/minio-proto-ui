import { reduxBatch } from '@manaflair/redux-batch';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { ApolloClient, createNetworkInterface } from 'react-apollo';
import { reducer as valuesReducer } from 'react-redux-values';

import state from './state';

const GQL_URL =
  process.env.REACT_APP_GQL_URL || `${window.location.origin}/graphql`;
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
    uri: GQL_URL,
    opts: {
      credentials: process.env.REACT_APP_GQL_URL ? 'include' : 'same-origin',
      headers: {
        'X-CSRF-Token': document.cookie.replace(
          /(?:(?:^|.*;\s*)crumb\s*=\s*([^;]*).*$)|^.*$/,
          '$1'
        )
      }
    }
  })
});

export const store = createStore(
  combineReducers({
    values: valuesReducer,
    apollo: client.reducer(),
    form: formReducer,
    ui: (currState = state.ui) => currState
  }),
  state, // Initial state
  compose(reduxBatch, applyMiddleware(client.middleware()))
);
