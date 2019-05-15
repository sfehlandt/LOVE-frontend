import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, withRouter } from 'react-router-dom';
import './App.css';
import ComponentIndex from './components/ComponentIndex/ComponentIndex';
import HealthStatusSummary from './components/HealthStatusSummary/HealthStatusSummary';
import DataManagementFlow from './components/DataManagementFlow/DataManagementFlow';
import Login from './components/Login/Login';
import PrivateRoute from './components/GeneralPurpose/PrivateRoute/PrivateRoute';
import ScriptQueue from './components/ScriptQueue/ScriptQueue';
import TimeSeries from './components/TimeSeries/TimeSeries';
import Panel from './components/GeneralPurpose/Panel/Panel';

import ManagerInterface from './Utils';
import TelemetryLog from './components/TelemetryLog/TelemetryLog';
import TelemetryLogContainer from './components/TelemetryLog/TelemetryLog.container';
import CSCSummary from './components/CSCSummary/CSCSummary';
import AuxTel from './components/AuxTel/AuxTel';
import Camera from './components/AuxTel/Camera/Camera';
import LATISS from './components/AuxTel/LATISS/LATISS';

class App extends Component {
  static propTypes = {
    location: PropTypes.object,
  };

  constructor() {
    super();
    this.state = {
      token: ManagerInterface.getToken(),
      showSessionExpired: false,
    };
    this.managerInterface = new ManagerInterface();
    this.justLoggedOut = false;
  }

  componentDidMount = () => {
    const token = ManagerInterface.getToken();
    this.setTokenState(token);
    ManagerInterface.validateToken().then((response) => {
      if (response === false) {
        this.logout();
      }
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.token && prevProps.location.pathname !== this.props.location.pathname) {
      ManagerInterface.validateToken().then((response) => {
        if (response === false) {
          this.logout();
        }
      });
    }
    if (!this.state.token && prevState.token) {
      if (this.justLoggedOut) {
        this.justLoggedOut = false;
      } else {
        this.setState({ showSessionExpired: true });
      }
    }
  };

  hideSessionExpired = () => {
    this.setState({ showSessionExpired: false });
  };

  logout = () => {
    this.setTokenState(null);
    ManagerInterface.removeToken();
    if (this.managerInterface) this.managerInterface.logout();
    this.justLoggedOut = true;
  };

  setTokenState = (token) => {
    this.setState({ token });
    if (token) {
      this.managerInterface.subscribeToTelemetry('all', 'all', this.receiveAllMsg);
    }
  };

  receiveAllMsg = (msg) => {
    const data = JSON.parse(msg.data);

    if (data.category !== 'telemetry') return;

    if (typeof data.data === 'object') {
      let newTelemetries = Object.assign({}, this.state.telemetries);
      let timestamp = new Date();
      timestamp = timestamp
        .toISOString()
        .slice(0, 19)
        .replace(/-/g, '/')
        .replace('T', ' ');
      Object.entries(data.data).forEach((entry) => {
        const [csc, cscDataString] = entry;
        const cscData = JSON.parse(cscDataString);
        const telemetry = {};
        const stream = {};
        Object.entries(cscData).forEach((cscStream) => {
          const [streamName, parameters] = cscStream;
          stream[streamName] = {};
          stream[streamName].parameters = parameters;
          stream[streamName].receptionTimestamp = timestamp;
        });
        telemetry[csc] = {
          ...stream,
        };
        Object.assign(newTelemetries, telemetry);
      }, this);

      newTelemetries = JSON.parse(JSON.stringify(newTelemetries));
      this.setState({ telemetries: newTelemetries });
      this.managerInterface.unsubscribeToTelemetry('all', 'all', () => 0);
    }
  };

  render() {
    return (
      <div className="App">
        <Switch>
          <Route
            path="/login"
            render={() => (
              <Login
                token={this.state.token}
                setTokenState={this.setTokenState}
                showSessionExpired={this.state.showSessionExpired}
                hideSessionExpired={this.hideSessionExpired}
              />
            )}
          />
          <PrivateRoute
            token={this.state.token}
            path="/health-status-summary"
            render={() => (
              <div className="hs-container">
                <HealthStatusSummary telemetries={this.state.telemetries}> </HealthStatusSummary>
              </div>
            )}
          />
          <PrivateRoute token={this.state.token} path="/dm-flow" component={DataManagementFlow} />
          <PrivateRoute
            token={this.state.token}
            path="/time-series"
            render={() => (
              <div className="hs-container">
                <TimeSeries telemetries={this.state.telemetries}> </TimeSeries>
              </div>
            )}
          />
          <Route
            path="/test"
            render={() => (
              <div className="hs-container">
                {/* <TelemetryLog category="event" csc="ScriptQueue" stream="all">
                  {' '}
                </TelemetryLog> */}
                <TelemetryLogContainer/>
              </div>
            )}
          />
          <PrivateRoute token={this.state.token} path="/script-queue" component={ScriptQueue} />
          <PrivateRoute token={this.state.token} path="/csc-summary" component={CSCSummary} />
          <PrivateRoute token={this.state.token} path="/aux-tel" component={AuxTel} />
          <PrivateRoute token={this.state.token} path="/auxiliary-telescope" component={AuxTel} />
          <PrivateRoute
            token={this.state.token}
            path="/aux-tel-camera"
            render={() => (
              <Panel title="Auxiliary Telescope Camera" className={'smallPanel'}>
                <Camera />
              </Panel>
            )}
          />
          <PrivateRoute token={this.state.token} path="/latiss" component={LATISS} />
          <PrivateRoute
            token={this.state.token}
            path="/"
            render={() => <ComponentIndex logout={this.logout}> </ComponentIndex>}
          />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
