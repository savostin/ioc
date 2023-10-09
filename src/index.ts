export type RealClass<T = unknown> = new (...args: any[]) => T;
export type AbstractClass<T = unknown> = abstract new (...args: any[]) => T;
export type AnyClass<T = unknown> = RealClass<T> | AbstractClass<T>;

export class InjectorResolutionError extends Error {
  public constructor(type: string) {
    super(`Unable to resolve type ${type}`);
  }
}

export class IocContainer {
  private bindings = new Map<string, any>();
  private instances = new Map<string, any>();

  public constructor() {}

  public bind<T>(ctor: AnyClass<T>, cargs: Array<any>) {
    this.bindings.set(ctor.name, { className: ctor.name, cargs });
  }

  public get<T>(ctor: AnyClass<T>): T {
    if (this.bindings.has(ctor.name)) {
      if (this.instances.has(ctor.name)) {
        return this.instances.get(ctor.name);
      }
      const { className, cargs } = this.bindings.get(ctor.name);
      const inst = Reflect.construct(className, cargs) as T;
      this.instances.set(ctor.name, inst);
      return inst;
    }
    throw new InjectorResolutionError(ctor.name);
  }
}

let injectContext: IocContainer = new IocContainer();

export function inject<T>(ctor: AnyClass<T>, cargs: Array<any>): T {
  injectContext.bind(ctor, cargs);
  return injectContext.get(ctor);
}
