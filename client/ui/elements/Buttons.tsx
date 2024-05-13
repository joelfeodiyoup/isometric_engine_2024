import styled from "styled-components";
import { BaseProps } from "../App";
import React, { ButtonHTMLAttributes, PropsWithRef, PropsWithoutRef } from "react";
import { colors } from "../useColours";

export const BaseButton = styled.button`
&.isActive {
  background: ${colors.darkBlue};
}
`;
export const MenuButton = styled(BaseButton)`
  padding: 1rem;
`;

const IconImage = styled.img`
  width: 3rem;
`;
const IconButton = styled(BaseButton)`
`;

// export const SideMenuCategoryButtons = ({props, imageSrc, isActive}: {props: BaseProps,imageSrc: any, isActive: boolean}) => {
export const SideMenuCategoryButtons = (props: React.ComponentPropsWithoutRef<"button"> & {imagesrc: any}) => {
  props.onClick
  return (
    <IconButton
      {...props}
    ><IconImage src={props.imagesrc}></IconImage>
    </IconButton>)
}