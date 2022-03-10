/**
 * Panel Content Properties
 */
interface PanelContentProps {
  mapId: string;
  buttonPanel: any;
}

const w = window as any;

const cgpv = w['cgpv'];

/**
 * Create a new panel content
 *
 * @param {PanelContentProps} props panel content properties
 * @returns {JSX.Element} the new create panel content
 */
export const PanelContent = (props: PanelContentProps): JSX.Element => {
  const { buttonPanel } = props;
  const { ui } = cgpv;

  const { Button } = ui.elements;

  return (
    <div>
      <div>Test content</div>
    </div>
  );
};
