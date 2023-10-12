import { Either, left, right } from "../shared/either"
import { InvalidTitleError } from "./errors/invalid-title-error"

export class Title {
    public readonly value: string

    private constructor(title: string){
        this.value = title
        
        //para que as instâncias sejam imutáveis
        Object.freeze(this)
    }

    public static create(title: string): Either<InvalidTitleError, Title> {
        if(valid(title)){
            return right(new Title(title))
        }

        return left(new InvalidTitleError(title))
    }
}

function valid(title: string): boolean {
    if(emptyOrTooLarge(title) || tooLarge(title)){
        return false
    }
    return true
}

function emptyOrTooLarge(title: string): boolean {
    return !title || title.trim().length < 3
}

function tooLarge(title: string): boolean {
    return title.length > 256
}