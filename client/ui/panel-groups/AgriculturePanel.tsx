import { SidePanelSection, SidePanelSectionButtonAction } from "./SidePanelSection"

export const AgriculturePanel = () => {
  const buttons: SidePanelSectionButtonAction[] = [
    {label: "farm", action: () => console.log('not implemented')},
    {label: "miner", action: () => console.log('not implemented')},
    {label: "carrots", action: () => console.log('not implemented')},
    {label: "fish", action: () => console.log('not implemented')},
  ];

  return <SidePanelSection
    actions={buttons}
    heading="agriculture"></SidePanelSection>
}