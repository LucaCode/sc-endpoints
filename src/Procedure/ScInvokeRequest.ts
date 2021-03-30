/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

/**
 * @description
 * Interface for incoming Socketcluster InvokeRequests
 */
 export default interface ScInvokeRequest {
    data: any,
    error: (error: Error) => void,
    end: (data?: any) => void;
}