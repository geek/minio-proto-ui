import React from 'react';
import { compose, graphql } from 'react-apollo';
import { set } from 'react-redux-values';
import { connect } from 'react-redux';
import get from 'lodash.get';
import intercept from 'apr-intercept';
import remcalc from 'remcalc';

import {
  Divider,
  ViewContainer,
  StatusLoader,
  Message,
  MessageTitle,
  MessageDescription
} from 'joyent-ui-toolkit';

import BridgeShow from '@components/bridge/show';
import GetBridges from '@graphql/get-bridge.gql';
import StopBridge from '@graphql/stop-bridge.gql';
import ResumeBridge from '@graphql/resume-bridge.gql';
import RemoveBridge from '@graphql/remove-bridge.gql';
import parseError from '@state/parse-error';

const Show = ({
  bridge,
  resuming,
  stopping,
  removing,
  loading = false,
  error = null,
  mutationError = null,
  handleAction
}) => {
  const hasBridge = bridge && Object.keys(bridge).length;

  const _loading =
    loading && !hasBridge ? <StatusLoader key="spinner" /> : null;

  const _error =
    error && !hasBridge && !_loading ? (
      <Message error>
        <MessageTitle>Ooops!</MessageTitle>
        <MessageDescription>
          An error occurred while loading your bridges
        </MessageDescription>
      </Message>
    ) : null;

  const _mutationError = mutationError ? (
    <Message error>
      <MessageTitle>Ooops!</MessageTitle>
      <MessageDescription>{mutationError}</MessageDescription>
    </Message>
  ) : null;

  const _show =
    !_loading && !_error ? (
      <BridgeShow
        {...bridge}
        resuming={resuming}
        stopping={stopping}
        removing={removing}
        onResume={() => handleAction('resume')}
        onStop={() => handleAction('stop')}
        onRemove={() => handleAction('remove')}
      />
    ) : null;

  return (
    <ViewContainer main>
      <Divider height={remcalc(30)} transparent />
      {_error}
      {_mutationError}
      {_loading}
      {_show}
    </ViewContainer>
  );
};

export default compose(
  graphql(StopBridge, { name: 'stop' }),
  graphql(ResumeBridge, { name: 'resume' }),
  graphql(RemoveBridge, { name: 'remove' }),
  graphql(GetBridges, {
    options: ({ match }) => ({
      pollInterval: 1000,
      variables: {
        name: get(match, 'params.bridge')
      }
    }),
    props: ({ data: { bridge = {}, loading, error, refetch, ...data } }) => ({
      bridge,
      loading,
      error,
      refetch
    })
  }),
  connect(
    (state, ownProps) => {
      const { bridge = {} } = ownProps;
      const { id, status } = bridge;

      if (!id) {
        return ownProps;
      }

      const { values = {} } = state;

      return {
        ...ownProps,
        resuming: status === 'STARTING' || values[`${id}-show-resumeing`],
        stopping: status === 'STOPPING' || values[`${id}-show-stoping`],
        removing: values[`${id}-show-removeing`],
        mutationError: state.values[`${id}-show-mutation-error`]
      };
    },
    (disptach, { refetch, ...ownProps }) => ({
      handleAction: async action => {
        const { bridge } = ownProps;
        const { id } = bridge;

        const gerund = `${action}ing`;
        const name = `${id}-show-${gerund}`;

        // sets mutating to true
        disptach(
          set({
            name,
            value: true
          })
        );

        // calls mutation and waits while loading is still true
        const [err] = await intercept(
          ownProps[action]({
            variables: { id }
          })
        );

        if (!err && action === 'delete') {
          const { history } = ownProps;
          return history.push(`/bridges/`);
        }

        // after mutation, sets loading back to false
        const setLoadingFalse = set({
          name,
          value: false
        });

        // if error, sets error value
        const mutationError =
          err &&
          set({
            name: `${id}-show-mutation-error`,
            value: parseError(err)
          });

        // before dispatching the actions and updating all the flags,
        // refresh to attempt to not see the previous status while it transitions
        await refetch();

        return disptach([mutationError, setLoadingFalse].filter(Boolean));
      }
    })
  )
)(Show);
