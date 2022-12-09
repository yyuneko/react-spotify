type SvgComponent = React.StatelessComponent<React.SVGAttributes<SVGElement>>;
declare module "*.svg" {
  const content: SvgComponent;
  export default content;
}

declare module "*.png" {
  const content: any;
  export default content;
}
declare module "*.jpg" {
  const content: any;
  export default content;
}
declare module "*.jpeg" {
  const content: any;
  export default content;
}
declare module "*.gif" {
  const content: any;
  export default content;
}
declare module "*.less" {
  const resource: { [key: string]: string };
  export = resource;
}
