import React from 'react';
import { compose, graphql } from 'react-apollo';
import get from 'lodash.get';
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

const Show = ({ bridge, loading = false, error = null }) => {
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

  const _show = !_loading && !_error ? <BridgeShow {...bridge}  /> : null;

  return (
    <ViewContainer main>
      <Divider height={remcalc(30)} transparent />
      {_error}
      {_loading}
      {_show}
    </ViewContainer>
  );
};

export default compose(
  graphql(GetBridges, {
    options: ({ match }) => ({
      pollInterval: 1000,
      variables: {
        name: get(match, 'params.bridge')
      }
    }),
    props: ({
      data: { bridge = {}, loading, error, refetch, ...data }
    }) => ({
      bridge,
      loading,
      error,
      refetch
    })
  })
)(Show);
