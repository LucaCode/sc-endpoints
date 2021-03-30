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

export default function RegisterProcedure(name?: string) {
  return (target: EndpointClass<Procedure>) => {
    const endpointName = name != null ? name : parseEndpointName(target);
    if (target.registered)
      throw new Error(
        `The procedure: "${endpointName}" is already registered.`
      );
    target.registered = true;

    const instance = new target();
    const middlewarePipeline = createMiddlewarePipeline(
      target.middlewares ? [...target.middlewares].reverse() : []
    );

    endpointAppliers.push((socket) => {
      (async () => {
        let request: ScInvokeRequest;
        for await (request of socket.procedure(endpointName)) {
          const res = new Response(request);
          try {
            await middlewarePipeline(socket, request.data, res);
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
      })();
    });
  };
}
