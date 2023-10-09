# IoC Container
Minimalistic IoC container with simple DI in TypeScript without dependencies and decorators.


## How to use
```bash
npm i --save git+https://github.com/savostin/ioc.git
```

Then use `inject` static function imported from the module:

```typescript
import { inject } from "@savostin/ioc";

class MyClass {
    constructor() {}
}

class MyOtherClass {
        public constructor(
                public someInstance = inject(MyClass)
        ){}
}

/* Later */

import { IocContainer } from "@savostin/ioc";

const container = new IocContainer();

const otherInstance = new MyOtherClass();
const fromContainer = container.get(MyClass);

console.log(fromContainer === otherInstance.someInstance); // true

```

# Unsupported
* Primitive values
* Factories
* Types and Interfaces
* Decorators (no support from ``reflect-metadata`` package)
* Deep injection