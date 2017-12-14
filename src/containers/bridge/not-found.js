import React from 'react';
import remcalc from 'remcalc';

import {
  Divider,
  ViewContainer,
  Message,
  MessageTitle,
  MessageDescription
} from 'joyent-ui-toolkit';

export default () => (
  <ViewContainer main>
    <Divider height={remcalc(30)} transparent />
    <Message error onCloseClick={false}>
      <MessageTitle>Ooops!</MessageTitle>
      <MessageDescription>Bridge not found</MessageDescription>
    </Message>
  </ViewContainer>
);
