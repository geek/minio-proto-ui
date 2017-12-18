import React from 'react';
import { SubmissionError } from 'redux-form';
import ReduxForm from 'declarative-redux-form';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import intercept from 'apr-intercept';
import remcalc from 'remcalc';

import { ViewContainer, Divider } from 'joyent-ui-toolkit';
import BridgeCreateForm from '@components/bridge/create';
import parseError from '@state/parse-error';
import { client } from '@state/store';
import CreatBridge from '@graphql/create-bridge.gql';
import GetBridges from '@graphql/get-bridge.gql';
import DoesBridgeExist from '@graphql/does-bridge-exist.gql';
import ListBridges from '@graphql/list-bridges.gql';

const TABLE_FORM_NAME = 'bridge-create-form';

const Create = ({ shouldAsyncValidate, handleValidate, handleCreate }) => (
  <ViewContainer main>
    <Divider height={remcalc(30)} transparent />
    <ReduxForm
      form={TABLE_FORM_NAME}
      shouldAsyncValidate={shouldAsyncValidate}
      asyncValidate={handleValidate}
      onSubmit={handleCreate}
      initialValues={{ 'directory-map': '/stor/' }}
    >
      {BridgeCreateForm}
    </ReduxForm>
  </ViewContainer>
);

export default compose(
  graphql(CreatBridge, { name: 'create' }),
  connect(null, (dispatch, { history, create, getBridge }) => ({
    shouldAsyncValidate: ({ trigger }) => trigger === 'submit',
    handleValidate: async ({ name, ...values }) => {
      const errors = {};

      if (!name) {
        errors.name = 'Name is required';
      }

      if (!/^[a-zA-Z0-9]+$/.test(name)) {
        errors.name = 'Name must contain only numbers and letters';
        return errors;
      }

      const [err, res] = await intercept(
        client.query({
          query: DoesBridgeExist,
          fetchPolicy: 'network-only',
          variables: { name }
        })
      );
      if (err) {
        return { _error: parseError(err) };
      }

      if (res.data.doesBridgeExist) {
        errors.name = `${name} is not available`;
      }

      return errors;
    },
    handleCreate: async variables => {
      const [err, bridge] = await intercept(
        create({
          update: (proxy, { data: { createBridge: bridge } }) => {
            // Read the data from our cache for the affected queries
            const list = proxy.readQuery({ query: ListBridges });

            // override the cache with the updated bridge
            list.bridges.push(bridge);

            // Write our data back to the cache
            proxy.writeQuery({
              query: GetBridges,
              variables: { name: variables.name },
              data: { bridge }
            });
            proxy.writeQuery({ query: ListBridges, data: list });
          },
          variables: {
            ...variables,
            directoryMap: variables['directory-map'] || ''
          }
        })
      );

      if (err) {
        throw new SubmissionError({
          _error: parseError(err)
        });
      }

      const { data } = bridge;
      const { createBridge } = data;
      const { name } = createBridge;

      return history.push(`/bridges/${name}`);
    }
  }))
)(Create);
