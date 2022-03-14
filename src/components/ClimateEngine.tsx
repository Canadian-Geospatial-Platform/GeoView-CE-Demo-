const w = window as any;

const cgpv = w['cgpv'];

interface ClimateEngineProps {
  mapId: string;
  buttonPanel: any;
  deleteApiKey: () => void;
}

export const ClimateEngine = (props: ClimateEngineProps): JSX.Element => {
  const { ui, mui, react, types } = cgpv;

  const { useState, useEffect } = react;

  const { Button } = ui.elements;

  return (
    <div>
      <Button
        tooltip="Logout"
        tooltipPlacement="right"
        type="text"
        onClick={() => {
          props.deleteApiKey();
        }}
      >
        Logout
      </Button>
    </div>
  );
};
