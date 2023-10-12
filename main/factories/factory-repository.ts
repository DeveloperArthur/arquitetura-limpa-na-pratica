import { NoteRepository } from "../../use-cases/ports/note-repository"
import { UserRepository } from "../../use-cases/ports/user-repository"
import { MongodbNoteRepository } from "../../external/repositories/mondodb/mongodb-note-repository"
import { MongodbUserRepository } from "../../external/repositories/mondodb/mongodb-user-repository"

export const makeNoteRepository = (): NoteRepository => {
    return new MongodbNoteRepository()
}

export const makeUserRepository = (): UserRepository => {
    return new MongodbUserRepository()
}