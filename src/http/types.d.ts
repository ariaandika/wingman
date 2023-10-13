import type { HttpRequest, HttpResponse } from "./HttpProcess"
import type { HttpConfig } from "./Http"


declare global {
  interface HttpEvent<Locals extends { [x: string]: any } = any> {
    req: HttpRequest
    res: HttpResponse
    config: HttpConfig<Locals>
    locals: Locals
  }
}

