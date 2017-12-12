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
  ({
    id,
    name,
    namespace,
    username,
    directoryMap,
    status,
    resuming,
    stopping,
    removing,
    onResume,
    onStop,
    onRemove,
    submitting,
    theme
  }) => (
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
                    type="button"
                    disabled={status !== 'STOPPED'}
                    loading={resuming}
                    onClick={onResume}
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
                    type="button"
                    disabled={status !== 'STOPPED'}
                    loading={resuming}
                    onClick={onResume}
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
                    loading={stopping}
                    onClick={onStop}
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
                    type="button"
                    disabled={status !== 'RUNNING'}
                    loading={stopping}
                    onClick={onStop}
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
                    type="button"
                    loading={removing}
                    onClick={onRemove}
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
                  <Button
                    type="button"
                    disabled={stopping || resuming}
                    loading={removing}
                    onClick={onRemove}
                    error
                    bold
                    icon
                    right
                  >
                    <DeleteIcon
                      disabled={stopping || resuming}
                      fill={stopping || resuming ? undefined : theme.red}
                    />
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
