import { Login } from './Login';
import { ClimateEngine } from './ClimateEngine';

import { TypeButtonPanel, TypeWindow } from 'geoview-core-types';

const w = window as TypeWindow;

const cgpv = w['cgpv'];

const { react } = cgpv;

const { createContext } = react;

export interface TypeAuth {
  apiKey: string;
  setApiKey: (apiKey: string) => void;
  saveApiKey: (apiKey: string) => void;
  getApiKey: () => void;
  deleteApiKey: () => void;
}

export interface TypeStateContext {
  auth: TypeAuth;
  mapId: string;
  buttonPanel: TypeButtonPanel;
}

// context used to store and manage state
export const StateContext = createContext<TypeStateContext>({
  auth: {
    apiKey: '',
    setApiKey: (key: string) => {},
    saveApiKey: (key: string) => {},
    getApiKey: () => {},
    deleteApiKey: () => {},
  },
  mapId: '',
  buttonPanel: {
    id: '',
    button: {
      type: 'text',
    },
  },
});

/**
 * Panel Content Properties
 */
interface CEPanelContentProps {
  mapId: string;
  buttonPanel: TypeButtonPanel;
}

/**
 * Create a new panel content
 *
 * @param {CEPanelContentProps} props panel content properties
 * @returns {JSX.Element} the new create panel content
 */
export const CEPanelContent = (props: CEPanelContentProps): JSX.Element => {
  const { buttonPanel, mapId } = props;

  const { ui, react } = cgpv;

  const { useState, useEffect, useMemo } = react;

  const [apiKey, setApiKey] = useState<string>('');

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

    auth.setApiKey('');
  };

  useEffect(() => {
    getApiKey();
  }, []);

  /**
   * Create auth state
   */
  const auth = useMemo((): TypeAuth => {
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
