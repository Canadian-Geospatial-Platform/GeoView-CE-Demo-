import { StateContext } from './PanelContent';

import { httpGet } from '../utils/api';
import { End_Points } from '../utils/end_points';

// get reference to window object
const w = window as any;

// get reference to geoview apis
const cgpv = w['cgpv'];

const { makeStyles } = cgpv.ui;

const useStyles = makeStyles((theme: any) => ({
  loginContainer: {
    width: '100%',
  },
  loginTextInput: {
    width: '100%',
    marginBottom: 10,
  },
  loginBtn: {},
  loginBtnText: {
    textAlign: 'center',
  },
}));

/**
 * Login properties
 */
interface LoginProps {
  saveApiKey: (key: string) => void;
}

/**
 * Create a login component to save the API key
 *
 * @param {LoginProps} props properties passed to the login component
 * @returns {JSX.Element} a login component
 */
export const Login = (props: LoginProps): JSX.Element => {
  const { ui, mui, react, api } = cgpv;

  const { createRef, useContext } = react;

  const textFieldRef = createRef();
  const state = useContext(StateContext);

  const { TextField } = mui;
  const { Button } = ui.elements;

  const mapId = state.mapId;

  const classes = useStyles();

  /**
   * Login function
   */
  const login = async () => {
    // request the validate end point to check if token is valid
    let res = await httpGet(
      End_Points.VALIDATE_KEY,
      textFieldRef.current.value,
    );

    if (res.detail) {
      api.event.emit(api.eventNames.EVENT_SNACKBAR_OPEN, mapId, {
        message: {
          type: 'key',
          value: res.detail,
          params: [],
        },
      });
    } else {
      props.saveApiKey(textFieldRef.current.value);
    }
  };

  return (
    <div className={classes.loginContainer}>
      <TextField
        id="outlined-basic"
        label="API Key Token"
        variant="outlined"
        inputRef={textFieldRef}
        className={classes.loginTextInput}
      />
      <Button
        tooltip="Login"
        tooltipPlacement="right"
        className={classes.loginBtn}
        type="text"
        onClick={() => login()}
      >
        <div className={classes.loginBtnText}>Login</div>
      </Button>
    </div>
  );
};
