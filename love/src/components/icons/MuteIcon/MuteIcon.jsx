import React, { Component } from 'react';
import styles from './MuteIcon.module.css';

export default class MuteIcon extends Component {
  render() {
    return (
      <svg
        className={[styles.icon, styles.color, this.props.style].join(' ')}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        { this.props.unmuted ? (
          <>
          <path d="M16.59,8.23a4.83,4.83,0,0,0-2.84-.93.35.35,0,0,0-.35.35.35.35,0,0,0,.35.34,4.09,4.09,0,0,1,2.34.74l.54.44a4.12,4.12,0,0,1-2.88,7.06.35.35,0,1,0,0,.7,4.82,4.82,0,0,0,3.37-8.25Z" transform="translate(0 0)"/>
          <path d="M14.8,10a2.3,2.3,0,0,0-1.05-.26.35.35,0,1,0,0,.7,1.77,1.77,0,0,1,.52.08l.62.37a1.65,1.65,0,0,1,.52,1.2,1.66,1.66,0,0,1-1.66,1.66.35.35,0,0,0-.35.35.35.35,0,0,0,.35.34,2.35,2.35,0,0,0,1.63-4Z" transform="translate(0 0)"/>
          <path
            d="M8.58,15.17a.35.35,0,0,0-.24-.1h-3V9.85h3a.35.35,0,0,0,.24-.1l3.17-3.86v5.59a.35.35,0,0,0,.7,0V5.05a.35.35,0,0,0-.22-.32.36.36,0,0,0-.37.07L8.19,9.15H5a.35.35,0,0,0-.34.35v5.92a.34.34,0,0,0,.34.34H8.19l3.67,3.66a.31.31,0,0,0,.24.1.27.27,0,0,0,.13,0,.36.36,0,0,0,.22-.32V14.89a.35.35,0,1,0-.7,0v3.45Z"
            transform="translate(0 0)"/>
          </>
        ): (
          <path
            d="M21.45,4A.34.34,0,0,0,21,4l-4.4,4.4a4.63,4.63,0,0,0-2.76-.9.34.34,0,0,0,0,.67,4,4,0,0,1,2.28.71l-1.25,1.25a2.36,2.36,0,0,0-1-.24.34.34,0,0,0,0,.67,1.44,1.44,0,0,1,.51.09l-5,5-.52-.52a.34.34,0,0,0-.24-.09H5.67V10H8.55a.31.31,0,0,0,.24-.1l3.09-3.75V11.6a.34.34,0,0,0,.67,0V5.35A.34.34,0,0,0,12.34,5a.36.36,0,0,0-.37.07L8.42,9.34H5.34A.34.34,0,0,0,5,9.67v5.75a.34.34,0,0,0,.34.34H8.42l.41.42L5.1,19.91a.34.34,0,0,0,0,.48.35.35,0,0,0,.24.1.34.34,0,0,0,.23-.1l3.74-3.74L12,19.31a.33.33,0,0,0,.24.1l.13,0a.35.35,0,0,0,.21-.32V14.91a.34.34,0,1,0-.67,0v3.35L9.79,16.18l5.13-5.13a1.58,1.58,0,0,1,.5,1.16,1.61,1.61,0,0,1-1.61,1.61.34.34,0,0,0-.33.34.34.34,0,0,0,.33.34,2.3,2.3,0,0,0,2.29-2.29,2.26,2.26,0,0,0-.71-1.64l1.22-1.22a4,4,0,0,1-2.8,6.87.34.34,0,0,0,0,.67,4.67,4.67,0,0,0,3.28-8l4.36-4.37A.33.33,0,0,0,21.45,4Z"
            transform="translate(0 0)"
          />
        )}
      </svg>
    );
  }
}

MuteIcon.defaultProps = {
  style: '',
  unmuted: false,
};