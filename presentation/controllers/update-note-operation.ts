import { InvalidTitleError } from "../../entities/errors/invalid-title-error";
import { Either } from "../../shared/either";
import { NoteData } from "../../use-cases/ports/note-data";
import { UseCase } from "../../use-cases/ports/use-case";
import { ExistingUserError } from "../../use-cases/sign-up/errors/existing-user-error";
import { MissingParamError } from "./errors/missing-param-error";
import { ControllerOperation } from "./ports/controller-operation";
import { HttpRequest } from "./ports/http-request";
import { HttpResponse } from "./ports/http-response";
import { badRequest, ok } from "./util/http-helper";
import { WebController } from "./web-controller";

export class UpdateNoteOperation implements ControllerOperation {
    readonly requiredParams = ['id', 'ownerEmail', 'ownerId']
    private useCase: UseCase

    constructor(useCase: UseCase){
        this.useCase = useCase
    }

    async specificOp(request: HttpRequest): Promise<HttpResponse> {
        const updateParams = ['title', 'content']
        const missingUpdateParams: string = WebController
            .getMissingParams(request, updateParams)

        if(missingTitleAndContent(missingUpdateParams)){
            return badRequest(new MissingParamError(missingUpdateParams))
        }

        const useCaseResponses: Either<ExistingUserError | 
            InvalidTitleError, NoteData> = await this.useCase.perform(request.body)

        if(useCaseResponses.isRight()){
            return ok(useCaseResponses.value)
        }

        return badRequest(useCaseResponses.value)
    }
}

function missingTitleAndContent(missingUpdateParams: string): boolean {
    return missingUpdateParams.split(',').length === 2
}