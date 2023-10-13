import { HttpResponse, HttpRequest } from "./HttpProcess";
export { HttpResponse, HttpRequest }

export function createEvent<Locals extends {[x: string]:any}>(request: Request) {
  const req = new HttpRequest(request)
  const res = new HttpResponse(request)
  const locals = {} as any
  const config = new HttpConfig<Locals>()

  return { req, res, locals, config } satisfies HttpEvent<Locals>
}

export class HttpConfig<Locals extends {[x:string]:any}> {
  public defers = [] as Cb<[HttpEvent<Locals>],MaybePromise<any>>[]
  public transforms = [] as Cb<[any,HttpEvent<Locals>],MaybePromise<any>>[]

  public handleFound = false;

  public transform(cb: Cb<[any,HttpEvent<Locals>],MaybePromise<any>>) {
    this.transforms.push(cb)
  }

  public defer(cb: Cb<[HttpEvent<Locals>],MaybePromise<any>>) {
    this.defers.push(cb)
  }
};

