/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import { EndpointClass } from "../../Endpoint";
import { addMiddleware, Middleware as MiddlewareFunc } from "../Middleware";

/**
 * @description
 * Adds a custom middleware to the endpoint middleware pipeline.
 * @param func 
 */
export default function Middleware(func: MiddlewareFunc) {
    return (target: EndpointClass<any>) => {
        addMiddleware(target,func);
    }
}