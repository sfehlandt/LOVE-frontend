import React from 'react';
import { connect } from 'react-redux';
import {
  getUsername,
  getLastSALCommand,
  getMode,
  getViewSummary,
  getViewsStatus,
  getViews,
  getLastManagerHeartbeat,
  getLastComponentHeartbeat,
  getAllTime,
  getAllAlarms,
  getTaiToUtc,
} from '../../redux/selectors';
import { logout } from '../../redux/actions/auth';
import { addGroupSubscription, requestGroupSubscriptionRemoval, requestSALCommand } from '../../redux/actions/ws';
import { clearViewToEdit } from '../../redux/actions/uif';
import Layout from './Layout';

const LayoutContainer = ({ ...props }) => {
  return <Layout {...props} />;
};

const mapStateToProps = (state) => {
  const user = getUsername(state);
  const lastSALCommand = getLastSALCommand(state);
  const mode = getMode(state);
  const getCurrentView = (id) => getViewSummary(state, id);
  const getManagerHeartbeat = () => getLastManagerHeartbeat(state);
  const getComponentHeartbeat = (component) => getLastComponentHeartbeat(state, component);
  const viewsStatus = getViewsStatus(state);
  const views = getViews(state);
  const timeData = getAllTime(state);
  const alarms = getAllAlarms(state);
  const taiToUtc = getTaiToUtc(state);
  return {
    user,
    lastSALCommand,
    mode,
    getCurrentView,
    viewsStatus,
    getLastManagerHeartbeat: getManagerHeartbeat,
    getLastComponentHeartbeat: getComponentHeartbeat,
    views,
    timeData,
    alarms,
    taiToUtc,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = ['heartbeat-manager-0-stream', 'event-Watcher-0-alarm'];
  return {
    subscriptions,
    logout: () => dispatch(logout()),
    clearViewToEdit: () => dispatch(clearViewToEdit),
    subscribeToStreams: () => {
      subscriptions.forEach((stream) => dispatch(addGroupSubscription(stream)));
    },
    unsubscribeToStreams: () => {
      subscriptions.forEach((stream) => dispatch(requestGroupSubscriptionRemoval(stream)));
    },
    ackAlarm: (name, severity, acknowledgedBy) => {
      return dispatch(
        requestSALCommand({
          cmd: 'cmd_acknowledge',
          component: 'Watcher',
          salindex: 0,
          params: {
            name,
            severity,
            acknowledgedBy,
          },
        }),
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LayoutContainer);
