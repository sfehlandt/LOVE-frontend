import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { viewsStates } from '../../redux/reducers/uif';
import { SALCommandStatus } from '../../redux/actions/ws';
import { getNotificationMessage, relativeTime } from '../../Utils';
import Button from '../GeneralPurpose/Button/Button';
import DropdownMenu from '../GeneralPurpose/DropdownMenu/DropdownMenu';
import NotificationIcon from '../icons/NotificationIcon/NotificationIcon';
import GearIcon from '../icons/GearIcon/GearIcon';
import LogoIcon from '../icons/LogoIcon/LogoIcon';
import MenuIcon from '../icons/MenuIcon/MenuIcon';
import HeartbeatIcon from '../icons/HeartbeatIcon/HeartbeatIcon';
import NotchCurve from './NotchCurve/NotchCurve';
import EditIcon from '../icons/EditIcon/EditIcon';
import styles from './Layout.module.css';
import LabeledStatusTextContainer from '../GeneralPurpose/LabeledStatusText/LabeledStatusText.container';

const BREAK_1 = 768;
const BREAK_2 = 630;
const BREAK_3 = 375;
const urls = {
  // '/': 'HOME',
  '/uif': 'AVAILABLE VIEWS',
};

class Layout extends Component {
  static propTypes = {
    /** React Router location object */
    location: PropTypes.object,
    /** Children components */
    children: PropTypes.node,
    /** Last SAL command that has been sent */
    lastSALCommand: PropTypes.object,
    /** Function to log oput of the app */
    logout: PropTypes.func,
    /** Function to retrieve a view */
    getCurrentView: PropTypes.func,
    /** Function to clear the view to edit (when navigating to create new view) */
    clearViewToEdit: PropTypes.func,
    /** Authentication token */
    token: PropTypes.string,
    /** Mode of the LOVE (EDIT or VIEW) */
    mode: PropTypes.string,
    /** Status of the views request */
    viewsStatus: PropTypes.string,
    /** Function to subscribe to streams to receive the alarms */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving the alarms */
    unsubscribeToStreams: PropTypes.func,
  };

  static defaultProps = {
    lastSALCommand: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
      collapsedLogo: false,
      viewOnNotch: true,
      toolbarOverflow: false,
      sidebarVisible: false,
      id: null,
      title: null,
      heartbeatTimer: undefined,
      lastHeartbeat: undefined,
      hovered: false, // true if leftTopbar is being hovered
    };

