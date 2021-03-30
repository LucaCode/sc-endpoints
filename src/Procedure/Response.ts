/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import ProcedureError from "./ProcedureError";
import ScInvokeRequest from "./ScInvokeRequest";

export default class Response {
    constructor(private readonly invokeRequest: ScInvokeRequest) {}

    /**
     * @description
     * Sends a successful response with data back to the client.
     */
    readonly end = this.invokeRequest.end;

    /**
     * @description
     * Sends an unsuccessful response with a procedure error to the client.
     * @param code 
     * @param msg 
     */
    error(code: number, msg?: string): void
    /**
     * @description
     * Sends an unsuccessful response with an error to the client.
     * @param error 
     */
    error(error: Error): void
    error(v: number | Error, msg?: string): void {
        if(typeof v === 'number') this.invokeRequest.error(new ProcedureError(v,msg))
        else this.invokeRequest.error(v);
    }
}