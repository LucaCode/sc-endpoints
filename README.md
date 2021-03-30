# sc-endpoints
Module for creating socketcluster receivers and procedures by using classes and decorators.

```
@RegisterProcedure()
@AuthToken({type: 'user'})
@Data({
    type: 'object',
    properties: {
        content: {
            type: 'string',
            minLength: 10
        }
    }
})
class SendMessaageEndpoint implements Procedure {
    handle(socket: AGServerSocket,data: {email: string}, resp: Response) {
        resp.end()
    }
}
```