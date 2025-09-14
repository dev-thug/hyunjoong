declare module "next-pwa" {
  import type { NextConfig } from "next";

  type NextPWAOptions = {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    // Allow any extra options to avoid over-constraining
    [key: string]: unknown;
  };

  type WithPWA = (config: NextConfig) => NextConfig;

  /**
   * next-pwa default export: a function that accepts PWA options and returns a Next config enhancer
   */
  export default function nextPWA(options?: NextPWAOptions): WithPWA;
}
