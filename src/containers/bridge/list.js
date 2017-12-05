import React from 'react';
import ReduxForm from 'declarative-redux-form';
import { compose, graphql } from 'react-apollo';
import forceArray from 'force-array';
import remcalc from 'remcalc';

import {
  Divider,
  ViewContainer,
  Message,
  MessageTitle,
  MessageDescription,
  StatusLoader
} from 'joyent-ui-toolkit';

import {
  default as BridgesListTableForm,
  MenuForm as BridgesListMenuForm
} from '@components/bridge/list';

import ListBridges from '@graphql/list-bridges.gql';

const TABLE_FORM_NAME = 'bridge-list-table';
const MENU_FORM_NAME = 'bridge-list-menu';

const List = ({
  bridges = [],
  selected = [],
  sortBy = 'name',
  sortOrder = 'desc',
  loading,
  error,
  handleAction,
  toggleSelectAll,
  handleSortBy
}) => {
  const _bridges = forceArray(bridges);

  const _loading =
    loading && !_bridges.length
      ? [
          <Divider key="divider" height={remcalc(30)} transparent />,
          <StatusLoader key="spinner" />
        ]
      : null;

  const _error =
    error && !_bridges.length && !_loading ? (
      <Message error>
        <MessageTitle>Ooops!</MessageTitle>
        <MessageDescription>
          An error occurred while loading your bridges
        </MessageDescription>
      </Message>
    ) : null;

  const _table = !_loading ? (
    <ReduxForm
      form={TABLE_FORM_NAME}
      items={_bridges}
      actionable={selected.length}
      allSelected={_bridges.length && selected.length === _bridges.length}
      sortBy={sortBy}
      sortOrder={sortOrder}
      toggleSelectAll={toggleSelectAll}
      onSortBy={handleSortBy}
      onDelete={({ id } = {}) =>
        handleAction({ name: 'delete', selected: id ? [{ id }] : selected })
      }
    >
      {BridgesListTableForm}
    </ReduxForm>
  ) : null;

  return (
    <ViewContainer main>
      <Divider height={remcalc(30)} transparent />
      <ReduxForm form={MENU_FORM_NAME} searchable={!_loading}>
        {BridgesListMenuForm}
      </ReduxForm>
      {_error}
      {_loading}
      {_table}
    </ViewContainer>
  );
};

export default compose(
  graphql(ListBridges, {
    options: () => ({
      pollInterval: 1000
    }),
    props: ({ data: { bridges, loading, error, refetch } }) => ({
      bridges,
      loading,
      error,
      refetch
    })
  })
)(List);
