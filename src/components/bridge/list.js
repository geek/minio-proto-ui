import React from 'react';
import { withTheme } from 'styled-components';
import Value from 'react-redux-values';
import titleCase from 'title-case';
import remcalc from 'remcalc';
import styled from 'styled-components';
import { Padding, Margin } from 'styled-components-spacing';
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
  PopoverDivider,
  Message,
  MessageTitle,
  MessageDescription,
  QueryBreakpoints,
  Footer,
  StartIcon,
  StopIcon,
  DeleteIcon,
  Card,
  H3,
  P
} from 'joyent-ui-toolkit';

const Wrapper = styled(Padding)`
  max-width: 50%;
  margin: auto;
  text-align: center;
`;

const SmallButton = styled(Button)`
  margin: 0 5px 5px 0;
`;

const { SmallOnly, Medium } = QueryBreakpoints;

const stateColor = {
  STARTING: 'primary',
  RUNNING: 'green',
  STOPPED: 'grey',
  STOPPING: 'grey',
  REMOVING: 'red'
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
                <SmallButton
                  type="button"
                  disabled={!allowedActions.resume}
                  onClick={onResume}
                  secondary
                  small
                  icon
                >
                  <StartIcon disabled={!allowedActions.resume} />
                </SmallButton>
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
                <SmallButton
                  type="button"
                  disabled={!allowedActions.stop}
                  loading={submitting && stoping}
                  onClick={onStop}
                  secondary
                  small
                  icon
                >
                  <StopIcon disabled={!allowedActions.stop} />
                </SmallButton>
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
                <SmallButton
                  type="button"
                  onClick={onRemove}
                  disabled={!allowedActions.remove}
                  loading={submitting && removing}
                  error
                  secondary
                  right
                  small
                  icon
                >
                  <DeleteIcon disabled={submitting} fill={theme.red} />
                </SmallButton>
              </SmallOnly>,
              <Medium key="medium">
                <Button
                  type="button"
                  onClick={onRemove}
                  disabled={!allowedActions.remove}
                  loading={submitting && removing}
                  error
                  secondary
                  right
                  icon
                >
                  <DeleteIcon
                    disabled={submitting || !allowedActions.remove}
                    fill={allowedActions.remove ? theme.red : undefined}
                  />
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

export const Item = ({
  id = '',
  name = '',
  status = '',
  directoryMap = '',
  onStop,
  onResume,
  onRemove
}) => (
  <TableTr>
    <TableTd padding="0" paddingLeft={remcalc(12)} middle left>
      <FormGroup name={id} paddingTop={remcalc(4)} reduxForm>
        <Checkbox />
      </FormGroup>
    </TableTd>
    <TableTd middle left>
      <Anchor to={`/bridges/${name}`}>{name}</Anchor>
    </TableTd>
    <TableTd middle left xs="0">
      <code>{directoryMap.substring(0, 7)}</code>
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
            <PopoverDivider />
            <PopoverItem
              onClick={onRemove}
              disabled={status !== 'RUNNING' && status !== 'STOPPED'}
            >
              Remove
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

const NotFound = ({ filtering = false }) => (
  <Row middle="xs">
    <Col xs="12">
      <Card>
        <Wrapper top={filtering ? 2 : 5}>
          <H3>
            {filtering ? 'No bridges found for filter :/' : 'No bridges yet?'}
          </H3>
          {!filtering ? (
            <P>
              You haven’t commissioned any bridges yet, but they’re really easy
              to set up. Click below to get going.
            </P>
          ) : null}
          {!filtering ? (
            <Margin top={2}>
              <Button type="submit" to="/bridges/~create">
                Create Bridge
              </Button>
            </Margin>
          ) : null}
        </Wrapper>
      </Card>
    </Col>
  </Row>
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
  filtering = false,
  onToggleSelectAll = () => null,
  onSortBy = () => null,
  onResume = () => null,
  onStop = () => null,
  onRemove = () => null
}) => (
  <form>
    {error ? (
      <Margin vertical={3}>
        <Message error onCloseClick={false}>
          <MessageTitle>Ooops!</MessageTitle>
          <MessageDescription>{error}</MessageDescription>
        </Message>
      </Margin>
    ) : null}
    {(items.length > 0 || filtering) && (
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
              xs="0"
              sm="130"
              onClick={() => onSortBy('directoryMap')}
              sortOrder={sortOrder}
              showSort={sortBy === 'directoryMap'}
              left
              middle
              actionable
            >
              <span>Directory</span>
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
            <TableTh xs="60" padding="0" />
          </TableTr>
        </TableThead>
        <TableTbody>
          {(items.length > 0 || filtering) &&
            items.map(({ id, ...rest }) => (
              <Item
                key={id}
                id={id}
                {...rest}
                onStop={() => onStop({ id })}
                onResume={() => onResume({ id })}
                onRemove={() => onRemove({ id })}
              />
            ))}
        </TableTbody>
      </Table>
    )}
    {!items.length ? <NotFound filtering={filtering} /> : null}
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
