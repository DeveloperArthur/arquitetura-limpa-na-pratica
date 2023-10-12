import { InvalidEmailError } from "../../entities/errors/invalid-email-error";
import { InvalidPasswordError } from "../../entities/errors/invalid-password-error";
import { User } from "../../entities/user";
import { Either, left, right } from "../../shared/either";
import { AuthenticationResult, AuthenticationService } from "../authentication/ports/authentication-service";
import { Encoder } from "../ports/encoder";
import { UseCase } from "../ports/use-case";
import { UserData } from "../ports/user-data";
import { UserRepository } from "../ports/user-repository";
import { ExistingUserError } from "./errors/existing-user-error";

export class SignUp implements UseCase {
    private readonly userRepository: UserRepository
    private readonly encoder: Encoder
    private readonly authentication: AuthenticationService

    constructor (userRepository: UserRepository, encoder: Encoder, 
        authentication: AuthenticationService){
        this.userRepository = userRepository
        this.encoder = encoder
        this.authentication = authentication    
    }

    public async perform(userSignupRequest: UserData): Promise<Either<ExistingUserError | InvalidEmailError | InvalidPasswordError, AuthenticationResult>> {
        const useOrError = User.create(userSignupRequest.email, userSignupRequest.password)
        
        if(useOrError.isLeft()){
            return left(useOrError.value)
        }

        const user = await this.userRepository.findByEmail(userSignupRequest.email)
        if(user){
            return left(new ExistingUserError(userSignupRequest))
        }

        const encodedPassword = await this.encoder.encode(userSignupRequest.password)
        await this.userRepository.add({
            email: userSignupRequest.email,
            password: encodedPassword
        })

        const response = 
        (await this.authentication.auth({
            email: userSignupRequest.email,
            password: userSignupRequest.password
        })).value as AuthenticationResult
        
        return right(response)
    }
}