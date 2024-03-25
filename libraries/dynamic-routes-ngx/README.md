# Dynamic Routes Ngx
<br/>

## What.

An Angular implementation of `@jamesbenrobb/dynamic-routes`.

A simple configurable app shell using Angular Material components, for quickly creating applications with dynamic routing. [Demo.](https://dynamic-routes-app-demo.jamesrobb.work/)
<br/><br/>

## Why.

Whilst creating Documentor (which required dynamic/configurable routes) it occurred to me that it may be useful to abstract out the underlying implementation/behaviour to use for other apps. So i did.
<br/><br/>

## What not.

A replacement for complex routing.
<br/><br/>

## How.

1. [Install](#install)
2. [Define route config json](#define-route-config-json)
3. [Add providers](#add-providers)
5. [Extending for your own use](#extending-for-your-own-use)
<br/><br/>

### Install

```bash
npm i @jamesbenrobb/dynamic-routes-ngx@latest
```
<br/>

### Define route config json

```json
{
  "routes": [{
    "path": "/",
    "redirectTo": "one"
  }, {
    "path": "one",
    "content": {
      "someProp": "someValue"
    }
  }, {
    "path": "two",
    "label": "2",
    "content": {
      "someOtherProp": "someOtherValue"
    },
    "children": [{
      "path": "two-first-child",
      "content": {}
    }]
  }, {
    "path": "three",
    "content": {
      "someOtherProp": "someOtherValue"
    },
    "children": [{
      "path": "three-first-child",
      "content": {}
    }, {
      "path": "three-second-child",
      "content": {},
      "children": [{
        "path": "three-second-child-first-child",
        "content": {}
      }]
    }]
  }]
}
```
<br/>

### Add providers

```ts
import {ApplicationConfig} from '@angular/core';
import {getJBRDRAppProviders} from "@jamesbenrobb/dynamic-routes-ngx";


export const appConfig: ApplicationConfig = {
  providers: [
    getJBRDRAppProviders(
      'assets/route-config.json'
    )
  ]
};
```
<br/>

## Extending for your own use.

1. [Provider options](#provider-options)
2. [Add your own content component](#add-your-own-content-component)
3. 
<br/><br/>
 
### Provider options

```ts
export type JBRDRAppProvidersOptions<T extends ContentNodeContentType> = {
  appName?: string,
  getAllChildNodes?: getAllChildNodes<T>
  contentComponentType?: string
}
```
<br/>

### Add your own content component

Create a component that implements [`ContentLoaderComponentIO`](https://github.com/jamesbrobb/dynamic-routes/blob/main/libraries/dynamic-routes-ngx/src/lib/components/app-content-loader/app-content-loader.directive.ts)

```ts
import {Component, Output} from "@angular/core";
import {ContentLoaderComponentIO} from "@jamesbenrobb/dynamic-routes-app";

@Component({
  selector: 'my-content-component',
  templateUrl: '...',
  styleUrls: ['...'],
  standalone: true
})
export class MyContentComponent implements ContentLoaderComponentIO<YourContentType> {
  @Input() routeNodes?: RouteNode<YourContentType>[] | undefined
  @Input() currentNode?: RouteNode<YourContentType> | undefined
  @Input() currentContent?: YourContentType | undefined

  @Output() routeSelected = new EventEmitter<RouteNode<>>(); // this is optional
}
```

Register the component with the `ComponentLoaderMapService` (see details on registering components [here](https://github.com/jamesbrobb/jbr/tree/main/libraries/ui/src/lib/component-loader)) and add the provider to your app

```ts
import {Provider} from "@angular/core";
import {ComponentLoaderMapService} from "@jamesbenrobb/ui";


const provider: Provider = {
  provide: ComponentLoaderMapService,
  useValue: {
    'my-content-component': {
      import: () => import('./my-content.component'),
      componentName: 'MyContentComponent'
    }
  },
  multi: true
}
```

Supply the registered name of you content component to `getJBRDRAppProviders`

```ts
import {ApplicationConfig} from '@angular/core';
import {getJBRDRAppProviders} from "@jamesbenrobb/dynamic-routes-ngx";


export const appConfig: ApplicationConfig = {
  providers: [
    getJBRDRAppProviders(
      'assets/route-config.json',
      {
        appName: 'My app name',
        contentComponentType: 'my-content-component'
      }
    )
  ]
};
```
