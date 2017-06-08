declare module 'classnames/bind' {
  import classnames from 'classnames';
  type ClassValue<T extends string> = T | Partial<Record<T, boolean>>;
  type Bindable = {
    bind<T extends string>(
      classNames: Record<T, string>,
    ): (...classNames: Array<ClassValue<T>>) => string;
    bind(classNames: object): typeof classnames;
  };
  const bindable: Bindable;
  export = bindable;
}
