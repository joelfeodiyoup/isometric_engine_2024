import texture from "./../images/repeating.jpg";

/**
 * Have some central place to reference colours used for styling.
 * I could alternatively use css variables, to be able to change these at run time.
 * This is alright for now.
 */
export const colors = {
    lightBlue: '#39B0E1',
    mediumBlue: '#1e7499',
    darkBlue: '#0E4B76',
    lightRed: '#C2B4B9',
    darkRed: '#420505',
    brightRed: '#b11515',
    texturedBackground: `linear-gradient(rgba(57,176,225, 0.8), rgba(57,176,225, 0.8)), url('${texture}')`,
    border: '#b11515',
    borderWidth: '0.25rem',
  }