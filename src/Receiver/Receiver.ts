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
 * @param options
 */
export default function RegisterReceiver(options: {name?: string, async?: boolean}) {
  return (target: EndpointClass<Receiver>) => {
    const endpointName = options.name != null ? options.name : parseEndpointName(target);
    if (target.registered)
      throw new Error(`The receiver: "${endpointName}" is already registered.`);
    target.registered = true;

    const instance = new target();
    const middlewarePipeline = createMiddlewarePipeline(
      target.middlewares ? [...target.middlewares].reverse() : []
    );

    const process = async (request: ScTransmitRequest, socket: AGServerSocket) => {
      try {
        if(!await middlewarePipeline(socket, request.data, undefined)) return;
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

    endpointAppliers.push((socket) => {
      (async () => {
        let request: ScTransmitRequest;
        for await (request of socket.receiver(endpointName)) {
          const promise = process(request,socket);
          if(!options.async) await promise;
        }
      })();
    });
  };
}
