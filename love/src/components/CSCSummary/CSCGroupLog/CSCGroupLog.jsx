import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CSCGroupLog.module.css';
import BackArrowIcon from '../../icons/BackArrowIcon/BackArrowIcon';
import CSCDetailContainer from '../CSCDetail/CSCDetail.container';
import Button from '../../GeneralPurpose/Button/Button';

export default class CSCGroupLog extends Component {
  static propTypes = {
    name: PropTypes.string,
    group: PropTypes.string,
    realm: PropTypes.string,
    data: PropTypes.object,
    onCSCClick: PropTypes.func,
    hierarchy: PropTypes.object,
    clearCSCErrorCodes: PropTypes.func,
    clearCSCLogMessages: PropTypes.func,
    subscribeToStream: PropTypes.func,
    errorCodeData: PropTypes.array,
    embedded: PropTypes.bool,
  };

  static defaultProps = {
    name: '',
    group: '',
    realm: '',
    data: {},
    onCSCClick: () => 0,
    hierarchy: {},
    clearCSCErrorCodes: () => 0,
    clearCSCLogMessages: () => 0,
    errorCodeData: [],
    embedded: false,
  };

  componentDidMount = () => {
    if (this.props.hierarchy[this.props.realm]) {
      this.props.hierarchy[this.props.realm][this.props.group].forEach(({ name, salindex }) => {
        this.props.subscribeToStream(name, salindex);
      });
    } else if (this.props.cscList) {
      this.props.cscList.forEach(({ name, salindex }) => {
        this.props.subscribeToStream(name, salindex);
      });
    }
  };

  clearGroupErrorCodes = () => {
    if (this.props.hierarchy[this.props.realm]) {
      this.props.hierarchy[this.props.realm][this.props.group].forEach(({ name, salindex }) => {
        this.props.clearCSCErrorCodes(name, salindex);
      });
    } else if (this.props.cscList) {
      this.props.cscList.forEach(({ name, salindex }) => {
        this.props.clearCSCErrorCodes(name, salindex);
      });
    }
  };

  render() {
    const { props } = this;
    return (
      <div className={styles.CSCGroupContainer}>
        <div className={styles.CSCGroupLogContainer}>
          <div className={styles.topBarContainerWrapper}>
            <div className={styles.topBarContainer}>
              <div className={styles.breadcrumContainer}>
                {this.props.embedded && (
                  <div
                    className={styles.backArrowIconWrapper}
                    onClick={() => this.props.onCSCClick(this.props.realm, this.props.group, 'all')}
                  >
                    <BackArrowIcon />
                  </div>
                )}
                <span className={styles.breadcrumbGroup}>
                  {props.group} {' (Error codes)'}
                </span>
              </div>
            </div>
          </div>
          <div className={[styles.logContainer, styles.errorCodeContainer].join(' ')}>
            <div className={styles.logContainerTopBar}>
              <div>ERROR CODE</div>
              <div>
                <Button size="extra-small" onClick={() => this.clearGroupErrorCodes()}>
                  CLEAR
                </Button>
              </div>
            </div>
            <div className={[styles.log, styles.messageLogContent].join(' ')}>
              {this.props.errorCodeData.map((msg, index) => {
                return (
                  <div key={`${msg.private_rcvStamp.value}-${index}`} className={styles.logMessage}>
                    <div className={styles.errorCode} title={`Error code ${msg.errorCode.value}`}>
                      {msg.errorCode.value}
                    </div>
                    <div className={styles.messageTextContainer}>
                      <div className={styles.messageTopSection}>
                        <CSCDetailContainer
                          realm={this.props.realm}
                          group={this.props.group}
                          name={msg.csc}
                          salindex={msg.salindex}
                          data={this.props.data}
                          onCSCClick={this.props.onCSCClick}
                          embedded={true}
                        />
                        <div className={styles.timestamp} title="private_rcvStamp">
                          {new Date(msg.private_rcvStamp.value * 1000).toUTCString()}
                        </div>
                      </div>
                      <div className={styles.messageText}>{msg.errorReport.value}</div>
                      <div className={styles.messageTraceback}>{msg.traceback.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
