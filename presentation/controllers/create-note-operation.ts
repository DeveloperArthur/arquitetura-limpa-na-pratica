import { UseCase } from "../../use-cases/ports/use-case";
import { ExistingUserError } from "../../use-cases/sign-up/errors/existing-user-error";
import { ControllerOperation } from "./ports/controller-operation";
import { HttpRequest } from "./ports/http-request";
import { HttpResponse } from "./ports/http-response";
import { badRequest, created } from "./util/http-helper";
import { NoteData } from "../../use-cases/ports/note-data"
import { Either } from "../../shared/either"
import { UnregisteredOwnerError } from "../../use-cases/create-note/errors/unregistered-owner-error"
import { InvalidTitleError } from "../../entities/errors/invalid-title-error"

export class CreateNoteOperation implements ControllerOperation {
    readonly requiredParams = ['title', 'content', 'ownerEmail']
    private useCase: UseCase

    constructor(useCase: UseCase) {
        this.useCase = useCase
    }
    
    async specificOp(request: HttpRequest): Promise<HttpResponse> {
        const noteRequest: NoteData = {
            title: request.body.title,
            content: request.body.content,
            ownerEmail: request.body.ownerEmail
        }

        const useCaseResponses: Either<ExistingUserError | UnregisteredOwnerError |
            InvalidTitleError, NoteData> = await this.useCase.perform(noteRequest)
        
        if(useCaseResponses.isRight()){
            return created(useCaseResponses.value)
        }

        return badRequest(useCaseResponses.value)
    }
}