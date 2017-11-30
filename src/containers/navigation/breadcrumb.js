import React from 'react';
import paramCase from 'param-case';
import titleCase from 'title-case';
import get from 'lodash.get';

import { Breadcrumb, BreadcrumbItem } from 'joyent-ui-toolkit';

export default ({ match }) => {
  const bridge = get(match, 'params.bridge');
  const action = get(match, 'params.action');

  const links = [{ name: 'Bridges', pathname: '/bridges' }]
    .concat(
      bridge && [
        {
          name: paramCase(bridge.substring(0, 7)),
          pathname: `/bridges/${bridge}`
        }
      ]
    )
    .concat(action && [{ name: titleCase(paramCase(action)) }])
    .filter(Boolean)
    .map(({ name, pathname }) => (
      <BreadcrumbItem key={name} to={pathname}>
        {name}
      </BreadcrumbItem>
    ));

  return <Breadcrumb>{links}</Breadcrumb>;
};
