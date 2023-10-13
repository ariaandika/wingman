/// <reference path="./jsx.d.ts" />
/// <reference path="./extra.d.ts" />

import type { H } from "../print/print"

declare global {
  // for jsx
  var H: typeof H
}
