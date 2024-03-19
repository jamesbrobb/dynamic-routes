# Dynamic Route App
<br/>

## What.

A simple configurable app shell using Angular Material components, for quickly creating applications with dynamic routing. [Demo.](https://dynamic-routes-app-demo.jamesrobb.work/)
<br/>
<br/>

## Why.

Whilst creating Documentor (which required dynamic/configurable routes) it occurred to me that it may be useful to abstract out the underlying implementation/behaviour to use for other apps. So i did.
<br/>
<br/>

## What not.

A replacement for more complex routing.
<br/>
<br/>

## How.

1. [Install](#install)
2. [Define route config json](#define-route-config-json)
3. [Add providers](#add-providers)
4. [Include styles](#include-styles)
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
import {getJBRDRAAppProviders} from "@jamesbenrobb/dynamic-routes-ngx";


export const appConfig: ApplicationConfig = {
  providers: [
    ...getJBRDRAAppProviders(
      'assets/route-config.json',
      {appName: 'Demo App'}
    )
  ]
};
```
<br/>

### Include styles

```scss
@use "@jamesbenrobb/dynamic-routes-ngx/styles/jbr-dra-styles" as dra;

@include dra.setJBRDRAVars();
```
<br/>

## Extending for your own use.

1. [Provider options](#provider-options)
2. [Add your own content component](#add-your-own-content-component)
3. [Add your own side menu](#add-your-own-side-menu)
4. [Add your own header content](#add-your-own-header-content)
5. [Declare your own light and dark themes](#declare-your-own-light-and-dark-themes)
<br/><br/>
 
### Provider options

```ts
export type JBRDRAAppProviderOptions<T extends ContentNodeContentType> = {
  appName?: string
  getAllChildNodes?: getAllChildNodes<T>
  contentComponentType?: string
  sideMenuComponentType?: string
}
```
<br/>

### Add your own content component

Create a component that implements [`ContentLoaderComponentIO`](https://github.com/jamesbrobb/dynamic-routes-app/blob/main/libraries/dynamic-routes-ngx/src/lib/components/app-content-loader/app-content-loader.directive.ts#L7)

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

Supply the registered name of you content component to `getJBRDRAAppProviders`

```ts
import {ApplicationConfig} from '@angular/core';
import {getJBRDRAAppProviders} from "@jamesbenrobb/dynamic-routes-ngx";


export const appConfig: ApplicationConfig = {
  providers: [
    ...getJBRDRAAppProviders(
      'assets/route-config.json',
      {
        appName: 'My app name',
        contentComponentType: 'my-content-component'
      }
    )
  ]
};
```
<br/>

### Add your own side menu

By default a mildly modified version of `mat-tree` is used.
If you wish to supply your own menu first create a menu component that implements [`SideMenuComponentIO`](https://github.com/jamesbrobb/dynamic-routes-app/blob/main/libraries/dynamic-routes-ngx/src/lib/components/side-menu-loader/side-menu-loader.directive.ts#L8)

```ts
import {Component, Input, Output} from "@angular/core";
import {SideMenuComponentIO, MenuItemNode} from "@jamesbenrobb/dynamic-routes-app";


@Component({
  selector: 'my-side-menu',
  templateUrl: '...',
  styleUrls: ['...'],
  standalone: true
})
export class MySideMenuComponent implements SideMenuComponentIO {
  @Input() menuNodes?: MenuItemNode[];
  @Input() currentNodes?: MenuItemNode[];

  @Output() nodeSelected = new EventEmitter<MenuItemNode>();
}
```

Register the component with the `ComponentLoaderMapService` (see details on registering components [here](https://github.com/jamesbrobb/jbr/tree/main/libraries/ui/src/lib/component-loader)) and add the provider to your app

```ts
import {Provider} from "@angular/core";
import {ComponentLoaderMapService} from "@jamesbenrobb/ui";


const provider: Provider = {
  provide: ComponentLoaderMapService,
  useValue: {
    'my-side-menu': {
      import: () => import('./my-side-menu.component'),
      componentName: 'MySideMenuComponent'
    }
  },
  multi: true
}
```
Supply the registered name of you side menu component to `getJBRDRAAppProviders`

```ts
import {ApplicationConfig} from '@angular/core';
import {getJBRDRAAppProviders} from "@jamesbenrobb/dynamic-routes-ngx";


export const appConfig: ApplicationConfig = {
  providers: [
    ...getJBRDRAAppProviders(
      'assets/route-config.json',
      {
        appName: 'My app name',
        sideMenuComponentType: 'my-side-menu'
      }
    )
  ]
};
```
<br/>

### Add your own header content

The header has a content slot that can be used to project bespoke content.

```html
<jbr-dra-app-layout-container>
  <div jbr-dra-toolbar-content>I'm the header text</div>
</jbr-dra-app-layout-container>
```
<br/>

### Declare your own light and dark themes

Approximately 90% of the app uses Angular Material components and the other 10% also support being themed.

To supply your own themes the `setJBRDRAVars` mixin has the following optional arguments:

```scss
@use '@angular/material' as mat;
@use "@jamesbenrobb/dynamic-routes-ngx/styles/jbr-dra-styles" as dra;

@include dra.setJBRDRAVars(
  $light-theme, // an Angular material light theme created with mat.define-light-theme
  $dark-theme, // an Angular material dark theme created with mat.define-dark-theme
  $typography, // an Angular material typography config created with mat.define-typography-config
  $side-menu-width // a custom width for the side menu - defaults to 320px
);
```
The app also comes with a light/dark mode switch that sets a `data` attribute on body.
When explicitly selected, the switch also stores the users preference in Local storage, overriding the OS mode.
The following can be used to style your own components
```html
<body [data-color-mode]="light">
...
</body>
```
or
```html
<body [data-color-mode]="dark">
...
</body>
```
