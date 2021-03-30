/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import { AGServerSocket } from "socketcluster-server";

export const endpointAppliers: ((socket: AGServerSocket) => void)[] = [];

/**
 * @description
 * Applies all registered endpoints on a socket.
 * @param socket 
 */
export function applyEndpoints(socket: AGServerSocket) {
    endpointAppliers.forEach(apply => apply(socket));
}