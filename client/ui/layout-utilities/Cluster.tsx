import styled from "styled-components";
import { colors } from "../useColours";

export const Cluster = styled.div`
  display: flex;
  column-gap: 3rem;
  flex-wrap: wrap;
`;

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Panel = styled.div`
  background: ${colors.lightBlue}
`