import { Either } from "../../shared/either";
import { UserNotFoundError } from "../authentication/errors/user-not-found-error";
import { WrongPasswordError } from "../authentication/errors/wrong-password-error";
import { AuthenticationResult, AuthenticationService } from "../authentication/ports/authentication-service";
import { UseCase } from "../ports/use-case";
import { UserData } from "../ports/user-data";

export class SignIn implements UseCase {
    private readonly authentication: AuthenticationService

    constructor(authentication: AuthenticationService) {
        this.authentication = authentication
    }

    public async perform(signinRequest: UserData): Promise<Either<UserNotFoundError | 
        WrongPasswordError, AuthenticationResult>> {
        return await this.authentication.auth({
            email: signinRequest.email,
            password: signinRequest.password
        })        
    }
}