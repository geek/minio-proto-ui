import React from 'react';
import ReduxForm from 'declarative-redux-form';
import { change, startSubmit, stopSubmit, reset } from 'redux-form';
import { connect } from 'react-redux';
import { set } from 'react-redux-values';
import { compose, graphql } from 'react-apollo';
import forceArray from 'force-array';
import get from 'lodash.get';
import sort from 'lodash.sortby';
import find from 'lodash.find';
import intercept from 'apr-intercept';
import remcalc from 'remcalc';
import { Padding } from 'styled-components-spacing';
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
import StopBridge from '@graphql/stop-bridge.gql';
import ResumeBridge from '@graphql/resume-bridge.gql';
import RemoveBridge from '@graphql/remove-bridge.gql';
import Index from '@state/gen-index';
import parseError from '@state/parse-error';

const TABLE_FORM_NAME = 'bridge-list-table';
const MENU_FORM_NAME = 'bridge-list-menu';

const List = ({
  bridges = [],
  selected = [],
  allowedActions = {},
  sortBy = 'name',
  sortOrder = 'desc',
  loading = false,
  error = null,
  filtering = false,
  handleToggleSelectAll,
  handleSortBy,
  handleAction
}) => {
  const _bridges = forceArray(bridges);

  const _loading =
    loading && !_bridges.length
      ? [
          <Divider key="divider" height={remcalc(30)} transparent />,
          <StatusLoader key="spinner" />
        ]
      : null;

  const _menu =
    (!_loading && _bridges.length) || filtering ? (
      <ReduxForm form={MENU_FORM_NAME} destroyOnUnmount={false}>
        {BridgesListMenuForm}
      </ReduxForm>
    ) : null;

  const _error =
    error && !_bridges.length && !_loading ? (
      <Padding vertical={3}>
        <Message error>
          <MessageTitle>Ooops!</MessageTitle>
          <MessageDescription>
            An error occurred while loading your bridges
          </MessageDescription>
        </Message>
      </Padding>
    ) : null;

  const _table = !_loading ? (
    <ReduxForm
      form={TABLE_FORM_NAME}
      items={_bridges}
      filtering={filtering}
      actionable={selected.length}
      allowedActions={allowedActions}
      allSelected={_bridges.length && selected.length === _bridges.length}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onToggleSelectAll={handleToggleSelectAll}
      onSortBy={handleSortBy}
      onRemove={({ id } = {}) =>
        handleAction({ name: 'remove', selected: id ? [{ id }] : selected })
      }
      onStop={({ id } = {}) =>
        handleAction({ name: 'stop', selected: id ? [{ id }] : selected })
      }
      onResume={({ id } = {}) =>
        handleAction({ name: 'resume', selected: id ? [{ id }] : selected })
      }
    >
      {BridgesListTableForm}
    </ReduxForm>
  ) : null;

  return (
    <ViewContainer main>
      <Divider height={remcalc(30)} transparent />
      {_menu}
      {_error}
      {_loading}
      {_table}
    </ViewContainer>
  );
};

