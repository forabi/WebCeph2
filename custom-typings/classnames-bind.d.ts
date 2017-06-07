declare module 'classnames/bind' {
  import classnames from 'classnames';
  type Bindable = {
    bind<T extends string>(
      classNames: Record<T, string>,
    ): (...classNames: (T | T[])[]) => string;
    bind(classNames: object): typeof classnames;
  };
  const bindable: Bindable;
  export = bindable;
}
