import { Either, left, right } from "../shared/either"
import { Email } from "./email"
import { InvalidEmailError } from "./errors/invalid-email-error"
import { InvalidPasswordError } from "./errors/invalid-password-error"
import { Password } from "./password"

export class User {
    private readonly _nickname: string
    private readonly _email: Email
    private readonly _password: Password

    public get nickname(){
        return this._nickname
    }

    public get email(){
        return this._email
    }

    public get password(){
        return this._password
    }

    private constructor(email: Email, password: Password){
        this._email = email
        this._password = password

        //para que as instâncias sejam imutáveis
        Object.freeze(this)
    }

    //factory method
    public static create (email: string, password: string): 
        Either<InvalidEmailError | InvalidPasswordError, User> {
        const emailOrError = Email.create(email)
        if (emailOrError.isLeft()){
            return left(new InvalidEmailError(email))
        }

        const passwordOrError = Password.create(password)
        if(passwordOrError.isLeft()){
            return left(new InvalidPasswordError())
        }

        const emailObject: Email = emailOrError.value as Email
        const passwordObject: Password = passwordOrError.value as Password

        return right(new User(emailObject, passwordObject))
    }

}