import { event } from "./event";
import { LOCATION_HEADER, REQUEST_HEADER } from "./main";

function reverseProxy(res: Response) {
  let targetLocation = res.headers.get(LOCATION_HEADER)

  if (targetLocation) {
    window.location.pathname = targetLocation
    return
  }
}

export async function httpFetch(url: string, opt?: Parameters<typeof fetch>[1]) {
  const o = opt ?? {} as any

  o.headers ??= {} as any
  o.headers[REQUEST_HEADER] = 'true'

  try {
    const res = await fetch(url,o)
    reverseProxy(res)
    return res
  } catch (error) {
    event.emit('exception',{ error })
    throw error
  }
}
