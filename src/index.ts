/**
 * Helper classes to hide real class implementation by covering with AnyClass
 */
export type RealClass<T = unknown> = new (...args: any[]) => T;
export type AbstractClass<T = unknown> = abstract new (...args: any[]) => T;
export type AnyClass<T = unknown> = RealClass<T> | AbstractClass<T>;

/**
 * Error thrown if there is no such type registered in the container
 */
export class InjectorResolutionError extends Error {
  public constructor(type: string) {
    super(`Unable to resolve type ${type}`);
  }
}

/**
 * Singleton for current injection context
 */
let injectContext: IocContainer | null = null;

/**
 * The Container class
 */
export class IocContainer {
  /**
   * Bindings map. Keeps all container constructors
   */
  private bindings = new Map<string, any>();
  /**
   * Instanced map. Keeps all created instances
   */
  private instances = new Map<string, any>();

  /**
   * Creates an instance of IocContainer and sets current context to it
   */
  public constructor() {
    injectContext = this;
  }

  /**
   * Save constructor to the bindings list
   */
  public bind<T>(ctor: AnyClass<T>) {
    this.bindings.set(ctor.name, ctor);
  }

  /**
   * Create instance by class name or return already created one
   *
   * @public
   * @param {AnyClass<T>} ctor
   * @param {...any[]} cargs
   * @returns {T}
   * @throws {InjectorResolutionError}
   */
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

  /**
   * Get instance by class name
   *
   * @public
   * @param {AnyClass<T>} ctor
   * @returns {T}
   * @throws {InjectorResolutionError}
   */
  public get<T>(ctor: AnyClass<T>): T {
    if (this.bindings.has(ctor.name)) {
      if (this.instances.has(ctor.name)) {
        return this.instances.get(ctor.name);
      }
    }
    throw new InjectorResolutionError(ctor.name);
  }
}

/**
 * Injects instance by class name
 *
 * @export
 * @template T
 * @param {AnyClass<T>} ctor
 * @param {...any[]} cargs
 * @returns {T}
 */
export function inject<T>(ctor: AnyClass<T>, ...cargs: any[]): T {
  if (!injectContext) throw new Error("No container");
  injectContext.bind(ctor);
  return injectContext.create(ctor, ...cargs);
}
