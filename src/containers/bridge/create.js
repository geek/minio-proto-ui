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
import CreatBridge from '@graphql/create-bridge.gql';

const TABLE_FORM_NAME = 'bridge-create-form';

const Create = ({ shouldAsyncValidate, handleValidate, handleCreate }) => (
  <ViewContainer main>
    <Divider height={remcalc(30)} transparent />
    <ReduxForm
      form={TABLE_FORM_NAME}
      shouldAsyncValidate={shouldAsyncValidate}
      asyncValidate={handleValidate}
      onSubmit={handleCreate}
      initialValues={{ 'directory-map': '*:/stor/*' }}
    >
      {BridgeCreateForm}
    </ReduxForm>
  </ViewContainer>
);

export default compose(
  graphql(CreatBridge, { name: 'create' }),
  connect(null, (dispatch, { history, create }) => ({
    shouldAsyncValidate: ({ trigger }) => trigger === 'submit',
    handleValidate: ({ name, ...values }) => {
      const errors = {};

      if (!name) {
        errors.name = 'Name is required';
      }

      return Promise.resolve(errors);
    },
    handleCreate: async variables => {
      const [err, bridge] = await intercept(
        create({
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
