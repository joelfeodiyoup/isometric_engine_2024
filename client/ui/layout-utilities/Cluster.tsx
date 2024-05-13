import styled from "styled-components";
import { colors } from "../useColours";
import texture from "./../../images/repeating.jpg";

export const Cluster = styled.div`
  display: flex;
  column-gap: 3rem;
  flex-wrap: wrap;
`;

export const ButtonGroupCluster = styled(Cluster)`
  gap: 0.5rem;
`

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Panel = styled.div`
  background-image: ${colors.texturedBackground};
`