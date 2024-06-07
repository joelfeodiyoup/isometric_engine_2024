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
import { useState } from "react";
import { ModalHeading } from "../elements/Headings";

export const AdvisorsModal = () => {
  const advisors: {image: string, name: string, description: string}[] = [
    {image: engineer, name: 'engineer', description: 'Leading the charge in urban development is Jack Steel, the Engineering Advisor, whose expertise in construction and infrastructure will help you create a cityscape that is both functional and awe-inspiring.'},
    {image: environment, name: 'environment', description: 'Olivia Woods, the Environment Advisor, is an ecologist committed to preserving New Horizons\' natural beauty while promoting green initiatives and renewable energy.'},
    {image: financial, name: 'financial', description: 'Lastly, Michael Gold, the Financial Advisor, is a savvy economist whose fiscal policies and budget management skills will ensure the city\'s economic stability and growth. '},
    {image: health, name: 'health', description: 'Dr. Helen White, your Health Advisor, is a renowned public health expert dedicated to ensuring the well-being of your citizens. She focuses on expanding healthcare facilities, implementing wellness programs, and managing disease outbreaks.'},
    {image: planner, name: 'planner', description: 'Emma Green, the Education Advisor, brings years of experience in academic administration. She is passionate about building world-class educational institutions and lifelong learning programs to foster an educated, innovative population.'},
    {image: police, name: 'police', description: 'Chief Sarah Strong, your Police Advisor, is a decorated law enforcement officer focused on maintaining public safety and implementing community policing programs.'},
    {image: transportation, name: 'transportation', description: 'The Transport Advisor, Carlos Vega, is a logistics mastermind with a deep understanding of traffic flow and public transportation systems. His strategies will keep your city moving efficiently, reducing congestion and promoting sustainable transport options.'},
  ];
  const [selectedAdvisor, setSelectedAdvisor] = useState(advisors[0])
  return (<>
    <ModalInstance heading="Advisors" actions={[]}>
      <AdvisorsPanel>
        {advisors.map((advisor, i) => {
          return <InfoPanelImage className={selectedAdvisor.name === advisor.name ? 'selected' : ''} src={advisor.image} key={`advisors-${i}`} onClick={() => setSelectedAdvisor(advisor)} />
        })}
        </AdvisorsPanel>
        <ModalHeading>
          {selectedAdvisor.name}
        </ModalHeading>
        <AdvisorDescription>{selectedAdvisor.description}</AdvisorDescription>
    </ModalInstance>
  </>)
}

const AdvisorsPanel = styled(Cluster)`
  gap: 2ch;
  flex-wrap: nowrap;
`;
const AdvisorDescription = styled.p`
  color: white;
  align-self: center;
`

/** not a great name. hmmm.... */
const InfoPanelImage = styled.img`
  height: 17ch;
  border: 2px solid ${colors.brightRed};
  cursor: pointer;
  transition: transform .1s ease-in-out;
  &:hover, &.selected {
    transform: scale(1.1);
  }
`;
