export type RealClass<T = unknown> = new (...args: any[]) => T;
export type AbstractClass<T = unknown> = abstract new (...args: any[]) => T;
export type AnyClass<T = unknown> = RealClass<T> | AbstractClass<T>;
export declare class InjectorResolutionError extends Error {
    constructor(type: string);
}
export declare class IocContainer {
    private bindings;
    private instances;
    constructor();
    bind<T>(ctor: AnyClass<T>): void;
    create<T>(ctor: AnyClass<T>, ...cargs: any[]): T;
    get<T>(ctor: AnyClass<T>): T;
}
export declare function inject<T>(ctor: AnyClass<T>, ...cargs: any[]): T;
