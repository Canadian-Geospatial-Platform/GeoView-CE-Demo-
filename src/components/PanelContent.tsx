import { Login } from './Login';
import { ClimateEngine } from './ClimateEngine';

/**
 * Panel Content Properties
 */
interface PanelContentProps {
  mapId: string;
  buttonPanel: any;
}

const w = window as any;

const cgpv = w['cgpv'];

const { react } = cgpv;

const { createContext } = react;

// context used to store and manage state
export const StateContext = createContext({});

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

  const auth = useMemo(() => {
    return { apiKey, setApiKey };
  }, [apiKey]);

  /**
   * Save API key in local storage and login user
   *
   * @param {string} key the api key to store
   */
  const saveApiKey = (key: string): void => {
    localStorage.setItem('key', key);

    console.log('test');

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

  return (
    <StateContext.Provider
      value={{
        auth,
        mapId,
      }}
    >
      {!auth.apiKey ? (
        <Login saveApiKey={saveApiKey} />
      ) : (
        <ClimateEngine
          deleteApiKey={deleteApiKey}
          mapId={mapId}
          buttonPanel={buttonPanel}
        />
      )}
    </StateContext.Provider>
  );
};
