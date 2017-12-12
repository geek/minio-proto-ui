import React from 'react';
import { withTheme } from 'styled-components';
import Value from 'react-redux-values';
import titleCase from 'title-case';
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
  StatusLoader,
  DotIcon,
  PopoverContainer,
  PopoverTarget,
  ActionsIcon,
  Popover,
  PopoverItem,
  Message,
  MessageTitle,
  MessageDescription,
  QueryBreakpoints,
  Footer,
  StartIcon,
  StopIcon,
  DeleteIcon
} from 'joyent-ui-toolkit';

const { SmallOnly, Medium } = QueryBreakpoints;

const stateColor = {
  RUNNING: 'green',
  STOPPED: 'grey'
};

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

export const Actions = withTheme(
  ({
    submitting = false,
    allowedActions = {},
    onResume = () => null,
    onStop = () => null,
    onRemove = () => null,
    theme
  }) => (
    <Footer fixed bottom>
      <Row between="xs" middle="xs">
        <Col xs={7}>
          <Value name="bridge-list-resumeing">
            {({ value: stoping }) => [
              <SmallOnly>
                <Button
                  type="button"
                  disabled={!allowedActions.resume}
                  onClick={onResume}
                  secondary
                  small
                  icon
                >
                  <StartIcon disabled={!allowedActions.resume} />
                </Button>
              </SmallOnly>,
              <Medium>
                <Button
                  type="button"
                  disabled={!allowedActions.resume}
                  onClick={onResume}
                  secondary
                  icon
                >
                  <StartIcon disabled={!allowedActions.resume} />
                  <span>Resume</span>
                </Button>
              </Medium>
            ]}
          </Value>
          <Value name="bridge-list-stoping">
            {({ value: stoping }) => [
              <SmallOnly>
                <Button
                  type="button"
                  disabled={!allowedActions.stop}
                  loading={submitting && stoping}
                  onClick={onStop}
                  secondary
                  small
                  icon
                >
                  <StopIcon disabled={!allowedActions.stop} />
                </Button>
              </SmallOnly>,
              <Medium>
                <Button
                  type="button"
                  disabled={!allowedActions.stop}
                  loading={submitting && stoping}
                  onClick={onStop}
                  secondary
                  icon
                >
                  <StopIcon disabled={!allowedActions.stop} />
                  <span>Stop</span>
                </Button>
              </Medium>
            ]}
          </Value>
        </Col>
        <Col xs={5}>
          <Value name="bridge-list-removeing">
            {({ value: removing }) => [
              <SmallOnly key="small-only">
                <Button
                  type="button"
                  onClick={onRemove}
                  disabled={submitting}
                  loading={submitting && removing}
                  error
                  secondary
                  right
                  small
                  icon
                >
                  <DeleteIcon disabled={submitting} fill={theme.red} />
                </Button>
              </SmallOnly>,
              <Medium key="medium">
                <Button
                  type="button"
                  onClick={onRemove}
                  disabled={submitting}
                  loading={submitting && removing}
                  error
                  secondary
                  right
                  icon
                >
                  <DeleteIcon disabled={submitting} fill={theme.red} />
                  <span>Delete</span>
                </Button>
              </Medium>
            ]}
          </Value>
        </Col>
      </Row>
    </Footer>
  )
);

export const Item = ({ id = '', name = '', status = '', onStop, onResume }) => (
  <TableTr>
    <TableTd padding="0" paddingLeft={remcalc(12)} middle left>
      <FormGroup name={id} paddingTop={remcalc(4)} reduxForm>
        <Checkbox />
      </FormGroup>
    </TableTd>
    <TableTd middle left>
      <Anchor to={`/bridges/${name}`}>{name}</Anchor>
    </TableTd>
    <TableTd middle left>
      <Value name={`${id}-mutating`}>
        {({ value: mutating }) =>
          mutating ? (
            <StatusLoader small />
          ) : stateColor[status] ? (
            <span>
              <DotIcon
                width={remcalc(11)}
                height={remcalc(11)}
                borderRadius={remcalc(11)}
                color={stateColor[status]}
              />{' '}
              {titleCase(status)}
            </span>
          ) : (
            <StatusLoader small />
          )
        }
      </Value>
    </TableTd>
    <TableTd xs="0" sm="130" middle left>
      <code>{id.substring(0, 7)}</code>
    </TableTd>
    {['RUNNING', 'STOPPED'].indexOf(status) >= 0 ? (
      <PopoverContainer clickable>
        <TableTd padding="0" hasBorder="left">
          <PopoverTarget box>
            <ActionsIcon />
          </PopoverTarget>
          <Popover placement="right">
            <PopoverItem onClick={onResume} disabled={status !== 'STOPPED'}>
              Resume
            </PopoverItem>
            <PopoverItem onClick={onStop} disabled={status !== 'RUNNING'}>
              Stop
            </PopoverItem>
          </Popover>
        </TableTd>
      </PopoverContainer>
    ) : (
      <TableTd padding="0" hasBorder="left" center middle>
        <ActionsIcon disabled />
      </TableTd>
    )}
  </TableTr>
);

export default ({
  items = [],
  sortBy = 'name',
  sortOrder = 'desc',
  error = null,
  allowedActions = {},
  allSelected = false,
  submitting = false,
  actionable = false,
  onToggleSelectAll = () => null,
  onSortBy = () => null,
  onResume = () => null,
  onStop = () => null,
  onRemove = () => null
}) => (
  <form>
    {error ? (
      <Message error>
        <MessageTitle>Ooops!</MessageTitle>
        <MessageDescription>{error}</MessageDescription>
      </Message>
    ) : null}
    <Table>
      <TableThead>
        <TableTr>
          <TableTh xs="32" padding="0" paddingLeft={remcalc(12)} middle left>
            <FormGroup paddingTop={remcalc(4)}>
              <Checkbox
                checked={allSelected}
                disabled={submitting}
                onChange={onToggleSelectAll}
              />
            </FormGroup>
          </TableTh>
          <TableTh
            onClick={() => onSortBy('name')}
            sortOrder={sortOrder}
            showSort={sortBy === 'name'}
            left
            middle
            actionable
          >
            <span>Name </span>
          </TableTh>
          <TableTh
            xs="150"
            onClick={() => onSortBy('status')}
            sortOrder={sortOrder}
            showSort={sortBy === 'status'}
            left
            middle
            actionable
          >
            <span>Status </span>
          </TableTh>
          <TableTh
            xs="0"
            sm="130"
            onClick={() => onSortBy('id')}
            sortOrder={sortOrder}
            showSort={sortBy === 'id'}
            left
            middle
            actionable
          >
            <span>Short ID </span>
          </TableTh>
          <TableTh xs="60" padding="0" />
        </TableTr>
      </TableThead>
      <TableTbody>
        {items.map(({ id, ...rest }) => (
          <Item
            key={id}
            id={id}
            {...rest}
            onStop={() => onStop({ id })}
            onResume={() => onResume({ id })}
          />
        ))}
      </TableTbody>
    </Table>
    {actionable ? (
      <Actions
        allowedActions={allowedActions}
        submitting={submitting}
        onResume={onResume}
        onStop={onStop}
        onRemove={onRemove}
      />
    ) : null}
  </form>
);
