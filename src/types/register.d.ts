/// <reference path="./jsx.d.ts" />
/// <reference path="./extra.d.ts" />

import type { H } from "../print/print"
import type { HttpConfig, HttpRequest, HttpResponse } from "../http/Http"

declare global {
  // for jsx
  var H: typeof H

  interface HttpEvent<Locals extends { [x: string]: any } = any> {
    req: HttpRequest
    res: HttpResponse
    config: HttpConfig<Locals>
    locals: Locals
  }
}

