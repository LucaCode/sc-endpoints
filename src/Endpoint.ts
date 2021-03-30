/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import { Middleware } from "./Middleware/Middleware";

export type EndpointClass<T> = (new(...args: any[]) => T) & {prototype: T, middlewares?: Middleware[], registered?: boolean};

export function parseEndpointName(target: EndpointClass<any>) {
    const className = target.name;
    if(className.endsWith('Endpoint') || className.endsWith('Procedure') || className.endsWith('Receiver')) {
        const index = Math.max(className.lastIndexOf('Endpoint'),
            className.lastIndexOf('Procedure'),
            className.lastIndexOf('Receiver'));
        return className.slice(0,index);
    }
    return className;
}