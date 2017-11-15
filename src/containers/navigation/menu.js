import { connect } from 'react-redux';
import paramCase from 'param-case';
import titleCase from 'title-case';
import isString from 'lodash.isstring';
import get from 'lodash.get';

import { Menu } from '@components/navigation';

export default connect((state, { match }) => {
  const bridgeSlug = get(match, 'params.bridge');
  const allSections = get(state, 'ui.sections');
  const sections = bridgeSlug ? allSections.bridges : [];

  const links = sections
    .map(
      section =>
        !isString(section)
          ? section
          : {
              pathname: paramCase(section),
              name: titleCase(section)
            }
    )
    .map(({ name, pathname }) => ({
      name,
      pathname: `/bridges/${bridgeSlug}/${pathname}`
    }));

  return {
    links
  };
})(Menu);
