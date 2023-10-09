import { IocContainer, inject } from "../src";

class TestInjectableClass {
  constructor(public arg1?: any, public arg2?: any) {}
}

class TestInjectorClass {
  public constructor(public injected = inject(TestInjectableClass)) {}
}

class TestInjectorArgsClass {
  public constructor(
    public injected = inject(TestInjectableClass, 42, "string")
  ) {}
}

describe("IOC container", () => {
  it("Simple bind", () => {
    const c = new IocContainer();
    c.bind(TestInjectableClass);
    const testInstance = c.create(TestInjectableClass);
    expect(testInstance === c.get(TestInjectableClass)).toStrictEqual(true);

    expect(testInstance.arg1 === undefined).toStrictEqual(true);
    expect(testInstance.arg2 === undefined).toStrictEqual(true);
  });

  it("Simple bind with arguments", () => {
    const c = new IocContainer();
    c.bind(TestInjectableClass);
    const testInstance = c.create(TestInjectableClass, 42, "string");

    expect(testInstance === c.get(TestInjectableClass)).toStrictEqual(true);
    expect(testInstance.arg1 === 42).toStrictEqual(true);
    expect(testInstance.arg2 === "string").toStrictEqual(true);
  });

  it("Simple inject", () => {
    const c = new IocContainer();
    const injectorInstance = new TestInjectorClass();

    expect(
      injectorInstance.injected === c.get(TestInjectableClass)
    ).toStrictEqual(true);
    expect(injectorInstance.injected.arg1 === undefined).toStrictEqual(true);
    expect(injectorInstance.injected.arg2 === undefined).toStrictEqual(true);
  });

  it("Inject with arguments", () => {
    const c = new IocContainer();
    const injectorInstance = new TestInjectorArgsClass();

    expect(
      injectorInstance.injected === c.get(TestInjectableClass)
    ).toStrictEqual(true);
    expect(injectorInstance.injected.arg1 === 42).toStrictEqual(true);
    expect(injectorInstance.injected.arg2 === "string").toStrictEqual(true);
  });
});
