import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {ContentNodeContentType, RouteManager} from "@jamesbenrobb/dynamic-routes";


@Component({
  selector: 'jbr-dra-app-content-container',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterOutlet
  ],
  templateUrl: './app-content-container.component.html',
  styleUrl: './app-content-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppContentContainerComponent<T extends ContentNodeContentType> {

  protected readonly routesManager = inject(RouteManager<T>);
}
