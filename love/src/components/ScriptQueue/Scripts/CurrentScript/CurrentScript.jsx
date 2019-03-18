import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JSONPretty from 'react-json-pretty';
import LoadingBar from './LoadingBar/LoadingBar';
import styles from './CurrentScript.module.css';
import scriptStyles from '../Scripts.module.css';
import ScriptStatus from '../../ScriptStatus/ScriptStatus';

export default class CurrentScript extends Component {
  static propTypes = {
    /** SAL property: Index of Script SAL component */
    salIndex: PropTypes.number,
    /** SAL property: True if this is a standard script, False if an external script */
    isStandard: PropTypes.bool,
    /** SAL property: Path of script, relative to standard or external root directory */
    path: PropTypes.string,
    /** SAL property: Estimated duration of the script, excluding slewing to the initial position required by the script */
    estimatedTime: PropTypes.number,
    /** Estimated execution time */
    elapsedTime: PropTypes.number,
    /** True if the script is displayed in compact view */
    isCompact: PropTypes.bool,
    /** SAL property: State of the script; see Script_Events.xml for enum values; 0 if the script is not yet loaded */
    script_state: PropTypes.string,
    /** Timestamp of script creation */
    timestamp: PropTypes.number,
  };

  static defaultProps = {
    salIndex: 0,
    isStandard: true,
    path: 'unknown',
    timestamp: 0,
    script_state: 'Unknown',
    estimatedTime: 0,
    elapsedTime: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  onClick = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
  };

  render() {
    const { path } = this.props;
    const fileFolder = path.substring(0, path.lastIndexOf('/') + 1);
    const fileName =
      path.lastIndexOf('.') > -1
        ? path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))
        : path.substring(path.lastIndexOf('/'));
    const fileExtension = path.lastIndexOf('.') > -1 ? path.substring(path.lastIndexOf('.')) : '';
    return (
      <div className={scriptStyles.scriptContainer}>
        <div className={styles.currentScriptContainer} onClick={this.onClick}>
          <div className={styles.topContainer}>
            <div>
              <div className={scriptStyles.externalContainer}>
                <span className={scriptStyles.externalText}>{this.props.isStandard ? '[STANDARD]' : '[EXTERNAL]'}</span>
              </div>
              <div className={styles.indexContainer}>
                <span className={styles.indexLabel}>Index: </span>
                <span className={[styles.indexValue, scriptStyles.highlighted].join(' ')}>{this.props.salIndex}</span>
              </div>
              <div className={scriptStyles.pathTextContainer}>
                <span className={scriptStyles.pathText}>{fileFolder}</span>
                <span className={[scriptStyles.pathText, scriptStyles.highlighted].join(' ')}>{fileName}</span>
                <span className={scriptStyles.pathText}>{fileExtension}</span>
              </div>
            </div>
            <div className={scriptStyles.Scriptstatus}>
              <ScriptStatus status={'running'}>{this.props.script_state}</ScriptStatus>
            </div>
          </div>
          <div className={styles.loadingBarContainer}>
            <LoadingBar percentage={40} />
          </div>
          <div className={styles.timeContainer}>
            <div className={styles.estimatedTimeContainer}>
              <span className={styles.estimatedTimeLabel}>Estimated time: </span>
              <span className={[styles.estimatedTimeValue, scriptStyles.highlighted].join(' ')}>
                {this.props.estimatedTime}
              </span>
            </div>
            <div className={styles.elapsedTimeContainer}>
              <span className={styles.elapsedTimeLabel}>Elapsed time: </span>
              <span className={[styles.elapsedTimeValue, scriptStyles.highlighted].join(' ')}>
                {this.props.elapsedTime}
              </span>
            </div>
          </div>
        </div>
        <div className={[styles.expandedSectionWrapper, this.state.expanded ? '' : styles.hidden].join(' ')}>
          <div className={[styles.expandedSection].join(' ')}>
            <div className={scriptStyles.expandedTopRow}>
              <p>Script config</p>
              <div className={scriptStyles.uploadButtonWrapper}>
              </div>
            </div>
            <JSONPretty
              data={{ wait_time: '10.', sdasa: 1, dsadsa: true }}
              theme={{
                main:
                  'line-height:1.3;color:#66d9ef;background:var(--secondary-background-dimmed-color);overflow:auto;',
                key: 'color:#f92672;',
                string: 'color:#fd971f;',
                value: 'color:#a6e22e;',
                boolean: 'color:#ac81fe;',
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}