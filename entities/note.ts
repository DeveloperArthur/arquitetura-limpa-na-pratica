import { User } from "./user"
import { Title } from "./title"
import { Either, left, right } from "../shared/either"
import { InvalidEmailError } from "./errors/invalid-email-error"
import { InvalidTitleError } from "./errors/invalid-title-error"

export class Note {
    private readonly _title: Title
    private readonly _owner: User
    private readonly _content: string

    constructor (owner: User, title: Title, content: string){
        this._owner = owner
        this._title = title
        this._content = content
        
        //para que as instâncias sejam imutáveis
        Object.freeze(this)
    }

    get title(){
        return this._title
    }

    get owner(){
        return this._owner
    }

    get content(){
        return this._content
    }

    static create(owner: User, title: string, content: string): Either<InvalidTitleError, Note> {
        const titleOrError = Title.create(title)
        if(titleOrError.isLeft()){
            return left(titleOrError.value)
        }
        return right(new Note(owner, titleOrError.value, !content ? '' : content))
    }
}