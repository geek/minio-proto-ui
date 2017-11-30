import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import { PageContainer } from 'joyent-ui-toolkit';

import { Breadcrumb } from '@containers/navigation';
import { Header } from '@components/navigation';

import {
  List as BridgeList,
  Show as BridgeShow,
  Create as BridgeCreate
} from '@containers/bridge';

export default () => (
  <BrowserRouter>
    <PageContainer>
      {/* Header */}
      <Route path="*" component={Header} />

      {/* Breadcrumb */}
      <Switch>
        <Route path="/bridges/~:action" component={Breadcrumb} />
        <Route path="/bridges/:bridge?" component={Breadcrumb} />
      </Switch>

      {/* Bridges */}
      <Switch>
        <Route path="/bridges" exact component={BridgeList} />
        <Route path="/bridges/~create" exact component={BridgeCreate} />
        <Route path="/bridges/:bridge" exact component={BridgeShow} />
      </Switch>

      <Route path="/" exact component={() => <Redirect to="/bridges" />} />
    </PageContainer>
  </BrowserRouter>
);
