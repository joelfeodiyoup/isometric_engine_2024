import styled from "styled-components";
import { BaseProps } from "../App";
import React, { ButtonHTMLAttributes, PropsWithRef, PropsWithoutRef } from "react";
import { colors } from "../useColours";

export const BaseButton = styled.button`
&.isActive {
  background: ${colors.darkBlue};
  color: white;
}
&.inverted {
  background: ${colors.lightBlue};
  &.isActive {
    background: ${colors.mediumBlue};
  }
  &:hover {
    color: white;
  }
}
`;
export const MenuButton = styled(BaseButton)`
  padding-inline: 1rem;
  padding-block: 0.4rem;
  border-radius: 0.5rem;
  &:hover {
    color: white;
  }
  `;
  
  const IconImage = styled.img`
  width: 3rem;
  `;
  const IconButton = styled(BaseButton)`
  border-radius: 0.5rem 0 0 0.5rem;
`;

export const TopMenuButton = styled(MenuButton)`
  padding-block: 0;
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