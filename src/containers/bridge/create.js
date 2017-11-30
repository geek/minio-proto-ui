import React from 'react';
import ReduxForm from 'declarative-redux-form';
import remcalc from 'remcalc';

import { ViewContainer, Divider } from 'joyent-ui-toolkit';
import BridgeCreateForm from '@components/bridge/create';

export default () => (
  <ViewContainer main>
    <Divider height={remcalc(30)} transparent />
    <ReduxForm form="bridge-create" initialValues={{ 'auto-ssh': true }}>
      {BridgeCreateForm}
    </ReduxForm>
  </ViewContainer>
);
