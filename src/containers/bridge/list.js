import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import forceArray from 'force-array';
import get from 'lodash.get';
import sortBy from 'lodash.sortby';
import find from 'lodash.find';

import {
  reduxForm,
  SubmissionError,
  stopSubmit,
  startSubmit,
  change
} from 'redux-form';

import {
  ViewContainer,
  Title,
  Message,
  MessageDescription,
  MessageTitle
} from 'joyent-ui-toolkit';

import ListInstances from '@graphql/list-instances.gql';
import StopInstance from '@graphql/stop-instance.gql';
import StartInstance from '@graphql/start-instance.gql';
import RebootInstance from '@graphql/reboot-instance.gql';
import ResizeInstance from '@graphql/resize-instance.gql';
import EnableInstanceFw from '@graphql/enable-instance-fw.gql';
import DisableInstanceFw from '@graphql/disable-instance-fw.gql';
import CreateSnapshot from '@graphql/create-snapshot.gql';
import StartSnapshot from '@graphql/start-from-snapshot.gql';

import { List as BridgeList } from '@components/bridge';
import GenIndex from '@state/gen-index';

const BridgeListForm = reduxForm({
  form: `bridge-list`,
  initialValues: {
    sort: 'name'
  }
})(BridgeList);

const List = ({
  selected = [],
  instances = [],
  loading = false,
  error,
  handleAction
}) => {
  const _title = <Title>Instances</Title>;
  const _instances = forceArray(instances);
  const _loading = !instances.length && loading;

  const _error =
    error && !_instances.length && !_loading ? (
      <Message error>
        <MessageTitle>Ooops!</MessageTitle>
        <MessageDescription>
          An error occurred while loading your instances
        </MessageDescription>
      </Message>
    ) : null;

  return (
    <ViewContainer main>
      {_title}
      {!_loading && _error}
      <BridgeListForm
        instances={_instances}
        loading={_loading}
        onAction={handleAction}
        selected={selected}
      />
    </ViewContainer>
  );
};

List.propTypes = {
  loading: PropTypes.bool,
  instances: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    })
  )
};

export default compose(
  graphql(StopInstance, { name: 'stop' }),
  graphql(StartInstance, { name: 'start' }),
  graphql(RebootInstance, { name: 'reboot' }),
  graphql(ResizeInstance, { name: 'resize' }),
  graphql(EnableInstanceFw, { name: 'enableFw' }),
  graphql(DisableInstanceFw, { name: 'disableFw' }),
  graphql(CreateSnapshot, { name: 'createSnapshot' }),
  graphql(StartSnapshot, { name: 'startSnapshot' }),
  graphql(ListInstances, {
    options: () => ({
      pollInterval: 1000
    }),
    props: ({ ownProps, data: { machines, loading, error } }) => {
      const _instances = forceArray(machines);

      return {
        instances: _instances,
        loading,
        error,
        index: GenIndex(_instances)
      };
    }
  }),
  connect(
    (state, ownProps) => {
      const { index, instances = [], ...rest } = ownProps;

      const form = get(state, 'form.bridge-list.values', {});
      const filter = get(form, 'filter');
      const sort = get(form, 'sort');

      const values = filter
        ? index.search(filter).map(({ ref }) => find(instances, ['id', ref]))
        : instances;

      const selected = Object.keys(form)
        .filter(key => Boolean(form[key]))
        .map(name => find(values, ['name', name]))
        .filter(Boolean)
        .map(({ id }) => find(instances, ['id', id]))
        .filter(Boolean);

      return {
        ...rest,
        instances: sortBy(values, value => get(value, sort)),
        selected
      };
    },
    (
      dispatch,
      { stop, start, reboot, enableFw, disableFw, history, location }
    ) => ({
      handleAction: ({ name, items = [] }) => {
        const form = 'bridge-list';

        const types = {
          create: () =>
            Promise.resolve(history.push(`/bridges/~create-bridge`))
        };

        const handleError = error => {
          throw new SubmissionError({
            _error: error.graphQLErrors.map(({ message }) => message).join('\n')
          });
        };

        const handleSuccess = error =>
          dispatch(
            items
              .map(({ name: field }) => change(form, field, false))
              .concat([stopSubmit(form)])
          );

        const fn = types[name];

        return (
          fn &&
          fn()
            .catch(handleError)
            .then(handleSuccess)
        );
      }
    })
  )
)(List);
