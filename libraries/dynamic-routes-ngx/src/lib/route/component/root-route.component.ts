import {ChangeDetectionStrategy, Component, inject, InjectionToken} from '@angular/core';
import {AsyncPipe, NgIf} from "@angular/common";
import {ContentNodeContentType, RouteManager, RouteNode} from "@jamesbenrobb/dynamic-routes";

import {
  AppContentLoaderDirective,
  DEFAULT_CONTENT_LOADER_COMPONENT
} from "../../components/app-content-loader/app-content-loader.directive";


export const ContentComponentTypeService = new InjectionToken<string>(
  'ContentComponentTypeService', {
    factory: () => DEFAULT_CONTENT_LOADER_COMPONENT
  });


@Component({
  selector: 'jbr-dra-root-route',
  standalone: true,
  templateUrl: './root-route.component.html',
  imports: [
    NgIf,
    AsyncPipe,
    AppContentLoaderDirective
  ],
  styleUrls: ['./root-route.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RootRouteComponent<T extends ContentNodeContentType> {

  readonly #routesManager = inject(RouteManager<T>);

  readonly contentComponentType = inject(ContentComponentTypeService, {optional: true});
  readonly routeNodes$ = this.#routesManager.currentRouteNodes$;

  onRouteSelected(node: RouteNode<T>): void {
    this.#routesManager.navigateByNode(node);
  }
}
