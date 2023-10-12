import { UseCase } from "../../use-cases/ports/use-case";
import { ControllerOperation } from "./ports/controller-operation";
import { HttpRequest } from "./ports/http-request";
import { HttpResponse } from "./ports/http-response";
import { ok } from "./util/http-helper";

export class LoadNotesOperation implements ControllerOperation {
    readonly requiredParams = ['userId']
    private readonly useCase: UseCase

    constructor(useCase: UseCase){
        this.useCase = useCase
    }
    
    async specificOp(request: HttpRequest): Promise<HttpResponse> {
        return ok(await this.useCase.perform(request.body.userId))
    }
}