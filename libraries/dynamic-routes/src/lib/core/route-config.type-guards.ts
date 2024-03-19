import {TypeGuard} from "@jamesbenrobb/types";
import {ContentNode, RedirectNode, RouteNode, RouteNodeBase, ParentNode} from "./route-config.types";


type routeNodeGuardProp<NT extends RouteNode<any>> = keyof Omit<NT, keyof RouteNodeBase>

function routeNodeGuard<NT extends RouteNode<RouteNode<any>>>(...props: routeNodeGuardProp<NT>[]): TypeGuard<RouteNode<any>, NT> {
  return (node?: RouteNode<any>): node is NT => !!node && props.every(prop => prop in node)
}

export const isRouteNodeArray = (arg: unknown[]): arg is RouteNode<any>[] => {
  return arg.every(node => isRouteNode(node));
}

export const isRouteNode = (arg: unknown): arg is RouteNode<any> => {
  return !!arg && typeof arg === 'object' && 'path' in arg;
}

export const isRedirectNode = routeNodeGuard<RedirectNode>('redirectTo');
export const isContentNode = routeNodeGuard<ContentNode<any>>('content');
export const isParentNode = routeNodeGuard<ParentNode<any>>('children');


/* WIP - not yet complete */

type ObjectLiteral = {[key: PropertyKey]: unknown}

type TypeGuardFunction<T, NT extends T> = (arg: T) => arg is NT
type TypeGuardFunctionProp<T, NT extends T, O extends ObjectLiteral = {}> = keyof Omit<NT, keyof O>

function typeGuardByProps<T, NT extends T, O extends ObjectLiteral = {}>(
  ...props: TypeGuardFunctionProp<T, NT, O>[]
): TypeGuardFunction<T, NT> {

  return (arg: T): arg is NT => {
    if(!!arg && typeof arg === 'object') {
      return props.every(prop => prop in arg);
    }
    return false;
  }
}

function arrayTypeGuardByProps<T, NT extends T, O extends ObjectLiteral = {}>(
  ...props: TypeGuardFunctionProp<T, NT, O>[]
): TypeGuardFunction<T[], NT[]> {

  return (nodes: T[]): nodes is NT[] => {
    if(Array.isArray(nodes)) {
      return nodes.every(node => typeGuardByProps<T, NT, O>(...props)(node));
    }
    return false;
  }
}
///////////////////////////////////////////////
