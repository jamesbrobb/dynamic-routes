import {EnvironmentProviders, Provider} from "@angular/core";
import {ContentNodeContentType, getAllChildNodes} from "@jamesbenrobb/dynamic-routes";
import {getContentComponentProviders} from "./components/app-content-loader/app-content-loader.providers";
import {getRouteProviders} from "./route";


export type JBRDRAppProvidersOptions<T extends ContentNodeContentType> = {
  appName?: string,
  getAllChildNodes?: getAllChildNodes<T>
  contentComponentType?: string
}


export function getJBRDRAppProviders<T extends ContentNodeContentType>(
  configPath: string,
  options?: JBRDRAppProvidersOptions<T>
): (Provider | EnvironmentProviders)[] {
  return [
    getRouteProviders(
      configPath,
      options?.appName || 'Demo App',
      options?.getAllChildNodes
    ),
    getContentComponentProviders(options?.contentComponentType)
  ]
}
