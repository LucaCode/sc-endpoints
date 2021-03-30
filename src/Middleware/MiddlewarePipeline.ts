/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import { AGServerSocket } from "socketcluster-server";
import Response from "../Procedure/Response";

type MiddlewarePipelineFunc<R extends boolean> = (socket: AGServerSocket, data: any, 
    response: R extends true ? Response : undefined, next: () => void) => any

export function createMiddlewarePipeline<R extends boolean>(funcs: MiddlewarePipelineFunc<R>[]): (socket: AGServerSocket, data: any,
    response: R extends true ? Response : undefined) => Promise<void>
{
    if(funcs.length > 0) {
       return (socket,data,result) => {
        return new Promise((res,rej) => {
            let i = -1;
            const next = () => {
                const func = funcs[++i];
                if(!func) res();
                (async () => {
                    try {await func(socket,data,result,next);}
                    catch(e) {rej(e)}
                })()
            }
            next();
        })
       }
    }
    else return async () => {};
}