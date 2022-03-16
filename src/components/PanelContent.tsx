import { Login } from './Login';
import { ClimateEngine } from './ClimateEngine';

const w = window as any;

const cgpv = w['cgpv'];

const { react } = cgpv;

const { createContext } = react;

// context used to store and manage state
export const StateContext = createContext({});

/**
 * Panel Content Properties
 */
interface PanelContentProps {
  mapId: string;
  buttonPanel: any;
}

/**
 * Create a new panel content
 *
 * @param {PanelContentProps} props panel content properties
 * @returns {JSX.Element} the new create panel content
 */
export const PanelContent = (props: PanelContentProps): JSX.Element => {
  const { buttonPanel, mapId } = props;

  const { ui, mui, react } = cgpv;

  const { useState, useEffect, useMemo } = react;

  const [apiKey, setApiKey] = useState();

  /**
   * Save API key in local storage and login user
   *
   * @param {string} key the api key to store
   */
  const saveApiKey = (key: string): void => {
    localStorage.setItem('key', key);

    auth.setApiKey(key);
  };

  /**
   * Get the API key from local storage
   */
  const getApiKey = (): void => {
    const key = localStorage.getItem('key');

    if (key) {
      auth.setApiKey(key);
    }
  };

  /**
   * Delete the API key from local storage
   */
  const deleteApiKey = (): void => {
    localStorage.removeItem('key');

    auth.setApiKey(null);
  };

  useEffect(() => {
    getApiKey();
  }, []);

  /**
   * Create auth state
   */
  const auth = useMemo(() => {
    return { apiKey, setApiKey, saveApiKey, deleteApiKey, getApiKey };
  }, [apiKey]);

  return (
    <StateContext.Provider
      value={{
        auth,
        mapId,
        buttonPanel,
      }}
    >
      {!auth.apiKey ? <Login /> : <ClimateEngine />}
    </StateContext.Provider>
  );
};
