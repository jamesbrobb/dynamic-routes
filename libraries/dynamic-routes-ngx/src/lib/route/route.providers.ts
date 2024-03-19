import {APP_INITIALIZER, EnvironmentProviders, InjectionToken, Provider} from "@angular/core";
import {provideRouter, Router} from "@angular/router";
import {ConfigLoader} from "@jamesbenrobb/core";
import {Title} from "@angular/platform-browser";

import {RouteManager, ContentNodeContentType, getAllChildNodes, RoutesConfig} from "@jamesbenrobb/dynamic-routes";

import {getAppRoutes} from "./routes";
import {NgRouterAdaptor} from "./router.adaptor";


export const RoutesConfigService = new InjectionToken<ConfigLoader<RoutesConfig<any>>>('RoutesConfigService');


export function getRouteProviders<T extends ContentNodeContentType>(
  configPath: string,
  appName: string,
  getAllChildNodes?: getAllChildNodes<T>
): (Provider | EnvironmentProviders)[] {
  return [
    provideRouter(getAppRoutes<T>()),
    {
      provide: RouteManager<T>,
      useFactory: (configLoader: ConfigLoader<RoutesConfig<T>>, router: Router, titleService: Title) => {
        const routes = configLoader.getValueByKey("routes");
        if (!routes) {
          throw new Error("Routes not found");
        }
        return new RouteManager<T>(
          routes,
          new NgRouterAdaptor(router, titleService, appName),
          getAllChildNodes
        );
      },
      deps: [
        RoutesConfigService,
        Router,
        Title
      ]
    }, {
      provide: APP_INITIALIZER,
      useFactory: (configLoader: ConfigLoader<RoutesConfig<T>>) => {
        return () => configLoader.load();
      },
      deps: [RoutesConfigService],
      multi: true
    }, {
      provide: RoutesConfigService,
      useValue: new ConfigLoader<RoutesConfig<T>>(configPath)
    }
  ];
}
