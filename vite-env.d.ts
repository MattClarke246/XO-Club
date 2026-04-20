/// <reference types="vite/client" />

declare module '*.JPEG' {
  const src: string;
  export default src;
}
declare module '*.jpg' {
  const src: string;
  export default src;
}
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '@shopify/storefront-api-client';
