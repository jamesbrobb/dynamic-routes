

export type RoutesConfig<T extends ContentNodeContentType> = {
  routes: RouteNode<T>[]
}


export type ContentNodeContentType = {
  [key: PropertyKey]: unknown
}

export type RouteNodeBase = {
  path: string
  label?: string
}

export type RedirectNode = {
  redirectTo: string
} & RouteNodeBase

export type ContentNode<T extends ContentNodeContentType> = {
  content: T
} & RouteNodeBase

export type ParentNode<T extends ContentNodeContentType> = {
  children: (RedirectNode | ParentNode<T> | ContentNode<T>)[]
} & RouteNodeBase


export type RouteNode<T extends ContentNodeContentType> = RedirectNode | ContentNode<T> | ParentNode<T>

export type getAllChildNodes<T extends ContentNodeContentType> = (node: RouteNode<T>) => RouteNode<T>[]
