/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

/**
 * @description
 * A class which extends Error to allow sending error messages with an error code
 */
 export default class ProcedureError extends Error {
    public readonly code: number;
    constructor(code: number, msg: string = '') {
        super(msg);
        this.code = code;
    }
}