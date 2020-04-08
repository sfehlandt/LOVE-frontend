import React from 'react';
import { connect } from 'react-redux';
import { getTaiToUtc } from '../../redux/selectors';
import TimeDisplay from './TimeDisplay';

export const schema = {
  description: `Component displaying the clocks with relevant times, such as UTC, TAI, summit time, etc`,
  defaultSize: [63, 17],
  props: {
    titleBar: {
      type: 'boolean',
      description: 'Whether to display the title bar',
      isPrivate: false,
      default: true,
    },
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'TimeDisplay',
    },
    margin: {
      type: 'boolean',
      description: 'Whether to display component with a margin',
      isPrivate: false,
      default: true,
    },
    locale: {
      type: 'string',
      description:
        `Locale string used to configure how to display the UTC Offset.
        'en-GB' by default (so it is displayed as GMT always). Null or empty to use the browser locale.
        The format for this string must be: <language (2 lowercase chars)>-<COUNTRY (2 uppercase chars)>`,
      isPrivate: false,
      default: 'en-GB',
    },
    clocks: {
      type: 'array',
      description:
        `Layout of clocks in Json form.
        It is a list of horizontalGroups, each of which list of vertically-aligned elements.
        Each clock has the following properties:

        1. name: (string) name of the clock, to be displayed above it.
        2. hideAnalog: (boolean = false) flag to hide the analog clock.
        3. hideDate: (boolean = false) flag to hide the date.
        4. hideOffset: (boolean = false) flag to hide the UTC offset, displayed at the right of the name
        5. timezone: timezone string used to configure which UTC offset to use. Null or empty if current should be used. 'UTC' for UTC. Null by default.

          The format for the timezone string must be: <Continent>/<City> (use camelcase and underscores (_) instead of spaces).
          For example:
          - For UTC use UTC
          - For TAI use TAI
          - For La Serena use America/Santiago (yes America, not Chile)
          - For Arizona use America/Phoenix
          - For Illinois use America/Chicago
          Note that not every city is available, check the IANA DB documentation for more info: https://www.iana.org/time-zones
          See the default value as an example`,
      isPrivate: false,
      default: [
        [
          {
            name: 'Local Time',
            hideAnalog: false,
            hideDate: false,
            hideOffset: false,
            timezone: null,
          },
          {
            name: 'Sidereal Time',
            hideAnalog: false,
            hideDate: false,
            hideOffset: false,
            timezone: null,
          },
        ],
        [
          [
            {
              name: 'La Serena',
              hideAnalog: true,
              hideDate: false,
              hideOffset: false,
              timezone: 'America/Santiago',
            },
            {
              name: 'Arizona',
              hideAnalog: true,
              hideDate: false,
              hideOffset: false,
              timezone: 'America/Phoenix',
            },
            {
              name: 'Illinois',
              hideAnalog: true,
              hideDate: false,
              hideOffset: false,
              timezone: 'America/Chicago',
            },
          ],
          [
            {
              name: 'Universal Time',
              hideAnalog: true,
              hideDate: false,
              hideOffset: false,
              timezone: 'UTC',
            },
            {
              name: 'International Atomic Time',
              hideAnalog: true,
              hideDate: false,
              hideOffset: false,
              timezone: 'TAI',
            },
            {
              name: 'Modified Julian Date',
              hideAnalog: true,
              hideDate: false,
              hideOffset: false,
              timezone: 'TAI',
            },
          ]
        ]
      ],
    },
  },
};

const TimeDisplayContainer = ({ ...props }) => {
  return (
    <TimeDisplay
      {...props}
    />
  );
};

const mapStateToProps = (state) => {
  const taiToUtc = getTaiToUtc(state);
  return { taiToUtc };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeDisplayContainer);
