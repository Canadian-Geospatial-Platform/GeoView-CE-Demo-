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

  return (
    <StateContext.Provider
      value={{
        mapId,
        buttonPanel,
      }}
    >
      <ClimateEngine />
    </StateContext.Provider>
  );
};
