/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {Schema, validate} from "jsonschema";
import { EndpointClass } from "../../Endpoint";
import { addMiddleware } from "../Middleware";

export type DataValidator = (data: any) => boolean;

function Data(func: DataValidator): (target: EndpointClass<any>) => void
function Data(schema: Schema): (target: EndpointClass<any>) => void
function Data(v: DataValidator | Schema): (target: EndpointClass<any>) => void {
    return (target: EndpointClass<any>) => {
        const f = typeof v === 'function' ? v : (data: any) => validate(data,v).valid;
        addMiddleware(target,async (socket,_,res,next) => {
            if(!await f(socket.authToken)) res?.error(400,'Invalid data')
            else next();
        });
    }
}

export default Data;