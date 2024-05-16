declare module "*.png" {
  const value: any;
  export = value;
}

declare module "*.jpg" {
  const value: any;
  export = value;
}
declare module '*.module.css' {
  const styles: { [className: string]: string };
  export = styles;
}