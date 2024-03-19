import {Observable} from "rxjs";
import {ContentNodeContentType, RouteNode} from "./route-config.types";


export interface RouterAdapter<T extends ContentNodeContentType> {
  currentRouteNodes: RouteNode<T>[];
  routeNodesChange$: Observable<RouteNode<T>[]>;
  urlChange$: Observable<string>;
  navigateByUrl(path: string | string[]): void;
}
