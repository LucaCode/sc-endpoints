/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import { AGServerSocket } from "socketcluster-server";
import { EndpointClass, parseEndpointName } from "../Endpoint";
import { endpointAppliers } from "../Endpoints";
import { createMiddlewarePipeline } from "../Middleware/MiddlewarePipeline";
import ScTransmitRequest from "./ScTransmitRequest";

export interface Receiver {
  /**
   * @description
   * Methods that handle requests after processing the middlewares.
   */
  handle: (socket: AGServerSocket, data: any) => any;
}

/**
 * @description
 * Registers receiver endpoint.
 * The name will be parsed from the class name if you don't provide an explicit name.
 * @param name 
 */
export default function RegisterReceiver(name?: string) {
  return (target: EndpointClass<Receiver>) => {
    const endpointName = name != null ? name : parseEndpointName(target);
    if (target.registered)
      throw new Error(`The receiver: "${endpointName}" is already registered.`);
    target.registered = true;

    const instance = new target();
    const middlewarePipeline = createMiddlewarePipeline(
      target.middlewares ? [...target.middlewares].reverse() : []
    );

    endpointAppliers.push((socket) => {
      (async () => {
        let request: ScTransmitRequest;
        for await (request of socket.receiver(endpointName)) {
          try {
            if(!await middlewarePipeline(socket, request.data, undefined)) continue;
          } catch (err) {
            console.error(
              `Unexpected error in middleware pipeline of receiver: '${endpointName}' -> `,
              err
            );
          }
          try {
            await instance.handle(socket, request.data);
          } catch (err) {
            console.error(
              `Unexpected error in handle of receiver: '${endpointName}' -> `,
              err
            );
          }
        }
      })();
    });
  };
}
