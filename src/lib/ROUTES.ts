/* eslint-disable */
/**
 * This file was generated by 'vite-plugin-kit-routes'
 *
 *      >> DO NOT EDIT THIS FILE MANUALLY <<
 */

/**
 * PAGES
 */
const PAGES = {
  "/at": `/at`,
  "/at/login": `/at/login`,
  "/at/[handle]": (params: { handle: (string | number), skip_follow?: ("true" | "false") }) => {
    return `/at/${params.handle}${appendSp({ skip_follow: params.skip_follow })}`
  },
  "/at/[handle]/extra": (params: { handle: (string | number) }) => {
    return `/at/${params.handle}/extra`
  },
  "/at/starter-packs": `/at/starter-packs`,
  "/blog": `/blog`,
  "/blog/[link_under_blog]": (params: { link_under_blog: (string | number) }) => {
    return `/blog/${params.link_under_blog}`
  },
  "/blog/[pds]/[repo]/[collection]/[rkey]": (params: { pds: (string | number), repo: (string | number), collection: (string | number), rkey: (string | number) }) => {
    return `/blog/${params.pds}/${params.repo}/${params.collection}/${params.rkey}`
  },
  "/thumb-meta": `/thumb-meta`,
  "/thumb-meta/[videoId]": (params: { videoId: (string | number) }) => {
    return `/thumb-meta/${params.videoId}`
  }
}

/**
 * SERVERS
 */
const SERVERS = {
  "GET /api/healthz": `/api/healthz`,
  "GET /at/plc/[did]": (params: { did: (string | number) }) => {
    return `/at/plc/${params.did}`
  },
  "GET /at/plc/count": `/at/plc/count`,
  "GET /at/plc/last": `/at/plc/last`,
  "GET /at/plc/sync": `/at/plc/sync`
}

/**
 * ACTIONS
 */
const ACTIONS = {
  "login /at/login": `/at/login?/login`
}

/**
 * LINKS
 */
const LINKS = {
  
}

type ParamValue = string | number | undefined

/**
 * Append search params to a string
 */
export const appendSp = (sp?: Record<string, ParamValue | ParamValue[]>, prefix: '?' | '&' = '?') => {
  if (sp === undefined) return ''

  const params = new URLSearchParams()
  const append = (n: string, v: ParamValue) => {
    if (v !== undefined) {
      params.append(n, String(v))
    }
  }

  for (const [name, val] of Object.entries(sp)) {
    if (Array.isArray(val)) {
      for (const v of val) {
        append(name, v)
      }
    } else {
      append(name, val)
    }
  }

  const formatted = params.toString()
  if (formatted) {
    return `${prefix}${formatted}`
  }
  return ''
}

/**
 * get the current search params
 * 
 * Could be use like this:
 * ```
 * route("/cities", { page: 2 }, { ...currentSP() })
 * ```
 */ 
export const currentSp = () => {
  const params = new URLSearchParams(window.location.search)
  const record: Record<string, string> = {}
  for (const [key, value] of params.entries()) {
    record[key] = value
  }
  return record
}

// route function helpers
type NonFunctionKeys<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T]
type FunctionKeys<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]
type FunctionParams<T> = T extends (...args: infer P) => any ? P : never

const AllObjs = { ...PAGES, ...ACTIONS, ...SERVERS, ...LINKS }
type AllTypes = typeof AllObjs

export type Routes = keyof AllTypes extends `${string}/${infer Route}` ? `/${Route}` : keyof AllTypes
export const routes = [
	...new Set(Object.keys(AllObjs).map((route) => /^\/.*|[^ ]?\/.*$/.exec(route)?.[0] ?? route)),
] as Routes[]

/**
 * To be used like this: 
 * ```ts
 * import { route } from './ROUTES'
 * 
 * route('site_id', { id: 1 })
 * ```
 */
export function route<T extends FunctionKeys<AllTypes>>(key: T, ...params: FunctionParams<AllTypes[T]>): string
export function route<T extends NonFunctionKeys<AllTypes>>(key: T): string
export function route<T extends keyof AllTypes>(key: T, ...params: any[]): string {
  if (AllObjs[key] as any instanceof Function) {
    const element = (AllObjs as any)[key] as (...args: any[]) => string
    return element(...params)
  } else {
    return AllObjs[key] as string
  }
}

/**
* Add this type as a generic of the vite plugin `kitRoutes<KIT_ROUTES>`.
*
* Full example:
* ```ts
* import type { KIT_ROUTES } from './ROUTES'
* import { kitRoutes } from 'vite-plugin-kit-routes'
*
* kitRoutes<KIT_ROUTES>({
*  PAGES: {
*    // here, key of object will be typed!
*  }
* })
* ```
*/
export type KIT_ROUTES = {
  PAGES: { '/at': never, '/at/login': never, '/at/[handle]': 'handle', '/at/[handle]/extra': 'handle', '/at/starter-packs': never, '/blog': never, '/blog/[link_under_blog]': 'link_under_blog', '/blog/[pds]/[repo]/[collection]/[rkey]': 'pds' | 'repo' | 'collection' | 'rkey', '/thumb-meta': never, '/thumb-meta/[videoId]': 'videoId' }
  SERVERS: { 'GET /api/healthz': never, 'GET /at/plc/[did]': 'did', 'GET /at/plc/count': never, 'GET /at/plc/last': never, 'GET /at/plc/sync': never }
  ACTIONS: { 'login /at/login': never }
  LINKS: Record<string, never>
  Params: { handle: never, skip_follow: never, link_under_blog: never, pds: never, repo: never, collection: never, rkey: never, videoId: never, did: never }
}
