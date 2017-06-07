declare module 'lodash/zipObject' {
  const zipObject: <K extends string, V>(
    keys: K[],
    values: V[],
  ) => Record<K, V>;
  export = zipObject;
}

declare module 'lodash/pick' {
  const pick: <T extends Record<string, any>, K extends keyof T>(
    obj: T,
    ...args: K[]
  ) => Pick<T, K>;
  export = pick;
}

declare module 'lodash/countBy' {
  const countBy: <T>(array: T[], el: T) => Record<'true' | 'false', number>;
  export = countBy;
}
