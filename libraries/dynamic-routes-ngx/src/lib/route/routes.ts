import {Routes} from "@angular/router";
import {ContentNodeContentType} from "@jamesbenrobb/dynamic-routes";
import {shouldRedirect} from "./route.guards";
import {getRouteNodes} from "./route.resolvers";
import {RootRouteComponent} from "./component/root-route.component";


export function getAppRoutes<T extends ContentNodeContentType>(): Routes {
  return [
    {
      path: '**',
      component: RootRouteComponent<T>,
      canActivate: [shouldRedirect],
      resolve: {
        routeNodes: getRouteNodes<T>
      }
    },
  ]
}
