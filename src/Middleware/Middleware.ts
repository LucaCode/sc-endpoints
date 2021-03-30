/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import { AGServerSocket } from "socketcluster-server";
import { EndpointClass } from "../Endpoint";
import Response from "../Procedure/Response";

export type Middleware = (socket: AGServerSocket, data: any, response: Response | undefined, next: () => void) => any;

export function addMiddleware(target: EndpointClass<any>, middleware: Middleware) {
    if(target.registered) throw new Error(`Cannot add middleware after endpoint is registered. Check the decorator sequence of the class "${target.name}".`);
    if(!target.middlewares) target.middlewares = [middleware];
    else target.middlewares.push(middleware);
}
