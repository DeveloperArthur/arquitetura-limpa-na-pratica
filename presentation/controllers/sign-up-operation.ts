import { ControllerOperation } from "./ports/controller-operation";
import { HttpRequest } from "./ports/http-request";
import { HttpResponse } from "./ports/http-response";
import { UseCase } from "../../use-cases/ports/use-case"
import { badRequest, created, forbidden } from "./util/http-helper";
import { ExistingUserError } from '../../use-cases/sign-up/errors/existing-user-error'

export class SignUpOperation implements ControllerOperation {
    readonly requiredParams = ['email', 'password'];
    private useCase: UseCase

    constructor(useCase: UseCase){
        this.useCase = useCase
    }
    
    async specificOp(request: HttpRequest): Promise<HttpResponse> {
        const response = await this.useCase.perform({
            email: request.body.email,
            password: request.body.password
        })

        if(response.isRight()){
            return created(response.value)
        }

        if(response.value instanceof ExistingUserError){
            return forbidden(response.value)
        }
        return badRequest(response.value)
    }
}