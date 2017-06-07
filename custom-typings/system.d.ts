declare type SystemType = {
  import<T>(module: string): PromiseLike<T>;
};

declare const System: SystemType;
