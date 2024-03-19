import {ComponentLoaderMapService} from "@jamesbenrobb/ui";
import {EnvironmentProviders, makeEnvironmentProviders, Provider} from "@angular/core";
import {ContentComponentTypeService} from "../../route/component/root-route.component";


export function getContentComponentProviders(componentType?: string): EnvironmentProviders {

  const providers: Provider[] = [{
    provide: ComponentLoaderMapService,
    useValue: {
      'default-app-content': {
        import: () => import('../app-content/app-content.component'),
        componentName: 'DefaultAppContentComponent'
      },
    },
    multi: true
  }];

  if(componentType) {
    providers.push({
      provide: ContentComponentTypeService,
      useValue: componentType
    });
  }

  return makeEnvironmentProviders(providers);
}
