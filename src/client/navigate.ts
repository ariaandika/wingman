import { httpFetch } from "./fetch"
import { DEF_APP, DEF_SWAP, applyDomAction, parseDomAction, query, } from "./main"

type popstate = { html: string, appId: string, swap: string }

window.addEventListener('popstate', popState)
document.addEventListener('click', anchor)


function popState(e: PopStateEvent) {
  if (e.state) {
    const { html, appId, swap } = e.state as popstate

    const target = document.querySelector(appId) ?? app()

    if (!target) {
      return console.error('Invalid Target:',appId)
    }

    (target as any)[swap] = html
  }
}


async function anchor(e: MouseEvent) {
  const target = e.target as HTMLAnchorElement
  const dom = parseDomAction(target)
  const currentApp = app(dom.targetAtr)
  const anchorMode = target.target
  
  if (!currentApp ||
      target.tagName !== 'A' ||
      anchorMode === "_blank" ||
      anchorMode === "_self"
     )
  return

  e.preventDefault()

  dom.target = currentApp
  
  anchorNavigate(target.href, dom)
}


export async function anchorNavigate(href: string, {
  target = app(),
  swap = DEF_SWAP,
  appId = DEF_APP,
  pushState = true
}) {
  const res = await httpFetch(href)
  const html = await res.text()
  
  if (pushState) {
    history.pushState({ html, appId, swap } satisfies popstate,'',href);
  }

  applyDomAction({ target, swap }, html)
}


function app(custom?: string | null) {
  return custom ? query(custom) : (
    document.querySelector(DEF_APP) ?? document.body
  )
}




