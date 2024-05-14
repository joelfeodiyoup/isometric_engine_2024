import { SidePanelSection, SidePanelSectionButtonAction } from "./SidePanelSection"

export const HousingPanel = () => {
  const buttons: SidePanelSectionButtonAction[] = [
    {label: "house", action: () => console.log('not implemented')},
    {label: "mansion", action: () => console.log('not implemented')},
  ];

  return <SidePanelSection
    actions={buttons}
    heading="housing"></SidePanelSection>
}