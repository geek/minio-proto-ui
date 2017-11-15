import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import { PageContainer } from 'joyent-ui-toolkit';

import { Breadcrumb, Menu } from '@containers/navigation';
import { Header } from '@components/navigation';

import Bridge from '@containers/bridge';

export default () => (
  <BrowserRouter>
    <PageContainer>
      {/* Header */}
      <Route path="*" component={Header} />

      {/* Breadcrumb */}
      <Switch>
        <Route path="/bridges/~:action/:bridge?" exact component={Breadcrumb} />
        <Route path="/bridges/:bridge?" component={Breadcrumb} />
      </Switch>

      {/* Menu */}
      <Switch>
        <Route path="/bridges/~:action/:id?" exact component={Menu} />
        <Route path="/bridges/:bridge?/:section?" component={Menu} />
      </Switch>


      <Route path="/" exact component={() => <Redirect to="/bridges" />} />
    </PageContainer>
  </BrowserRouter>
);
