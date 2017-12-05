import React from 'react';
import { stopSubmit } from 'redux-form';
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
      initialValues={{ 'auto-ssh': true }}
    >
      {BridgeCreateForm}
    </ReduxForm>
  </ViewContainer>
);

export default compose(
  graphql(CreatBridge, { name: 'create' }),
  connect(null, (dispatch, { history, create }) => ({
    shouldAsyncValidate: ({ trigger }) => trigger === 'submit',
    handleValidate: ({ name, namespace, ...values }) => {
      const errors = {};

      if (!name) {
        errors.name = 'Name is required';
      }

      if (!namespace) {
        errors.namespace = 'Namespace is required';
      }

      if (!values['auto-ssh'] && !values['ssh-public-key']) {
        errors['ssh-public-key'] = 'SSH Public Key is required';
      }

      if (!values['auto-ssh'] && !values['ssh-private-key']) {
        errors['ssh-private-key'] = 'SSH Private Key is required';
      }

      console.log(errors);

      // TODO search for existing bridges with the same name

      return Promise.resolve(errors);
    },
    handleCreate: async (variables) => {
      const [err, bridge] = await intercept(create({ variables }));

      if (err) {
        return dispatch(stopSubmit(TABLE_FORM_NAME, {
          _error: parseError(err)
        }));
      }

      return history.push(`/bridges/${bridge.name}`);
    }
  }))
)(Create);
