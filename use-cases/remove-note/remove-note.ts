import { Either, left, right } from "../../shared/either";
import { UnexistingNoteError } from "../errors/unexisting-note-error";
import { NoteRepository } from "../ports/note-repository";
import { UseCase } from "../ports/use-case";

export class RemoveNote implements UseCase {
    private readonly noteRepository: NoteRepository

    constructor(noteRepository: NoteRepository){
        this.noteRepository = noteRepository
    }

    async perform(noteId: string): Promise<Either<UnexistingNoteError, void>> {
        if(await this.noteRepository.findById(noteId)){
            return right(await this.noteRepository.remove(noteId))
        }
        return left(new UnexistingNoteError())
    }
}