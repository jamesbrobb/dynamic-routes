import {Observable} from "rxjs";

import {
  RouteNode,
  ContentNodeContentType,
  getAllChildNodes
} from "./route-config.types";

import {isParentNode, isRouteNodeArray} from "./route-config.type-guards";
import {RouterAdapter} from "./router.adaptor";


export class RouteManager<T extends ContentNodeContentType> {

  readonly #routes: RouteNode<T>[];
  readonly #routerAdapter: RouterAdapter<T>;
  readonly #getAllChildNodes?: getAllChildNodes<T>;

  readonly currentRouteNodes$: Observable<RouteNode<T>[]>;
  readonly urlChange$: Observable<string>;

  get routes(): RouteNode<T>[] {
    return [...this.#routes];
  }

  constructor(
    routes: RouteNode<T>[],
    routerAdapter: RouterAdapter<T>,
    getAllChildNodes?: getAllChildNodes<T>
  ) {
    this.#routes = routes;
    this.#getAllChildNodes = getAllChildNodes;

    this.#routerAdapter = routerAdapter;
    this.currentRouteNodes$ = this.#routerAdapter.routeNodesChange$;
    this.urlChange$ = this.#routerAdapter.urlChange$;
  }

  navigateByUrl(path: string): void {
    this.#routerAdapter.navigateByUrl(path);
  }

  navigateByNode(node: RouteNode<T>): void {
    // loop through routeNodes and build path
    // check if node is node
    // check if node is child of node
    const routesNodes = this.#routerAdapter.currentRouteNodes;

    if(!routesNodes) {
      return;
    }

    let found = false;

    const nodes = routesNodes.filter((routeNode: RouteNode<T>) => {
      if(found) {
        return false;
      }

      if(routeNode === node) {
        found = true;
        return false;
      }

      found = this.#isChildNodeOf(routeNode, node);

      return true;
    });

    this.#routerAdapter.navigateByUrl([...nodes.map(node => node.path), node.path])
  }

  getRouteNodesByPath(path: string): RouteNode<T>[] | undefined {

    const parts = path === '/' ? [path] : path.split('/').filter(part => !!part);

    return this.#getNodesForPath(parts, this.#routes);
  }

  #isChildNodeOf(parentNode: RouteNode<T>, childNode: RouteNode<T>): boolean {

    const childNodes = this.#getChildNodes(parentNode);

    return childNodes.some(node => node === childNode);
  }

  #getNodesForPath(parts: string[], nodes: RouteNode<T>[]): RouteNode<T>[] | undefined {

    let childNodes: RouteNode<T>[] = nodes;

    const resNodes = parts.map((part, index) => {

      let routeNode = childNodes.find(node => node.path === part);

      childNodes = [];

      if(!routeNode) {
        return;
      }

      if(parts.length !== (index + 1)) {
        childNodes = this.#getChildNodes(routeNode);
      }

      return routeNode;
    });

    if(!isRouteNodeArray(resNodes)) {
      return;
    }

    return resNodes;
  }

  #getChildNodes(node: RouteNode<T>): RouteNode<T>[] {

    if(this.#getAllChildNodes) {
      return this.#getAllChildNodes(node);
    }

    if(isParentNode(node)) {
      return node.children;
    }

    return [];
  }
}
