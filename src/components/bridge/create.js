import React, { PureComponent } from 'react';
import { Field } from 'redux-form';
import remcalc from 'remcalc';

import {
  H4,
  Row,
  Col,
  Card,
  CardOutlet,
  FormLabel,
  FormGroup,
  FormMeta,
  Input,
  Checkbox,
  Textarea,
  Divider,
  Button,
  DuplicateIcon
} from 'joyent-ui-toolkit';

class SshPairForm extends PureComponent {
  render() {
    const { input } = this.props;
    const { value } = input;

    return !value
      ? [
          <Divider key="space" height={remcalc(12)} transparent />,
          <Row key="public">
            <Col xs={12} md={7}>
              <FormGroup name="ssh-public-key" fluid reduxForm>
                <FormLabel>SSH Public Key</FormLabel>
                <Textarea fluid />
                <FormMeta left />
              </FormGroup>
            </Col>
          </Row>,
          <Row key="private">
            <Col xs={12} md={7}>
              <FormGroup name="ssh-private-key" fluid reduxForm>
                <FormLabel>SSH Private Key</FormLabel>
                <Textarea fluid />
                <FormMeta left />
              </FormGroup>
            </Col>
          </Row>
        ]
      : null;
  }
}

export default ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <Row>
      <Col xs={12} sm={12} md={9}>
        <Card>
          <CardOutlet big>
            <Row>
              <Col xs={12} md={7}>
                <FormGroup name="name" fluid reduxForm>
                  <FormLabel>Name</FormLabel>
                  <Input fluid />
                  <FormMeta left />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={7}>
                <FormGroup name="namespace" fluid reduxForm>
                  <FormLabel>Namespace</FormLabel>
                  <Input fluid />
                  <FormMeta left />
                </FormGroup>
              </Col>
            </Row>
            <Divider height={remcalc(16)} transparent />
            <H4>Access</H4>
            <Row>
              <Col xs={12} md={7}>
                <FormGroup name="access-key" fluid reduxForm>
                  <FormLabel>Access Key</FormLabel>
                  <Input fluid disabled />
                  <FormMeta left />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={7}>
                <FormGroup name="secret-key" fluid reduxForm>
                  <FormLabel>Secret Key</FormLabel>
                  <Input fluid disabled />
                  <FormMeta />
                </FormGroup>
              </Col>
            </Row>
            <Divider height={remcalc(16)} transparent />
            <H4>Credentials</H4>
            <Row>
              <Col xs={12} md={7}>
                <FormGroup name="auto-ssh" fluid reduxForm>
                  <Checkbox>
                    <FormLabel>
                      Generate and add SSH keys to your account
                    </FormLabel>
                  </Checkbox>
                </FormGroup>
              </Col>
            </Row>
            <Field name="auto-ssh" component={SshPairForm} />
            <Divider height={remcalc(16)} transparent />
            <Row>
              <Col xs={12}>
                <Button type="submit" icon marginless>
                  <DuplicateIcon light />
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
