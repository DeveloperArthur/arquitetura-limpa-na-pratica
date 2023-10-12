import { Either, left, right } from "../shared/either"
import { InvalidPasswordError } from "./errors/invalid-password-error"

//value object
export class Password {
    private readonly _value: string

    public get value(){
        return this._value
    }

    constructor (password: string){
        this._value = password

        //para que as instâncias sejam imutáveis
        Object.freeze(this)
    }

    //factory method
    public static create (password: string):
        Either<InvalidPasswordError, Password> {
        if(valid(password)){
            return right(new Password(password))
        }

        return left(new InvalidPasswordError())
    }
}

function valid (password: string): boolean {
    if (!password) {
        return false
    }
  
    if (noNumberIn(password) || tooShort(password)) {
        return false
    }
    
    return true
}
  
function noNumberIn (password: string) {
    return !(/\d/.test(password))
}

function tooShort (password: string) {
    return password.length < 6
}