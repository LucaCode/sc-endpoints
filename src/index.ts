/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import { applyEndpoints } from "./Endpoints"
import AuthToken from "./Middleware/Decorator/AuthToken"
import Data from "./Middleware/Decorator/Data"
import Middleware from "./Middleware/Decorator/Middleware"
import RegisterProcedure, { Procedure } from "./Procedure/Procedure"
import ProcedureError from "./Procedure/ProcedureError"
import Response from "./Procedure/Response"
import RegisterReceiver, { Receiver } from "./Receiver/Receiver"

export {
    Procedure,
    RegisterProcedure,
    ProcedureError,
    Response,
    Receiver,
    RegisterReceiver,
    Middleware,
    Data,
    AuthToken,
    applyEndpoints
}