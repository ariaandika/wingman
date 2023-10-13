
type MaybePromise<T> = T | Promise<T>;
type Cb<const Param extends Array = [],Ret = void> = (...arg: Param) => Ret;

declare var log: <T>(val?: T | null | undefined) => NonNullable<T>
declare var production: boolean

declare namespace H{
  export const e: (tag: any, attrs: any, ...childs: any) => any
}
