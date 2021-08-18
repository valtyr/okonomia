function assertUnreachable(_x: never, defaultReturnValue: any = null): never {
  return defaultReturnValue as never;
}

export default assertUnreachable;
