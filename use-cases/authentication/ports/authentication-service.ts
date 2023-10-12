import { Either } from "../../../shared/either"
import { UserNotFoundError } from "../errors/user-not-found-error"
import { WrongPasswordError } from "../errors/wrong-password-error"

export type AuthenticationParams = {
    email: string,
    password: string
}

export type AuthenticationResult = {
    accessToken: string
    id: string
}

export interface AuthenticationService {
    auth: (authenticationParams: AuthenticationParams) => 
        Promise<Either<UserNotFoundError | WrongPasswordError, AuthenticationResult>>
}