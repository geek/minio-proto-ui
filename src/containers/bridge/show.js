import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import get from 'lodash.get';
import find from 'lodash.find';
import remcalc from 'remcalc';

import { ViewContainer, Divider } from 'joyent-ui-toolkit';

import BridgeShow from '@components/bridge/show';
// removed
import _items from '@mocks/bridges.json';

const Show = ({ bridge }) => (
  <ViewContainer main>
    <Divider height={remcalc(30)} transparent />
    <BridgeShow {...bridge} />
  </ViewContainer>
);

export default compose(
  connect((state, { match }) => {
    console.log(match);
    return {
      bridge: find(_items, ['bridgeId', get(match, 'params.bridgeId')])
    }
  })
)(Show);
