import React from 'react';
import PropTypes from 'prop-types';
import AnalogClock from '../GeneralPurpose/AnalogClock/AnalogClock';
import DigitalClock from '../GeneralPurpose/DigitalClock/DigitalClock';
import styles from './TimeDisplay.module.css';
import * as dayjs from 'dayjs';


export default class TimeDisplay extends React.Component {

  static propTypes = {
    /** Number of seconds to add to a TAI timestamp to convert it in UTC */
    taiToUtc: PropTypes.number,
  }

  constructor(props) {
    super(props);
    this.state = {
      timestamp: dayjs(),
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      timestamp: dayjs(),
    });
  }

  render () {
    const localTime = this.state.timestamp;
    const utcTime = this.state.timestamp.utc();
    const serenaTime = this.state.timestamp.utcOffset(-4);
    const arizonaTime = this.state.timestamp.utcOffset(-7);
    const illinoisTime = this.state.timestamp.utcOffset(-6);
    const taiTime = utcTime.subtract(this.props.taiToUtc, 'seconds');
    return (
      <div className={styles.container}>
        <div className={styles.group}>
          <ClockWrapper timestamp={localTime} title='Local Time' showAnalog/>
          <ClockWrapper timestamp={localTime} title='Sidereal Time' showAnalog/>
        </div>
        <div className={styles.group}>
          <div className={styles.column}>
            <ClockWrapper timestamp={serenaTime} title='La Serena'/>
            <ClockWrapper timestamp={arizonaTime} title='Arizona'/>
            <ClockWrapper timestamp={illinoisTime} title='Illinois'/>
          </div>
          <div className={styles.column}>
            <ClockWrapper timestamp={utcTime} title='Universal Time (UTC)'/>
            <ClockWrapper timestamp={taiTime} title='International Atomic Time (TAI)'/>
            <ClockWrapper timestamp={illinoisTime} title='Modified JD:'/>
          </div>
        </div>
      </div>
    );
  }
}

function ClockWrapper ({timestamp, title, showAnalog}) {
  return (
    <div className={styles.clockWrapper}>
      <div className={styles.title}>
        {title}
      </div>
      <DigitalClock timestamp={timestamp}/>
      { showAnalog && (
        <div className={styles.analog}>
          <AnalogClock timestamp={timestamp}/>
        </div>
      )}
    </div>
  );
}