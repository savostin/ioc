# IoC Container
Minimalistic IoC container with simple DI in TypeScript without dependencies and decorators.


## How to use
```bash
npm i git+https://github.com/savostin/ioc.git
```

Then use `inject` static function imported from the module:

```typescript
import { inject } from "ioc";

class MyClass {
    public contructor (public string arg1, public int arg2);
}

class MyOtherClass {
	public constructor(
		public someInstance = inject(MyClass, 'my param', 42)
	);
}

/* Later */

import IocContainer from "ioc";

const container = new IocContainer();

const otherInstance = new MyOtherClass();
const fromContainer = container.get(MyClass);

console.log(fromContainer === otherInstance.someInstance); // true

console.log(fromContainer.someInstance.arg1); // my param
console.log(fromContainer.someInstance.arg2); // 42

console.log(otherInstance.someInstance.arg1); // my param
console.log(otherInstance.someInstance.arg2); // 42
```

# Unsupported
* Primitive values
* Factories
* Types and Interfaces
* Decorators (no support from ``reflect-metadata`` package)