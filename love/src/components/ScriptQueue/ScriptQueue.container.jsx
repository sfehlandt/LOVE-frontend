import React from 'react';
import { connect } from 'react-redux';
import { addGroupSubscription, requestGroupSubscriptionRemoval, requestSALCommand } from '../../redux/actions/ws';
import {
  getScriptQueueState,
  getScriptHeartbeats,
  getSummaryStateValue,
  getPermCmdExec,
  getLastSALCommand,
  getUsername,
} from '../../redux/selectors';
import SubscriptionTableContainer from '../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import ScriptQueue from './ScriptQueue';

export const schema = {
  description: `Component containing information about the scripts currently running, scripts to be run (in queue) and past scripts.
                Allows commands to be sent for interacting with the scripts, such as stopping, enqueueing and requeueing scripts`,
  defaultSize: [66, 38],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Script queue',
    },
    salindex: {
      type: 'number',
      description: 'Salindex of the ScriptQueue',
      isPrivate: false,
      default: 1,
    },
  },
};

const ScriptQueueContainer = ({
  subscribeToStreams,
  unsubscribeToStreams,
  requestSALCommand,
  summaryStateValue,
  queueState,
  scriptHeartbeats,
  commandExecutePermission,
  lastSALCommand,
  username,
  salindex,
  fit,
  embedded,
  ...props
}) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <ScriptQueue
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      requestSALCommand={requestSALCommand}
      summaryStateValue={summaryStateValue}
      current={queueState.current}
      finishedScriptList={queueState.finishedScriptList}
      availableScriptList={queueState.availableScriptList}
      waitingScriptList={queueState.waitingScriptList}
      state={queueState.state}
      heartbeats={scriptHeartbeats}
      commandExecutePermission={commandExecutePermission}
      lastSALCommand={lastSALCommand}
      username={username}
      salindex={salindex}
      fit={fit}
      embedded={embedded}
      running={queueState.running}
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  const queueState = getScriptQueueState(state, ownProps.salindex);
  const scriptHeartbeats = getScriptHeartbeats(state, ownProps.salindex);
  const summaryStateValue = getSummaryStateValue(state, `event-ScriptQueue-${ownProps.salindex}-summaryState`);
  const commandExecutePermission = getPermCmdExec(state);
  const lastSALCommand = getLastSALCommand(state);
  const username = getUsername(state);
  return {
    queueState: queueState,
    scriptHeartbeats: scriptHeartbeats,
    summaryStateValue: summaryStateValue,
    commandExecutePermission: commandExecutePermission,
    lastSALCommand: lastSALCommand,
    username: username,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const subscriptions = [
    `event-ScriptQueueState-${ownProps.salindex}-stream`,
    `event-ScriptQueue-${ownProps.salindex}-summaryState`,
    `event-ScriptHeartbeats-${ownProps.salindex}-stream`,
  ];
  return {
    subscriptions,
    subscribeToStreams: () => {
      subscriptions.forEach((stream) => dispatch(addGroupSubscription(stream)));
    },
    unsubscribeToStreams: () => {
      subscriptions.forEach((stream) => dispatch(requestGroupSubscriptionRemoval(stream)));
    },
    requestSALCommand: (cmd) => {
      if (cmd.csc === 'Script') {
        return dispatch(requestSALCommand({ ...cmd, component: 'Script', salindex: 0 }));
      }
      return dispatch(requestSALCommand({ ...cmd, component: 'ScriptQueue', salindex: ownProps.salindex }));
    },
  };
};
const connectedContainer = connect(mapStateToProps, mapDispatchToProps)(ScriptQueueContainer);

connectedContainer.defaultProps = {
  salindex: 1,
};

export default connectedContainer;
