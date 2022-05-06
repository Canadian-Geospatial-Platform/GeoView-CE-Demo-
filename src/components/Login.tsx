import { StateContext } from './CEPanelContent';

import { API } from '../utils/api';

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
 * Create a login component to save the API key
 *
 * @param {LoginProps} props properties passed to the login component
 * @returns {JSX.Element} a login component
 */
export const Login = (): JSX.Element => {
  const { ui, react, api } = cgpv;

  const { createRef, useContext } = react;

  const textFieldRef = createRef();
  const state = useContext(StateContext);

  const { TextField, Button } = ui.elements;

  const mapId = state.mapId;

  const classes = useStyles();

  /**
   * Login function
   */
  const login = async () => {
    // request the validate end point to check if token is valid
    let res = (await API.validateToken(textFieldRef.current.value)) as any;

    if (res.detail) {
      api.event.emit({
        event: api.eventNames.SNACKBAR.EVENT_SNACKBAR_OPEN,
        handlerName: mapId,
        message: {
          type: 'key',
          value: res.detail,
          params: [],
        },
      });
    } else {
      state.auth.saveApiKey(textFieldRef.current.value);
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
        variant="contained"
        type="text"
        onClick={() => login()}
      >
        <div className={classes.loginBtnText}>Login</div>
      </Button>
    </div>
  );
};