export default compose(
  graphql(StopBridge, { name: 'stop' }),
  graphql(ResumeBridge, { name: 'resume' }),
  graphql(RemoveBridge, { name: 'remove' }),
  graphql(ListBridges, {
    options: () => ({
      pollInterval: 1000
    }),
    props: ({ data: { bridges = [], loading, error, refetch, ...data } }) => ({
      bridges,
      index: Index(bridges),
      loading,
      error,
      refetch
    })
  }),
  connect(
    ({ form, values }, { index, bridges = [], ownProps }) => {
      // get search value
      const filter = get(form, `${MENU_FORM_NAME}.values.filter`, false);
      // check checked items ids
      const checked = get(form, `${TABLE_FORM_NAME}.values`, {});
      // get sort values
      const sortBy = get(values, 'bridge-list-sort-by', 'name');
      const sortOrder = get(values, 'bridge-list-sort-order', 'asc');

      // if user is searching something, get items that match that query
      const filtered = filter
        ? index.search(filter).map(({ ref }) => find(bridges, ['id', ref]))
        : bridges;

      // from filtered bridges, sort asc
      const ascSorted = sort(filtered, [sortBy]);

      // if "select-all" is checked, all the bridges are selected
      // otherwise, map through the checked ids and get the instance value
      const selected = Object.keys(checked)
        .filter(id => Boolean(checked[id]))
        .map(id => find(ascSorted, ['id', id]))
        .filter(Boolean);

      const allowedActions = {
        resume: selected.some(({ status }) => status === 'STOPPED'),
        stop: selected.some(({ status }) => status === 'RUNNING')
      };

      return {
        // is sortOrder !== asc, reverse order
        bridges: sortOrder === 'asc' ? ascSorted : ascSorted.reverse(),
        filtering: Boolean(filter),
        allowedActions,
        selected,
        index,
        sortOrder,
        sortBy
      };
    },
    (dispatch, { refetch, ...ownProps }) => ({
      handleAction: async ({ selected, name }) => {
        const action = ownProps[name];
        const gerund = `${name}ing`;

        // flips submitting flag to true so that we can disable everything
        const flipSubmitTrue = startSubmit(TABLE_FORM_NAME);

        // sets (removing/stopping/etc) to true so that we can, for instance,
        // have a spinner on the correct button
        const setIngTrue = set({
          name: `bridge-list-${gerund}`,
          value: true
        });

        // sets the individual item mutation flags so that we can show a
        // spinner in the row
        const setMutatingTrue = selected.map(({ id }) =>
          set({ name: `${id}-mutating`, value: true })
        );

        // wait for everything to finish and catch the error
        const [err] = await intercept(
          Promise.resolve(
            dispatch([flipSubmitTrue, setIngTrue, ...setMutatingTrue])
          ).then(() => {
            // starts all the mutations for all the selected items
            return Promise.all(
              selected.map(({ id }) => action({ variables: { id } }))
            );
          })
        );

        // reverts submitting flag to false and propagates the error if it exists
        const flipSubmitFalse = stopSubmit(TABLE_FORM_NAME, {
          _error: err && parseError(err)
        });

        // if no error, clears selected
        const clearSelected = !err && reset(TABLE_FORM_NAME);

        // reverts (starting/restarting/etc) to false
        const setIngFalse = set({
          name: `bridge-list-${gerund}`,
          value: false
        });

        // reverts the individual item mutation flags
        const setMutatingFalse = selected.map(({ id }) =>
          set({ name: `${id}-mutating`, value: false })
        );

        const actions = [
          flipSubmitFalse,
          clearSelected,
          setIngFalse,
          ...setMutatingFalse
        ].filter(Boolean);

        // before dispatching the actions and updating all the flags,
        // refresh to attempt to not see the previous status while it transitions
        await refetch();

        return Promise.resolve(dispatch(actions));
      },
      handleSortBy: ({ sortBy: currentSortBy, sortOrder }) => newSortBy => {
        // sort prop is the same, toggle
        if (currentSortBy === newSortBy) {
          return dispatch(
            set({
              name: `bridge-list-sort-order`,
              value: sortOrder === 'desc' ? 'asc' : 'desc'
            })
          );
        }

        dispatch([
          set({
            name: `bridge-list-sort-order`,
            value: 'desc'
          }),
          set({
            name: `bridge-list-sort-by`,
            value: newSortBy
          })
        ]);
      },
      handleToggleSelectAll: ({ selected = [], bridges = [] }) => () => {
        const same = selected.length === bridges.length;
        const hasSelected = selected.length > 0;

        // none are selected, toggle to all
        if (!hasSelected) {
          return dispatch(
            bridges.map(({ id }) => change(TABLE_FORM_NAME, id, true))
          );
        }

        // all are selected, toggle to none
        if (hasSelected && same) {
          return dispatch(
            bridges.map(({ id }) => change(TABLE_FORM_NAME, id, false))
          );
        }

        // some are selected, toggle to all
        if (hasSelected && !same) {
          return dispatch(
            bridges.map(({ id }) => change(TABLE_FORM_NAME, id, true))
          );
        }
      }
    }),
    (stateProps, dispatchProps, ownProps) => {
      const { selected, bridges, sortBy, sortOrder } = stateProps;
      const { handleToggleSelectAll, handleSortBy } = dispatchProps;

      return {
        ...ownProps,
        ...stateProps,
        selected,
        bridges,
        ...dispatchProps,
        handleToggleSelectAll: handleToggleSelectAll({ selected, bridges }),
        handleSortBy: handleSortBy({ sortBy, sortOrder })
      };
    }
  )
)(List);
