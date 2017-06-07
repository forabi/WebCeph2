declare module 'react-loadable' {
  export type LoadingProps = {
    isLoading: boolean;
    error: Error | null;
    pastDelay: boolean;
  };
  type Factory<P> = (props: P) => React.ReactElement<P>;

  export type LoadableConfig<P> = {
    loader: <P, S>() => PromiseLike<React.Component<P, S>>;
    LoadingComponent: Factory<LoadingProps>;
    delay?: number;
  };
  export type Loadable<P> = Factory<P> & {
    preload(): void;
  };
  export type LoadbleFactory = <P>(config: LoadableConfig<P>) => Loadable<P>;
  const Loadble: LoadbleFactory;
  export default Loadble;
}
