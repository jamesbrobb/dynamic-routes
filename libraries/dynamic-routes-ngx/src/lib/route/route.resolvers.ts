import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {inject, InjectionToken} from "@angular/core";
import {ContentNodeContentType, RouteNode, RouteManager} from "@jamesbenrobb/dynamic-routes";


export type ResolvedData<T extends ContentNodeContentType> = {
  routeNodes: RouteNode<T>[],
  contentNode?: RouteNode<T>
  content: T
}


export const NODES_RESOLVER = new InjectionToken<ResolveFn<any>>('NODES_RESOLVER');
export const CONTENT_RESOLVER = new InjectionToken<ResolveFn<any>>('CONTENT_RESOLVER');


export const getRouteNodes =
  <T extends ContentNodeContentType>(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): RouteNode<T>[] | undefined => {
    const routesManager = inject(RouteManager<T>);
    //const contentResolver = inject(CONTENT_RESOLVER, {optional: true});

    return routesManager.getRouteNodesByPath(state.url);
  }