    this.requestToastID = null;
  }

  UNSAFE_componentWillMount = () => {
    this.handleResize();
    document.addEventListener('mousedown', this.handleClick, false);
    window.addEventListener('resize', this.handleResize);
  };

  componentDidMount = () => {
    this.moveCustomTopbar();
    this.props.subscribeToStreams();
    this.heartbeatInterval = setInterval(() => {
      this.checkHeartbeat();
    }, 3000);
  };

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClick, false);
    window.removeEventListener('resize', this.handleResize);
    window.clearInterval(this.heartbeatInterval);
    this.props.unsubscribeToStreams();
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.toolbarOverflow !== prevState.toolbarOverflow) {
      this.moveCustomTopbar();
    }

    if (this.props.token === null && prevProps.token !== null) {
      this.props.unsubscribeToStreams();
    } else if (this.props.token !== null && prevProps.token === null) {
      this.props.subscribeToStreams();
    }
    const pathname = this.props.location.pathname;
    if (urls[pathname] && this.state.title !== urls[pathname]) {
      this.setState({
        id: null,
        title: urls[pathname],
      });
    } else {
      const id = parseInt(new URLSearchParams(this.props.location.search).get('id'), 10);
      if (id && id !== this.state.id && !isNaN(id)) {
        const view = this.props.getCurrentView(id);
        this.setState({ id, title: view ? view.name : null });
      } else if (!id && this.state.id) {
        this.setState({ id: null, title: null });
      }
    }

    if (prevProps.viewsStatus === viewsStates.LOADING && this.props.viewsStatus === viewsStates.LOADED) {
      const view = this.props.getCurrentView(this.state.id);
      this.setState({
        title: view ? view.name : null,
      });
    }

    /* Check command ack for toast*/
    if (
      this.props.lastSALCommand.status === SALCommandStatus.REQUESTED &&
      this.props.lastSALCommand.status !== prevProps.lastSALCommand.status
    ) {
      const [message] = getNotificationMessage(this.props.lastSALCommand);
      this.requestToastID = toast.info(message);
    }

    if (
      prevProps.lastSALCommand.status === SALCommandStatus.REQUESTED &&
      this.props.lastSALCommand.status === SALCommandStatus.ACK
    ) {
      const [message, result] = getNotificationMessage(this.props.lastSALCommand);
      if (this.requestToastID) {
        toast.dismiss(this.requestToastID);
      }

      if (result === 'Done') {
        toast.success(message);
      } else {
        if (this.props.lastSALCommand.statusCode >= 300) {
          toast.error(`${this.props.lastSALCommand.statusCode}: ${message}`);
        } else {
          toast.info(message);
        }
      }
    }
  };

  moveCustomTopbar = () => {
    const toolbarParent = document.getElementById(this.state.toolbarOverflow ? 'overflownToolbar' : 'middleTopbar');
    const customTopbar = document.getElementById('customTopbar');
    toolbarParent.appendChild(customTopbar);
  };

  checkHeartbeat = () => {
    const lastManagerHeartbeat = this.props.getLastManagerHeartbeat();
    const heartbeatStatus =
      this.state.lastHeartbeat &&
      lastManagerHeartbeat &&
      this.state.lastHeartbeat.data.timestamp !== lastManagerHeartbeat.data.timestamp
        ? 'ok'
        : 'alert';
    this.setState({
      lastHeartbeat: lastManagerHeartbeat,
      heartbeatStatus,
    });
  };

  getHeartbeatTitle = (heartbeat) => {
    if (this.state.heartbeatStatus === 'ok') {
      return 'LOVE manager heartbeat is being received as expected';
    }
    if (heartbeat === undefined || heartbeat.data === undefined || heartbeat.data.timestamp === undefined) {
      return 'LOVE manager heartbeat never seen';
    }
    const timeStatement = relativeTime(heartbeat.data.timestamp, 0);
    return `LOVE manager heartbeat not seen since ${timeStatement}`;
  };

  handleClick = (event) => {
    if (
      this.sidebar &&
      !this.sidebar.contains(event.target) &&
      this.leftNotch &&
      !this.leftNotch.contains(event.target)
    ) {
      this.setState({ sidebarVisible: false });
    }
  };

  handleResize = () => {
    this.setState({
      collapsedLogo: true,
      viewOnNotch: false,
      toolbarOverflow: true,
    });
    const innerWidth = window.innerWidth;
    this.setState({
      collapsedLogo: innerWidth <= BREAK_3,
      viewOnNotch: BREAK_2 < innerWidth,
      toolbarOverflow: innerWidth < BREAK_1,
    });
  };

  createNewView = () => {
    this.props.clearViewToEdit();
    this.props.history.push('/uif/view-editor');
  };

  editView = (id) => {
    this.props.history.push('/uif/view-editor?id=' + id);
  };

  navigateTo = (url) => {
    this.setState({ sidebarVisible: false });
    this.props.history.push(url);
  };

  toggleCollapsedLogo = () => {
    this.setState({ collapsedLogo: !this.state.collapsedLogo });
  };

  toggleSidebar = () => {
    this.setState({ sidebarVisible: !this.state.sidebarVisible });
  };

  goHome = () => {
    this.props.history.push('/');
  };

  setHovered = (value) => {
    this.setState({ hovered: value });
  };

  render() {
    return (
      <>
        <div className={styles.hidden}>
          <div id="customTopbar" />
        </div>
        <div
          className={[styles.topbar, this.props.token ? null : styles.hidden].join(' ')}
          onMouseOver={() => this.setHovered(true)}
          onMouseOut={() => this.setHovered(false)}
        >
          <div
            className={[
              styles.leftNotchContainer,
              this.state.collapsedLogo && !this.state.sidebarVisible ? styles.collapsedLogo : null,
            ].join(' ')}
            ref={(node) => (this.leftNotch = node)}
          >
            <div
              className={[styles.leftTopbar, this.state.collapsedLogo ? styles.leftTopBarNoEditButton : ''].join(' ')}
            >
              <Button
                className={styles.iconBtn}
                title="Toggle menu"
                onClick={this.toggleSidebar}
                disabled={false}
                status="transparent"
              >
                <MenuIcon className={styles.menuIcon} />
              </Button>

              <LogoIcon
                className={styles.logo}
                onClick={this.state.collapsedLogo ? this.toggleSidebar : this.goHome}
                title="Go home"
              />

              {this.state.title && this.state.viewOnNotch && <span className={styles.divider}> | </span>}
              {this.state.viewOnNotch && (
                <>
                  <span className={styles.text}> {this.state.title}</span>

                  {this.props.location.pathname === '/uif/view' && (
                    <Button
                      className={[styles.iconBtn, styles.editButton].join(' ')}
                      title="Edit view"
                      onClick={() => {
                        if (this.state.id) {
                          this.editView(this.state.id);
                        }
                      }}
                      disabled={false}
                      status="transparent"
                      style={{ visibility: this.state.hovered ? 'visible' : 'hidden' }}
                    >
                      <EditIcon className={styles.editIcon} />
                    </Button>
                  )}
                </>
              )}
            </div>
            <NotchCurve className={styles.notchCurve}>asd</NotchCurve>
          </div>

          <div className={styles.middleTopbar} id="middleTopbar" />

          <div className={styles.rightNotchContainer}>
            <NotchCurve className={styles.notchCurve} flip="true" />

            <div className={styles.rightTopbar}>
              <DropdownMenu className={styles.settingsDropdown}>
                <Button
                  className={[styles.iconBtn, styles.heartbeatButton].join(' ')}
                  style={{
                    visibility:
                      this.props.token && (this.state.heartbeatStatus !== 'ok' || this.state.hovered)
                        ? 'visible'
                        : 'hidden',
                  }}
                  title={this.getHeartbeatTitle(this.state.lastHeartbeat)}
                  onClick={() => {}}
                  status="transparent"
                >
                  <HeartbeatIcon
                    className={styles.icon}
                    status={this.state.heartbeatStatus}
                    title={this.getHeartbeatTitle(this.state.lastHeartbeat)}
                  />
                </Button>
                <div className={styles.heartbeatsMenu} title="Heartbeats menu">
                  <div className={styles.heartbeatMenuElement} title="LOVE manager menu">
                    <HeartbeatIcon
                      className={styles.icon}
                      status={'ok'}
                      title={this.getHeartbeatTitle(this.state.lastHeartbeat)}
                    />
                    <span>LOVE manager</span>
                  </div>
                  <div className={styles.heartbeatMenuElement} title="LOVE producer menu">
                    <HeartbeatIcon
                      className={styles.icon}
                      status={'alert'}
                      title={this.getHeartbeatTitle(this.state.lastHeartbeat)}
                    />
                    <span>LOVE producer</span>
                  </div>
                  <div className={styles.heartbeatMenuElement} title="LOVE commander menu">
                    <HeartbeatIcon
                      className={styles.icon}
                      status={this.state.heartbeatStatus}
                      title={this.getHeartbeatTitle(this.state.lastHeartbeat)}
                    />
                    <span>LOVE commander</span>
                  </div>
                  <div className={styles.divider}></div>
                  <div className={styles.statusMenuElement} title="LOVE commander menu">
                    <LabeledStatusTextContainer
                      label={'SAL status'}
                      groupName={'event-ATMCS-0-m3State'}
                      stateToLabelMap={{
                        0: 'UNKNOWN',
                        1: 'ENABLED',
                        2: 'UPDATING',
                        3: 'UPDATING',
                      }}
                      stateToStyleMap={{
                        0: 'unknown',
                        1: 'ok',
                        2: 'running',
                        3: 'running',
                      }}
                    />
                  </div>
                  <div className={styles.divider}></div>
                  <div className={styles.statusMenuElement} title="LOVE commander menu">
                  <LabeledStatusTextContainer
                      label={'EFD status'}
                      groupName={'event-ATMCS-0-m3State'}
                      stateToLabelMap={{
                        0: 'UNKNOWN',
                        1: 'RUNNING',
                        2: 'UNRESPONSIVE',
                        3: 'RUNNING',
                      }}
                      stateToStyleMap={{
                        0: 'unknown',
                        1: 'ok',
                        2: 'alert',
                        3: 'ok',
                      }}
                    />
                  </div>
                </div>
              </DropdownMenu>

              <Button className={styles.iconBtn} title="View notifications" onClick={() => {}} status="transparent">
                <NotificationIcon className={styles.icon} />
              </Button>

              <DropdownMenu className={styles.settingsDropdown}>
                <Button className={styles.iconBtn} title="Settings" status="transparent">
                  <GearIcon className={styles.icon} />
                </Button>
                <div className={styles.menuElement} title="Logout" onClick={this.props.logout}>
                  Logout
                </div>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className={styles.overflownToolbar} id="overflownToolbar" />

        <div
          ref={(node) => (this.sidebar = node)}
          className={[styles.sidebar, !this.state.sidebarVisible ? styles.sidebarHidden : null].join(' ')}
        >
          <div className={styles.viewName}>{!this.state.viewOnNotch ? this.state.title : ' '}</div>
          <div className={[styles.menu, !this.state.viewOnNotch ? styles.showName : null].join(' ')}>
            <p onClick={() => this.navigateTo('/')}>Home</p>
            <p onClick={() => this.navigateTo('/uif')}>Views Index</p>
          </div>
          <div className={styles.sidebarButtons}>
            <Button
              className={[styles.button, this.state.id ? null : styles.hidden].join(' ')}
              title="Edit view"
              onClick={() => {
                if (this.state.id) {
                  this.editView(this.state.id);
                }
              }}
            >
              <span className={styles.label}> Edit this view </span>
              <EditIcon className={styles.editIcon} />
            </Button>

            <Button className={styles.button} title="New view" onClick={this.createNewView}>
              <span className={styles.label}> Create new view </span>
              <span className={styles.plusIcon}> + </span>
            </Button>
          </div>
        </div>

        <div className={styles.contentWrapper}>{this.props.children}</div>

        <ToastContainer position={toast.POSITION.BOTTOM_CENTER} transition={Slide} hideProgressBar />
      </>
    );
  }
}

export default withRouter(Layout);
