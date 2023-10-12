import { Either, left, right } from "../shared/either"
import { InvalidEmailError } from "./errors/invalid-email-error"

//value object
export class Email {
    public readonly value: string

    private constructor (email: string){
        this.value = email

        //para que as instâncias sejam imutáveis
        Object.freeze(this)
    }

    //factory method
    public static create (email: string): Either<InvalidEmailError, Email> {
        if(valid(email)) {
            return right(new Email(email))
        }

        return left(new InvalidEmailError(email))
    }
}

export function valid (email: string): boolean {
    const maxEmailSize = 320
    if(emptyOrTooLarge(email, maxEmailSize) || nonConformat(email)) {
        return false
    }

    const [local, domain] = email.split('@')
    const maxLocalSize = 64
    const maxDomainSize = 255
    if (emptyOrTooLarge(local, maxLocalSize) ||
        emptyOrTooLarge(domain, maxDomainSize)) {
        return false
    }

    if (somePartIsTooLarge(domain)){
        return false 
    }

    return true
}

function emptyOrTooLarge (str: string, maxSize: number): boolean {
    if(!str || str.length > maxSize){
        return true
    }
    return false
}

function nonConformat(email: string): boolean {
    const emailRegex = /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
    return !emailRegex.test(email)
}

function somePartIsTooLarge(domain: string): boolean {
    const maxPartSize = 63
    const domainParts = domain.split('.')
    return domainParts.some(function(part){
        return part.length > maxPartSize
    })
}