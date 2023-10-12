import { makeUserRepository } from "./factory-repository"
import { makeNoteRepository } from "./factory-repository"
import { makeEncoder } from "./factory-middleware"
import { makeTokenManager } from "./factory-middleware"
import { CreateNote } from "../../use-cases/create-note/create-note"
import { LoadNotes } from "../../use-cases/load-notes/load-notes"
import { RemoveNote } from "../../use-cases/remove-note/remove-note"
import { UpdateNote } from "../../use-cases/update-note/update-note"
import { SignIn } from "../../use-cases/sign-in/sign-in"
import { SignUp } from "../../use-cases/sign-up/sign-up"
import { CustomAuthenticator } from "../../use-cases/authentication/custom-authentication"
import { WebController } from "../../presentation/controllers/web-controller"
import { CreateNoteOperation } from "../../presentation/controllers/create-note-operation"
import { LoadNotesOperation } from "../../presentation/controllers/load-notes-operation"
import { RemoveNoteOperation } from "../../presentation/controllers/remove-note-operation"
import { SignInOperation } from "../../presentation/controllers/sign-in-operation"
import { SignUpOperation } from "../../presentation/controllers/sign-up-operation"
import { UpdateNoteOperation } from "../../presentation/controllers/update-note-operation"

export const makeCreateNoteController = (): WebController => {
    const userRepository = makeUserRepository()
    const noteRepository = makeNoteRepository()
    const usecase = new CreateNote(noteRepository, userRepository)
    const controller = new WebController(new CreateNoteOperation(usecase))
    return controller
}

export const makeLoadNotesController = (): WebController => {
    const noteRepository = makeNoteRepository()
    const usecase = new LoadNotes(noteRepository)
    const controller = new WebController(new LoadNotesOperation(usecase))
    return controller
}

export const makeRemoveNoteController = (): WebController => {
    const noteRepository = makeNoteRepository()
    const usecase = new RemoveNote(noteRepository)
    const controller = new WebController(new RemoveNoteOperation(usecase))
    return controller
}

export const makeSignInController = (): WebController => {
    const userRepository = makeUserRepository()
    const encoder = makeEncoder()
    const tokenManager = makeTokenManager()
    const authenticationService =
      new CustomAuthenticator(userRepository, encoder, tokenManager)
    const usecase = new SignIn(authenticationService)
    const controller = new WebController(new SignInOperation(usecase))
    return controller
}

export const makeSignUpController = (): WebController => {
    const userRepository = makeUserRepository()
    const encoder = makeEncoder()
    const tokenManager = makeTokenManager()
    const authenticationService =
      new CustomAuthenticator(userRepository, encoder, tokenManager)
    const usecase = new SignUp(userRepository, encoder, authenticationService)
    const controller = new WebController(new SignUpOperation(usecase))
    return controller
}

export const makeUpdateNoteController = (): WebController => {
    const userRepository = makeUserRepository()
    const noteRepository = makeNoteRepository()
    const usecase = new UpdateNote(noteRepository, userRepository)
    const controller = new WebController(new UpdateNoteOperation(usecase))
    return controller
}