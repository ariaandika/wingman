import { httpFetch } from "./fetch"
import { INVALIDATE, applyDomAction, parseDomAction } from "./main"

declare global {
  interface EventType {
    invalidate: { id: string },
    clientNavigate: { url: string },
    exception: { error: any }
  }
}

export const event = {
  listeners: [] as [keyof EventType,CallableFunction][],

  subscribe<T extends keyof EventType>(event: T, cb: Cb<[EventType[T]],MaybePromise<Cb | void>>) {
    this.listeners.push([event,cb])
    return this
  },

  unsubscribe(cb: Cb<[EventType[keyof EventType]],MaybePromise<Cb | void>>) {
    this.listeners.splice(this.listeners.findIndex(e=>e[1]==cb),1)
    return this
  },

  emit<T extends keyof EventType>(event: T, data: EventType[T]) {
    for (let i = 0,len = this.listeners.length; i < len; i++) {
      const [ev,cb] = this.listeners[i]
      if (ev != event) continue
      try {
        cb(data)
      } catch (error) {
        
      }
    }
    return this
  }
}


// invalidate event
document.querySelectorAll(`[${INVALIDATE}]`).forEach(elem => event.subscribe('invalidate',async ev => {
  const [url,id] = elem.getAttribute(INVALIDATE)!.split(' ')
  if (id && ev.id != id) return

  const res = await httpFetch(url)
  const dom = parseDomAction(elem)
  applyDomAction(dom, await res.text())
}))



