declare module "*.png" {
  const value: string;
  export = value;
}

declare module "*.jpg" {
  const value: string;
  export = value;
}
declare module '*.module.css' {
  const styles: { [className: string]: string };
  export = styles;
}