import { Either } from "../../shared/either";
import { UseCase } from "../../use-cases/ports/use-case";
import { ControllerOperation } from "./ports/controller-operation";
import { HttpRequest } from "./ports/http-request";
import { HttpResponse } from "./ports/http-response";
import { badRequest, ok } from "./util/http-helper";
import { UnexistingNoteError } from "../../use-cases/errors/unexisting-note-error"

export class RemoveNoteOperation implements ControllerOperation {
    readonly requiredParams = ['noteId']
    private readonly useCase: UseCase

    constructor(useCase: UseCase){
        this.useCase = useCase
    }

    async specificOp(request: HttpRequest): Promise<HttpResponse> {
        const useCaseResponses: Either<UnexistingNoteError, void> =
            await this.useCase.perform(request.body.noteId)

        if(useCaseResponses.isRight()){
            return ok(useCaseResponses.value)
        }

        return badRequest(useCaseResponses.value)
    }
}