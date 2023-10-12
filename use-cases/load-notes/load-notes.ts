import { NoteData } from "../ports/note-data";
import { NoteRepository } from "../ports/note-repository";
import { UseCase } from "../ports/use-case";

export class LoadNotes implements UseCase {
    private readonly noteRepository: NoteRepository

    constructor(noteRepository: NoteRepository){
        this.noteRepository = noteRepository
    }

    public async perform(requestUserId: string): Promise<NoteData[]> {
        return await this.noteRepository.findAllNotesFrom(requestUserId)
    }
}