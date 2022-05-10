var ee = require('@google/earthengine');

import { TypeWindow } from 'geoview-core-types';

const w = window as TypeWindow;

// get reference to geoview apis
const cgpv = w['cgpv'];

const { makeStyles } = cgpv.ui;

const useStyles = makeStyles((theme: any) => ({
  panelContainer: {
    width: '100%',
  },
  loginBtn: {},
  loginBtnText: {
    textAlign: 'center',
  },
}));

/**
 * Panel Content Properties
 */
interface GEEPanelContentProps {
  mapId: string;
  buttonPanel: any;
}

/**
 * Create a new panel content
 *
 * @param {GEEPanelContentProps} props panel content properties
 * @returns {JSX.Element} the new create panel content
 */
export const GEEPanelContent = (props: GEEPanelContentProps): JSX.Element => {
  const { buttonPanel, mapId } = props;

  const { ui, react, api } = cgpv;

  const { useEffect } = react;

  const { Button } = ui.elements;

  const classes = useStyles();

  /**
   * Login function
   */
  const login = async () => {};

  useEffect(() => {
    // Initialize client library.
    const initialize = function () {
      ee.initialize(
        null,
        null,
        () => {
          console.log('it works?');
        },
        (e: any) => {
          console.error('Initialization error: ' + e);
        },
      );
    };

    // Authenticate using an OAuth pop-up.
    ee.data.authenticateViaOauth(
      '1074544440685-e3v08f7417t4r4qt65mdoo0rlg965hvf.apps.googleusercontent.com',
      initialize,
      (e: any) => {
        console.error('Authentication error: ' + e);
      },
      null,
      () => {
        ee.data.authenticateViaPopup(initialize);
      },
    );
  });

  return (
    <div>
      <Button
        tooltip="Login"
        tooltipPlacement="right"
        className={classes.loginBtn}
        variant="contained"
        type="text"
        onClick={() => login()}
      >
        <div className={classes.loginBtnText}>
          Sign in to Google Cloud Account
        </div>
      </Button>
    </div>
  );
};
