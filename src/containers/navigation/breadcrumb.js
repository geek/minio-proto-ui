import React from 'react';
import paramCase from 'param-case';

import { Breadcrumb, BreadcrumbItem } from 'joyent-ui-toolkit';

export default ({ match }) => {
  const bridge = match && match.params && match.params.bridge;

  const links = [
    {
      name: '/',
      pathname: '/bridges'
    }
  ]
    .concat(
      bridge && [
        {
          name: paramCase(bridge),
          pathname: `/bridges/${bridge}`
        }
      ]
    )
    .filter(Boolean)
    .map(({ name, pathname }) => (
      <BreadcrumbItem key={name} to={pathname}>
        {name}
      </BreadcrumbItem>
    ));

  return <Breadcrumb>{links}</Breadcrumb>;
};
