export type RealClass<T = unknown> = new (...args: any[]) => T;
export type AbstractClass<T = unknown> = abstract new (...args: any[]) => T;
export type AnyClass<T = unknown> = RealClass<T> | AbstractClass<T>;

export class InjectorResolutionError extends Error {
  public constructor(type: string) {
    super(`Unable to resolve type ${type}`);
  }
}

let injectContext: IocContainer | null = null;

export class IocContainer {
  private bindings = new Map<string, any>();
  private instances = new Map<string, any>();

  public constructor() {
    injectContext = this;
  }

  public bind<T>(ctor: AnyClass<T>) {
    this.bindings.set(ctor.name, ctor);
  }

  public create<T>(ctor: AnyClass<T>, ...cargs: any[]): T {
    injectContext = this;
    if (this.bindings.has(ctor.name)) {
      if (this.instances.has(ctor.name)) {
        return this.instances.get(ctor.name);
      }
      const binding = this.bindings.get(ctor.name);
      const inst = Reflect.construct(binding, cargs) as T;
      this.instances.set(ctor.name, inst);
      return inst;
    }
    throw new InjectorResolutionError(ctor.name);
  }

  public get<T>(ctor: AnyClass<T>): T {
    if (this.bindings.has(ctor.name)) {
      if (this.instances.has(ctor.name)) {
        return this.instances.get(ctor.name);
      }
    }
    throw new InjectorResolutionError(ctor.name);
  }
}

export function inject<T>(ctor: AnyClass<T>, ...cargs: any[]): T {
  if (!injectContext) throw new Error("No container");
  injectContext.bind(ctor);
  return injectContext.create(ctor, ...cargs);
}
