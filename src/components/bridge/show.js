import React from 'react';
import { withTheme } from 'styled-components';

import {
  Row,
  Col,
  Card,
  CardOutlet,
  FormLabel,
  Input,
  DeleteIcon,
  Button
} from 'joyent-ui-toolkit';

export default withTheme(({ bridgeId, containerId = [], namespace, username, directoryMap, theme }) => (
  <Row>
    <Col xs={12} sm={12} md={9}>
      <Card>
        <CardOutlet big>
          <Row end="xs">
            <Col xs={12}>
              <Button error bold icon>
                <DeleteIcon fill={theme.red} />
                <span>Delete</span>
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={7}>
              <FormLabel>Id</FormLabel>
              <Input value={bridgeId} fluid />
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={7}>
              <FormLabel>Container Ids</FormLabel>
              {containerId.map((id) => <Input value={id} fluid />)}
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
));
