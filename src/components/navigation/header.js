import React from 'react';
import styled from 'styled-components';
import remcalc from 'remcalc';

import {
  Header,
  HeaderBrand,
  TritonIcon,
  HeaderAnchor,
} from 'joyent-ui-toolkit';

const Logo = styled(TritonIcon)`
  padding-top: ${remcalc(11)};
`;

export default () => (
  <Header fluid>
    <HeaderBrand beta>
      <HeaderAnchor to="/">
        <Logo beta light alt="Triton" />
      </HeaderAnchor>
    </HeaderBrand>
  </Header>
);
