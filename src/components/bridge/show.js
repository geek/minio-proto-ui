import React, { Component } from 'react';
import { withTheme } from 'styled-components';
import { Margin } from 'styled-components-spacing';
import remcalc from 'remcalc';
import titleCase from 'title-case';
import copy from 'clipboard-copy';
import styled from 'styled-components';
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
  DotIcon,
  ClipboardIcon,
  Small,
  TooltipContainer,
  TooltipTarget,
  Tooltip
} from 'joyent-ui-toolkit';

const Caption = Small.extend`
  color: ${props => props.theme.placeholder};
`;

const { SmallOnly, Medium } = QueryBreakpoints;

const stateColor = {
  STARTING: 'primary',
  RUNNING: 'green',
  STOPPING: 'grey',
  STOPPED: 'grey',
  REMOVING: 'red'
};

const transitionalStatuses = ['STARTING', 'STOPPING', 'REMOVING'];

const InputIconWrapper = styled.div`
  display: flex;
  margin-bottom: ${remcalc(10)};
  flex-direction: column;
  align-items: flex-end;
  height: ${remcalc(48)};
  padding-bottom: ${remcalc(8)};

  input {
    padding-right: ${remcalc(30)};
  }

  div {
    top: ${remcalc(-41)};
    position: relative;
    right: ${remcalc(12)};
    max-width: 150px;
    text-align: center;
  }
`;

const ClipboardIconActionable = styled(ClipboardIcon)`
  cursor: pointer;
`;

class CopyToClipboardTooltip extends Component {
  constructor() {
    super();

    this.state = {
      copied: false
    };
  }

  handleClick = () => {
    const { children: text } = this.props;

    copy(text);

    this.setState(
      {
        copied: true
      },
      () => {
        setTimeout(() => {
          this.setState({
            copied: false
          });
        }, 4000);
      }
    );
  };

  render = () => (
    <TooltipContainer hoverable>
      <TooltipTarget>
        <ClipboardIconActionable onClick={this.handleClick} />
      </TooltipTarget>
      <Tooltip placement="top" success={Boolean(this.state.copied)}>
        {this.state.copied ? 'Copied To Clipboard' : 'Copy To Clipboard'}
      </Tooltip>
    </TooltipContainer>
  );
}

export default withTheme(
  ({
    id,
    name,
    namespace,
    username,
    sshKeyId,
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
  }) => {
    const isTransitioning =
      transitionalStatuses.includes(status) || removing || resuming || stopping;

    return (
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
                      disabled={status !== 'STOPPED' || isTransitioning}
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
                      <StartIcon
                        disabled={status !== 'STOPPED' || isTransitioning}
                      />
                      <span>Resume</span>
                    </Button>
                  </Medium>
                  <SmallOnly>
                    <Button
                      type="button"
                      disabled={status !== 'RUNNING' || isTransitioning}
                      loading={stopping}
                      onClick={onStop}
                      secondary
                      bold
                      small
                      icon
                    >
                      <StopIcon
                        disabled={status !== 'RUNNING' || isTransitioning}
                      />
                    </Button>
                  </SmallOnly>
                  <Medium>
                    <Button
                      type="button"
                      disabled={status !== 'RUNNING' || isTransitioning}
                      loading={stopping}
                      onClick={onStop}
                      secondary
                      bold
                      icon
                    >
                      <StopIcon
                        disabled={status !== 'RUNNING' || isTransitioning}
                      />
                      <span>Stop</span>
                    </Button>
                  </Medium>
                </Col>
                <Col xs={3}>
                  <SmallOnly>
                    <Button
                      type="button"
                      disabled={isTransitioning}
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
                      disabled={isTransitioning}
                      loading={removing}
                      onClick={onRemove}
                      error
                      bold
                      icon
                      right
                    >
                      <DeleteIcon
                        disabled={isTransitioning}
                        fill={isTransitioning ? undefined : theme.red}
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
                  <FormLabel>Access Key</FormLabel>
                  <Input readonly value={username} fluid />
                  <Caption>This is the "access key" for S3 clients</Caption>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={7}>
                  <Margin top={4}>
                    <FormLabel>Secret Key</FormLabel>
                  </Margin>
                  <InputIconWrapper>
                    <Input readonly value={sshKeyId} fluid />
                    <CopyToClipboardTooltip>{sshKeyId}</CopyToClipboardTooltip>
                  </InputIconWrapper>
                  <Caption>This is the "secret key" for S3 clients</Caption>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={7}>
                  <Margin top={4}>
                    <FormLabel>Endpoint</FormLabel>
                  </Margin>
                  <InputIconWrapper>
                    <Input readonly value={namespace} fluid />
                    <CopyToClipboardTooltip>{namespace}</CopyToClipboardTooltip>
                  </InputIconWrapper>
                  <Caption>
                    The S3 v4-compatible endpoint for S3 clients
                  </Caption>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={7}>
                  <Margin top={4}>
                    <FormLabel>Base Directory</FormLabel>
                  </Margin>
                  <Input value={directoryMap} fluid />
                  <Caption>
                    All subdirectories at this directory are available as
                    buckets to S3 clients
                  </Caption>
                </Col>
              </Row>
            </CardOutlet>
          </Card>
        </Col>
      </Row>
    );
  }
);
