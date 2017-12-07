import React from 'react';
import { withTheme } from 'styled-components';
import { Margin } from 'styled-components-spacing';
import remcalc from 'remcalc';
import titleCase from 'title-case';

import {
  Row,
  Col,
  Card,
  CardOutlet,
  FormLabel,
  Input,
  Button,
  H2,
  Divider,
  QueryBreakpoints,
  DeleteIcon,
  StopIcon,
  StartIcon,
  DotIcon
} from 'joyent-ui-toolkit';

const { SmallOnly, Medium } = QueryBreakpoints;

const stateColor = {
  STARTING: 'primary',
  RUNNING: 'green',
  STOPPING: 'grey',
  STOPPED: 'grey'
};

export default withTheme(
  ({ id, name, namespace, username, directoryMap, status, theme }) => (
    <Row>
      <Col xs={12} sm={12} md={9}>
        <Card>
          <CardOutlet big>
            <Row middle="xs">
              <Col xs={12}>
                <H2>{name}</H2>
              </Col>
            </Row>
            <Margin top={2} bottom={3}>
              <Row middle="xs">
                <Col xs={12}>
                  <DotIcon
                    borderRadius="50%"
                    marginRight={remcalc(6)}
                    marginTop={remcalc(1)}
                    width={remcalc(11)}
                    height={remcalc(11)}
                    color={stateColor[status]}
                  />
                  {titleCase(status)}
                </Col>
              </Row>
            </Margin>
            <Row>
              <Col xs={9}>
                <SmallOnly>
                  <Button
                    disabled={status !== 'STOPPED'}
                    loading={status === 'STARTING'}
                    secondary
                    bold
                    small
                    icon
                  >
                    <StartIcon disabled={status !== 'STOPPED'} />
                  </Button>
                </SmallOnly>
                <Medium>
                  <Button
                    disabled={status !== 'STOPPED'}
                    loading={status === 'STARTING'}
                    secondary
                    bold
                    icon
                  >
                    <StartIcon disabled={status !== 'STOPPED'} />
                    <span>Resume</span>
                  </Button>
                </Medium>
                <SmallOnly>
                  <Button
                    type="button"
                    disabled={status !== 'RUNNING'}
                    loading={status === 'STOPPING'}
                    secondary
                    bold
                    small
                    icon
                  >
                    <StopIcon disabled={status !== 'RUNNING'} />
                  </Button>
                </SmallOnly>
                <Medium>
                  <Button
                    disabled={status !== 'RUNNING'}
                    loading={status === 'STOPPING'}
                    secondary
                    bold
                    icon
                  >
                    <StopIcon disabled={status !== 'RUNNING'} />
                    <span>Stop</span>
                  </Button>
                </Medium>
              </Col>
              <Col xs={3}>
                <SmallOnly>
                  <Button
                    loading={status === 'REMOVING'}
                    error
                    bold
                    icon
                    small
                    right
                  >
                    <DeleteIcon fill={theme.red} />
                  </Button>
                </SmallOnly>
                <Medium>
                  <Button loading={status === 'REMOVING'} error bold icon right>
                    <DeleteIcon fill={theme.red} />
                    <span>Delete</span>
                  </Button>
                </Medium>
              </Col>
            </Row>
            <Divider
              height={remcalc(1)}
              marginTop={remcalc(4)}
              marginBottom={remcalc(12)}
            />
            <Row>
              <Col xs={12} md={7}>
                <FormLabel>Id</FormLabel>
                <Input value={id} fluid />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={7}>
                <FormLabel>Username</FormLabel>
                <Input value={username} fluid />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={7}>
                <FormLabel>Namespace</FormLabel>
                <Input value={namespace} fluid />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={7}>
                <FormLabel>Directory Map</FormLabel>
                <Input value={directoryMap} fluid />
              </Col>
            </Row>
          </CardOutlet>
        </Card>
      </Col>
    </Row>
  )
);
