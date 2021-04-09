/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {Schema, validate} from "jsonschema";
import { EndpointClass } from "../../Endpoint";
import { addMiddleware } from "../Middleware";

export type DataValidator = (data: any) => boolean;

/**
 * @description
 * Adds a custom data middleware to the middleware pipeline.
 * @param func
 */
function Data(func: DataValidator): (target: EndpointClass<any>) => void
/**
 * @description
 * Adds a middleware to the middleware pipeline to 
 * validate the send data by using the package: "jsonschema". 
 * @param func
 */
function Data(schema: Schema): (target: EndpointClass<any>) => void
function Data(v: DataValidator | Schema): (target: EndpointClass<any>) => void {
    return (target: EndpointClass<any>) => {
        const f = typeof v === 'function' ? v : (data: any) => validate(data,v).valid;
        addMiddleware(target,async (_,data,res,next) => {
            if(!await f(data)) res?.error(400,'Invalid data')
            else next();
        });
    }
}

export default Data;