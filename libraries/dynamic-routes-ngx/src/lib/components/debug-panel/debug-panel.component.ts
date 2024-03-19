import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {JsonPipe} from "@angular/common";
import {ContentNodeContentType, RouteNode} from "@jamesbenrobb/dynamic-routes";


@Component({
  selector: 'jbr-dra-debug-panel',
  standalone: true,
  imports: [
      JsonPipe
  ],
  templateUrl: './debug-panel.component.html',
  styleUrl: './debug-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebugPanelComponent<T extends ContentNodeContentType> {
  @Input() nodes: RouteNode<T>[] | undefined;
  @Input() node: RouteNode<T> | undefined;
  @Input() content: T | undefined;
}
