import {BehaviorSubject, filter} from "rxjs";
import {NavigationEnd, ResolveEnd, Router, RouterEvent} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {ContentNodeContentType, RouteNode, RouterAdapter} from "@jamesbenrobb/dynamic-routes";


export class NgRouterAdaptor<T extends ContentNodeContentType> implements RouterAdapter<T> {

  readonly #router: Router;
  readonly #routeNodes = new BehaviorSubject<RouteNode<T>[]>([]);
  readonly #url = new BehaviorSubject<string>('');

  readonly routeNodesChange$ = this.#routeNodes.asObservable();
  readonly urlChange$ = this.#url.asObservable();

  get currentRouteNodes(): RouteNode<T>[] {
    return this.#routeNodes.getValue();
  }

  constructor(router: Router, titleService: Title, appName: string = '') {
    this.#router = router;
    this.#router.events
      .pipe(filter(event => event instanceof NavigationEnd || event instanceof ResolveEnd))
      .subscribe(event => {

        if(event instanceof ResolveEnd) {
          const routedNodes = event.state.root.firstChild?.data['routeNodes'] || [],
            currentRoute = routedNodes.length ? routedNodes[routedNodes.length - 1] : null,
            currentRouteTitle = currentRoute ? `${currentRoute.label ?? currentRoute.path.replaceAll('-', ' ') }` : '',
            title = `${appName}${appName && currentRouteTitle ? ' - ' : ''} ${currentRouteTitle}`;

          titleService.setTitle(title);

          this.#routeNodes.next(routedNodes);
        }

        if(event instanceof NavigationEnd) {
          this.#url.next((event as RouterEvent).url);
        }
      });
  }

  navigateByUrl(path: string | string[]): void {
    if (!Array.isArray(path)) {
      path = [path]
    }
    this.#router.navigate(path);
  }
}
