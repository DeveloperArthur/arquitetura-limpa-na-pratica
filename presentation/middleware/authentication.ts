import { HttpResponse } from "../controllers/ports/http-response";
import { forbidden, ok, serverError } from "../controllers/util/http-helper";
import { Middleware } from "./ports/middleware";
import { TokenManager, Payload } from "../../use-cases/authentication/ports/token-manager"
import { InvalidTokenError } from "./errors/invalid-token-error";
import { UserUnauthorizedError } from "./errors/user-unauthorized-error";

export type AuthRequest = {
    accessToken: string,
    requesterId: string
}

export class Authentication implements Middleware {
    private readonly tokenManager: TokenManager

    constructor(tokenManager: TokenManager){
        this.tokenManager = tokenManager
    }

    async handle (request: AuthRequest): Promise<HttpResponse> {
        try {
            const { accessToken, requesterId } = request
            if(!accessToken || !requesterId){
                return forbidden(new InvalidTokenError())
            }

            const decodedTokenOrError = await this.tokenManager.verify(accessToken)
            if(decodedTokenOrError.isLeft()){
                return forbidden(decodedTokenOrError.value)
            }

            const payload: Payload = decodedTokenOrError.value as Payload

            if(payload.id === requesterId){
                return ok(payload)
            }

            return forbidden(new UserUnauthorizedError())
        } catch(error){
            return serverError(error)
        }
    }
}