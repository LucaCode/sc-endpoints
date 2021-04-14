/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import { AGServerSocket } from "socketcluster-server";
import { EndpointClass, parseEndpointName } from "../Endpoint";
import { endpointAppliers } from "../Endpoints";
import { createMiddlewarePipeline } from "../Middleware/MiddlewarePipeline";
import Response from "./Response";
import ScInvokeRequest from "./ScInvokeRequest";

export interface Procedure {
  /**
   * @description
   * Methods that handle requests after processing the middlewares.
   */
  handle: (socket: AGServerSocket, data: any, response: Response) => any;
}

/**
 * @description
 * Registers procedure endpoint.
 * The name will be parsed from the class name if you don't provide an explicit name.
 * @param options
 */
export default function RegisterProcedure(options: {name?: string, async?: boolean}) {
  return (target: EndpointClass<Procedure>) => {
    const endpointName = options.name != null ? options.name : parseEndpointName(target);
    if (target.registered)
      throw new Error(
        `The procedure: "${endpointName}" is already registered.`
      );
    target.registered = true;

    const instance = new target();
    const middlewarePipeline = createMiddlewarePipeline(
      target.middlewares ? [...target.middlewares].reverse() : []
    );

    const process = async (request: ScInvokeRequest, socket: AGServerSocket) => {
      const res = new Response(request);
      try {
        if(!await middlewarePipeline(socket, request.data, res)) return;
      } catch (err) {
        console.error(
            `Unexpected error in middleware pipeline of procedure: '${endpointName}' -> `,
            err
        );
      }
      try {
        await instance.handle(socket, request.data, res);
      } catch (err) {
        console.error(
            `Unexpected error in handle of procedure: '${endpointName}' -> `,
            err
        );
      }
    }

    endpointAppliers.push((socket) => {
      (async () => {
        let request: ScInvokeRequest;
        for await (request of socket.procedure(endpointName)) {
          const promise = process(request,socket);
          if(!options.async) await promise;
        }
      })();
    });
  };
}
