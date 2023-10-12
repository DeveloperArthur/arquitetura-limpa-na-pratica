import { InvalidTitleError } from "../../entities/errors/invalid-title-error";
import { Note } from "../../entities/note";
import { User } from "../../entities/user";
import { Either, left, right } from "../../shared/either";
import { ExistingTitleError } from "../create-note/errors/existing-title-error";
import { NoteData } from "../ports/note-data";
import { NoteRepository } from "../ports/note-repository";
import { UseCase } from "../ports/use-case";
import { UserRepository } from "../ports/user-repository";
import { UnexistingNoteError } from "../errors/unexisting-note-error";

export type UpdateNoteRequest = {
    title?: string, 
    content?: string,
    ownerEmail: string,
    ownerId: string,
    id: string
}

export class UpdateNote implements UseCase {
    private readonly noteRepository: NoteRepository
    private readonly userRepository: UserRepository

    constructor(noteRepository: NoteRepository, userRepository: UserRepository){
        this.noteRepository = noteRepository
        this.userRepository = userRepository
    }

    public async perform(changedNoteData: UpdateNoteRequest): Promise<Either<UnexistingNoteError | 
        InvalidTitleError | ExistingTitleError, NoteData>> {
        const userData = await this.userRepository.findByEmail(changedNoteData.ownerEmail)
        const original = await this.noteRepository.findById(changedNoteData.id)
        if(!original){
            return left(new UnexistingNoteError())
        }

        const owner = User.create(userData.email, userData.password).value as User
        const noteOrError = Note.create(owner, getTitleToBeUsed(changedNoteData, original), 
            getContentToBeUsed(changedNoteData, original))
        if(noteOrError.isLeft()){
            return left(noteOrError.value)
        }

        const changedNote = noteOrError.value as Note

        if(shouldChangeTitle(changedNoteData)){
            if(await this.newTitleAlreadyExists(changedNoteData, changedNote)){
                return left(new ExistingTitleError())
            }
            await this.noteRepository.updateTitle(changedNoteData.id, changedNoteData.title)
        }

        if(shouldChangeContent(changedNoteData)){
            await this.noteRepository.updateContent(changedNoteData.id, changedNoteData.content)
        }

        return right(await this.noteRepository.findById(changedNoteData.id))
    }

    private async newTitleAlreadyExists(changedNoteData: UpdateNoteRequest, changedNote: Note){
        const notesFromUser = await this.noteRepository.findAllNotesFrom(changedNoteData.ownerId)
        const found = notesFromUser.find(note => note.title === changedNote.title.value)
        return found
    }
}

function getTitleToBeUsed(changedNoteData: UpdateNoteRequest, original: NoteData): string {
    return shouldChangeTitle(changedNoteData) ? changedNoteData.title : original.title
}

function shouldChangeTitle(updateNoteRequest: UpdateNoteRequest){
    return Object.keys(updateNoteRequest).indexOf('title') !== -1
}

function getContentToBeUsed(changedNoteData: UpdateNoteRequest, original: NoteData): string {
    return shouldChangeContent(changedNoteData) ? changedNoteData.content : original.content
}

function shouldChangeContent(updateNoteRequest: UpdateNoteRequest){
    return Object.keys(updateNoteRequest).indexOf('content') !== -1
}