import React from 'react';
import remcalc from 'remcalc';

import {
  Row,
  Col,
  Anchor,
  FormGroup,
  Input,
  FormLabel,
  Checkbox,
  Button,
  Table,
  TableThead,
  TableTr,
  TableTh,
  TableTd,
  TableTbody,
  ArrowIcon
} from 'joyent-ui-toolkit';

const direction = ({ sortBy, sortOrder, name }) =>
  sortBy === name ? (sortOrder === 'asc' ? 'down' : 'up') : 'down';

export const MenuForm = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <Row>
      <Col xs={7} sm={5}>
        <FormGroup name="filter" fluid reduxForm>
          <FormLabel>Filter bridges</FormLabel>
          <Input placeholder="Search for namespace, directory, etc..." fluid />
        </FormGroup>
      </Col>
      <Col xs={5} sm={7}>
        <FormGroup right>
          <FormLabel>&#8291;</FormLabel>
          <Button type="submit" to="/bridges/~create" small icon fluid>
            Create Bridge
          </Button>
        </FormGroup>
      </Col>
    </Row>
  </form>
);

export const Item = ({ bridgeId = '', name = '', namespace = '' }) => (
  <TableTr>
    <TableTd padding="0" paddingLeft={remcalc(12)} middle left>
      <FormGroup name={bridgeId} paddingTop={remcalc(4)} reduxForm>
        <Checkbox />
      </FormGroup>
    </TableTd>
    <TableTd middle left>
      <Anchor to={`/bridges/${name}`}>{name}</Anchor>
    </TableTd>
    <TableTd middle left>
      {namespace}
    </TableTd>
    <TableTd sm="120" middle left>
      <code>{bridgeId.substring(0, 7)}</code>
    </TableTd>
  </TableTr>
);

export default ({ items = [], sortBy = 'name', sortOrder = 'desc' }) => (
  <form>
    <Table>
      <TableThead>
        <TableTr>
          <TableTh xs="32" padding="0" paddingLeft={remcalc(12)} middle left>
            <FormGroup paddingTop={remcalc(4)}>
              <Checkbox />
            </FormGroup>
          </TableTh>
          <TableTh left middle actionable>
            <span>Name </span>
            <ArrowIcon
              disabled={sortBy !== 'name'}
              direction={direction({ sortBy, sortOrder, name: 'name' })}
            />
          </TableTh>
          <TableTh left middle actionable>
            <span>Namespace </span>
            <ArrowIcon
              disabled={sortBy !== 'namespace'}
              direction={direction({ sortBy, sortOrder, name: 'namespace' })}
            />
          </TableTh>
          <TableTh sm="120" left middle actionable>
            <span>Short ID </span>
            <ArrowIcon
              disabled={sortBy !== 'id'}
              direction={direction({ sortBy, sortOrder, name: 'bridgeId' })}
            />
          </TableTh>
        </TableTr>
      </TableThead>
      <TableTbody>
        {items.map(({ id, ...rest }) => <Item key={id} id={id} {...rest} />)}
      </TableTbody>
    </Table>
  </form>
);
