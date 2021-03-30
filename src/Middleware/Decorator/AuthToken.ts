/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import forint, { ForintQuery } from "forint";
import { EndpointClass } from "../../Endpoint";
import { addMiddleware } from "../Middleware";

export type AuthTokenValidator = (token: Record<string,any> | null) => Promise<boolean> | boolean;

/**
 * @description
 * Adds a custom auth token middleware to the middleware pipeline.
 * @param func
 */
function AuthToken(func: AuthTokenValidator): (target: EndpointClass<any>) => void
/**
 * @description
 * Adds a middleware to the middleware pipeline to 
 * check the auth token by using the package: "forint". 
 * @param func
 */
function AuthToken(query: ForintQuery): (target: EndpointClass<any>) => void
function AuthToken(v: AuthTokenValidator | ForintQuery): (target: EndpointClass<any>) => void {
    return (target: EndpointClass<any>) => {
        const f = typeof v === 'function' ? v : forint(v);
        addMiddleware(target,async (socket,_,res,next) => {
            if(!await f(socket.authToken)) res?.error(403, 'Access denied')
            else next();
        });
    }
}

export default AuthToken;