import React from 'react';
import ReduxForm from 'declarative-redux-form';
import remcalc from 'remcalc';

import { Divider, ViewContainer } from 'joyent-ui-toolkit';

import {
  default as BridgesListTableForm,
  MenuForm as BridgesListMenuForm
} from '@components/bridge/list';

// removed
import _items from '@mocks/bridges.json';

export default () => (
  <ViewContainer main>
    <Divider height={remcalc(30)} transparent />
    <ReduxForm form="bridges-list-menu">{BridgesListMenuForm}</ReduxForm>
    <ReduxForm form="bridges-list-table" items={_items}>
      {BridgesListTableForm}
    </ReduxForm>
  </ViewContainer>
);
