import { HttpResponse, HttpRequest } from "./HttpProcess";

export function createEvent<Locals extends {[x: string]:any}>(request: Request) {
  const req = new HttpRequest(request)
  const res = new HttpResponse(request)
  const locals = {} as any
  const config = new HttpConfig<Locals>()

  return { req, res, locals, config } satisfies HttpEvent<Locals>
}

export class HttpConfig<Locals extends {[x:string]:any}> {
  public defers = [] as ((e: HttpEvent<Locals>) => any | Promise<any>)[]
  public transforms = [] as ((body: any, e: HttpEvent<Locals>) => any | Promise<any>)[]

  public handleFound = false;

  public transform(cb: (body: any, e: HttpEvent<Locals>) => any | Promise<any>) {
    this.transforms.push(cb)
  }

  public defer(cb: (e: HttpEvent<Locals>) => any) {
    this.defers.push(cb)
  }

}

