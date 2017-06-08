declare module 'react-loadable' {
  export type LoadingProps = {
    isLoading: boolean;
    error: Error | null;
    pastDelay: boolean;
  };
  type Factory<P> = React.ComponentClass<P> | React.StatelessComponent<P>;

  export type LoadableConfig<P> = {
    loader<P>(): PromiseLike<Factory<P> | { default: Factory<P> }>;
    LoadingComponent: Factory<LoadingProps>;
    delay?: number;
  };
  export type Loadable<P> = Factory<P> & {
    preload(): void;
  };
  export type LoadbleFactory = <P>(config: LoadableConfig<P>) => Loadable<P>;
  const Loadable: LoadbleFactory;
  export default Loadable;
}
