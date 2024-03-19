import {EnvironmentProviders, Provider} from "@angular/core";
import {ContentNodeContentType, getAllChildNodes} from "@jamesbenrobb/dynamic-routes";
import {getContentComponentProviders} from "./components/app-content-loader/app-content-loader.providers";
import {getRouteProviders} from "./route";


export function getAppProviders<T extends ContentNodeContentType>(
  configPath: string,
  appName: string = 'Demo App',
  getAllChildNodes?: getAllChildNodes<T>
): (Provider | EnvironmentProviders)[] {
  return [
    getRouteProviders(
      configPath,
      appName,
      getAllChildNodes
    ),
    getContentComponentProviders() // options?.contentComponentType
  ]
}
