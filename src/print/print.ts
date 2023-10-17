const voidElem = [ 'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr', ]

/** html api */
export class Html {

  /**
   * wrap response with layout if no pr-request header exist
   */
  static use(layout?: (i: { slot: any, event: HttpEvent<{ html: HTMLConfig }> }) => JSX.Element) {
    return (event: HttpEvent) => {

      event.config.transform(async (body, event) => {
        if (body instanceof H) {

          let htmlBuilder: InstanceType<typeof H>
          const opt = event.locals.html

          if (!event.req.headers.get('pr-request') && layout) {
            htmlBuilder = await layout({ slot: body, event }) as InstanceType<typeof H>
          } else {
            htmlBuilder = body
          }

          // NOTE: safe is separate variable, because build is depth first, meaning if
          // in the depth safe changes, the shallow element will be affected

          let resultBody = await htmlBuilder.build(true)

          let heads = ''

          for (let i = 0, len = opt.heads.length; i < len; i++) {
            heads += (typeof opt.heads[i] == 'string') ? opt.heads[i] : (await (opt.heads[i] as any as H).build(true))
          }

          if (!event.req.headers.get('pr-request')) {
            resultBody = Html.Base({ slot: resultBody, heads })
          }
          
          return resultBody
        }
        return body
      })

      // API
      return { html: { heads: [] as (string|JSX.Element)[] } satisfies HTMLConfig }
    }
  }


  private static concatedHeader = ''

  static Base = ({ slot, heads }: { slot: string, heads: string }) => {
    return `<html><head>${this.concatedHeader}${heads}</head><body>${slot}</body></html>`
  }

  /** assign header element globally */
  static assignHeader(...headers: (Elem | string)[]) {
    for (let i = 0, len = headers.length; i < len; i++) {
      const e = headers[i]
      if (typeof e == 'string') {
        this.concatedHeader += e
        continue
      }
      e.build(true).then(f => Html.concatedHeader += f)
    }
  }
}

declare global {
  type Elem = InstanceType<typeof H>
}

/** html builder */
export class H {
  constructor(
    public tag: any,
    public attrs: any,
    public childs: any[] // H, undefined, string
  ) { }

  async build(safe: boolean): Promise<string> {
    let thisSafe = safe

    // FRAGMENT
    if (this.tag === undefined) {
      return H.childResolution.call(this, thisSafe, '')
    }
    // COMPONENT
    if (typeof this.tag == 'function') {
      const app = this.attrs ?? {}
      app.slot = this.childs
      const h = await this.tag(app) as InstanceType<typeof H>
      return await h.build(thisSafe)
    }

    // REGULAR
    let atr = ''

    if (this.attrs) {
      const entr = Object.entries(this.attrs)

      for (let i = 0, len = entr.length; i < len; i++) {
        let [attrKey,val]: [string,any] = entr[i];

        /// SPECIAL ATTRIBUTES
        if (attrKey === 'safe') {
          thisSafe = typeof val == 'string' ? (val === 'false' ? false : true) : (val ? true : false)
          continue
        }

        if (val === null || val === undefined || val === false)
          continue;

        if (val === true) {
          atr += ` ${attrKey}`;
          continue
        }

        atr += ` ${attrKey}="${val}"`;
      }
    }

    if (this.tag === 'script') {
      return `<script${atr}>${this.childs[0]}</script>`
    }

    if (voidElem.includes(this.tag)) {
      return `<${this.tag}${atr}/>`
    }

    return H.childResolution.call(this, thisSafe, atr)
  }



  static async childResolution(this: H, thisSafe: boolean, atr: string) {
    let content = ''

    for (let i = 0,len = this.childs.length; i < len; i++) {
      const elem = this.childs[i]

      if (elem instanceof H) {
        content += await elem.build(thisSafe)
        continue
      }

      if (Array.isArray(elem)) {
        this.childs.splice(i,1,...elem)
        len = this.childs.length
        i -= 1
        continue
      }

      if (elem === '') continue

      if (typeof elem == 'string' || typeof elem == 'number') {
        content += thisSafe ? Bun.escapeHTML(elem) : elem;
        continue
      }

      if (elem === null || elem === undefined || elem === false) continue

      if (typeof elem == 'object') {
        content += thisSafe ? Bun.escapeHTML(JSON.stringify(elem)) : JSON.stringify(elem);
        continue
      }

      throw new Error(`child typeof "${typeof elem}", unimplemented`);
    }

    if (this.tag === undefined) {
      return content
    }

    return `<${this.tag}${atr}>${content}</${this.tag}>`
  }

  /** JSX api */
  static e(tag: any, attrs: any, ...childs: any[]) {
    return new H(tag, attrs, childs)
  }
}

type HTMLConfig = {
  heads: (string | JSX.Element)[]
}

export type HTMLUserConfig = {
  static: boolean
}

