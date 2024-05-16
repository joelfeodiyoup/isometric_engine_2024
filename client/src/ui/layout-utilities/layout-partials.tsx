import styled from "styled-components";
import { colors } from "../useColours";

/**
 * This is a collection of layout utilities.
 * There's an approach to here: https://every-layout.dev/ which I think is compelling
 * Essentially layouts are combinations of the same types of ideas. Rather than re-implementing multiple times in the same layout, a set of basic elements could be combined in different ways
 * I'm still experimenting to see which way ends up cleanest for this. More of a personal interest.
 */

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