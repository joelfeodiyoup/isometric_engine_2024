import styled from "styled-components";
import { ModalInstance } from "../layout-utilities/Modal";
import engineer from "./../../images/advisors/engineer.jpg"
import environment from "./../../images/advisors/environment.jpg"
import financial from "./../../images/advisors/financial.jpg"
import health from "./../../images/advisors/health.jpg"
import planner from "./../../images/advisors/planner.jpg"
import police from "./../../images/advisors/police.jpg"
import transportation from "./../../images/advisors/transportation.jpg"
import { Cluster } from "../layout-utilities/layout-partials";
import { colors } from "../useColours";

export const AdvisorsModal = () => {
  const images = [engineer, environment, financial, health, planner, police, transportation];
  return (<>
    <ModalInstance heading="Advisors" actions={[]}>
      <AdvisorsPanel>
        {images.map((image, i) => {
          return <InfoPanelImage src={image} key={`advisors-${i}`} />
        })}
        </AdvisorsPanel>
        <p>These are some advisors.</p>
    </ModalInstance>
  </>)
}

const AdvisorsPanel = styled(Cluster)`
  gap: 2ch;
`

/** not a great name. hmmm.... */
const InfoPanelImage = styled.img`
  height: 17ch;
  border: 2px solid ${colors.brightRed};
  cursor: pointer;
  // filter: grayscale(0.4);
  transition: transform .1s ease-in-out;
  &:hover {
    // filter: grayscale(0);
    transform: scale(1.2);
  }
`;
