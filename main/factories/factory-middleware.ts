import { Authentication } from "../../presentation/middleware/authentication"
import { Middleware } from "../../presentation/middleware/ports/middleware"
import { TokenManager } from "../../use-cases/authentication/ports/token-manager"
import { BcryptEncoder } from "../../external/encoder/bcrypt-encoder"
import { Encoder } from "../../use-cases/ports/encoder"
import { JwtTokenManager } from "../../external/token-manager/jwt-token-manager"

export const makeAuthMiddleware = (): Middleware => {
    return new Authentication(makeTokenManager())
}

export const makeEncoder = (): Encoder => {
    return new BcryptEncoder(parseInt(process.env.BCRYPT_ROUNDS))
}

export const makeTokenManager = (): TokenManager => {
    return new JwtTokenManager(process.env.JWT_SECRET)
}