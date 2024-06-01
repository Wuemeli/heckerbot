

declare namespace NodeJS {
  interface Global {
    log: typeof logging;
  }
}