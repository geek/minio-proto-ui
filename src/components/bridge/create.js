import React from 'react';
import remcalc from 'remcalc';

import {
  Row,
  Col,
  Card,
  CardOutlet,
  FormLabel,
  FormGroup,
  FormMeta,
  Input,
  Divider,
  Button,
  Message,
  MessageTitle,
  MessageDescription,
  Small,
  DuplicateIcon
} from 'joyent-ui-toolkit';

const Caption = Small.extend`
  color: ${props => props.theme.placeholder};
`;

export default ({
  handleSubmit,
  error = null,
  pristine = true,
  submitting = false
}) => (
  <form onSubmit={handleSubmit}>
    {error ? (
      <Row>
        <Col xs={12}>
          <Message onCloseClick={false} error>
            <MessageTitle>Ooops!</MessageTitle>
            <MessageDescription>{error}</MessageDescription>
          </Message>
        </Col>
      </Row>
    ) : null}
    <Row>
      <Col xs={12} sm={12} md={9}>
        <Card>
          <CardOutlet big>
            <Row>
              <Col xs={12} md={7}>
                <FormGroup name="name" reduxForm>
                  <FormLabel>Name</FormLabel>
                  <Input />
                  <FormMeta left />
                  <Caption>Enter a DNS-compliant name</Caption>
                </FormGroup>
              </Col>
            </Row>
            <Divider transparent height={remcalc(16)} />
            <Row>
              <Col xs={12} md={7}>
                <FormGroup name="directory-map" reduxForm>
                  <FormLabel>Base Directory</FormLabel>
                  <Input />
                  <FormMeta left />
                  <Caption>All subdirectories are available as buckets via S3 API</Caption>
                </FormGroup>
              </Col>
            </Row>
            <Divider height={remcalc(16)} transparent />
            <Row>
              <Col xs={12}>
                <Button
                  type="submit"
                  disabled={pristine}
                  loading={submitting}
                  icon
                  marginless
                >
                  <DuplicateIcon disabled={pristine || submitting} light />
                  <span>Create</span>
                </Button>
              </Col>
            </Row>
          </CardOutlet>
        </Card>
      </Col>
    </Row>
  </form>
);
