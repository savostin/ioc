"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inject = exports.IocContainer = exports.InjectorResolutionError = void 0;
class InjectorResolutionError extends Error {
    constructor(type) {
        super(`Unable to resolve type ${type}`);
    }
}
exports.InjectorResolutionError = InjectorResolutionError;
let injectContext = null;
class IocContainer {
    constructor() {
        this.bindings = new Map();
        this.instances = new Map();
        injectContext = this;
    }
    bind(ctor) {
        this.bindings.set(ctor.name, ctor);
    }
    create(ctor, ...cargs) {
        injectContext = this;
        if (this.bindings.has(ctor.name)) {
            if (this.instances.has(ctor.name)) {
                return this.instances.get(ctor.name);
            }
            const binding = this.bindings.get(ctor.name);
            const inst = Reflect.construct(binding, cargs);
            this.instances.set(ctor.name, inst);
            return inst;
        }
        throw new InjectorResolutionError(ctor.name);
    }
    get(ctor) {
        if (this.bindings.has(ctor.name)) {
            if (this.instances.has(ctor.name)) {
                return this.instances.get(ctor.name);
            }
        }
        throw new InjectorResolutionError(ctor.name);
    }
}
exports.IocContainer = IocContainer;
function inject(ctor, ...cargs) {
    if (!injectContext)
        throw new Error("No container");
    injectContext.bind(ctor);
    return injectContext.create(ctor, ...cargs);
}
exports.inject = inject;
