// INFO: little workaround
// for Astro actions requiring different methods for client/server
export const isServer = typeof window === 'undefined';
