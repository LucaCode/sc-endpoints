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
    response: R extends true ? Response : undefined) => Promise<boolean>
{
    if(funcs.length > 0) {
       return (socket,data,result) => {
        return new Promise((res,rej) => {
            let i = -1;
            const next = () => {
                const func = funcs[++i];
                if(!func) res(true);
                const tmpI = i;
                (async () => {
                    try {
                        await func(socket,data,result,next);
                        if(tmpI === i) {
                            //next was not called
                            res(false);
                        }
                    }
                    catch(e) {rej(e)}
                })()
            }
            next();
        })
       }
    }
    else return async () => true;
}