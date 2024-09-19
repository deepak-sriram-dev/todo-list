export const RaiseError = (error: Error | unknown | undefined): never => {
  const raisedError = (error as Error) || "Something went wrong";
  throw Error(`${raisedError.name}`);
};
