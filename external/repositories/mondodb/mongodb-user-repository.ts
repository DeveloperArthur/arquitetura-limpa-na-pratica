import { ObjectId } from 'mongodb'
import { UserRepository } from '../../../use-cases/ports/user-repository'
import { UserData } from '../../../use-cases/ports/user-data'
import { MongoHelper } from './helpers/mongo-helper'

export type MongodbUser = {
    email: string,
    password: string,
    _id: ObjectId
  }

  export class MongodbUserRepository implements UserRepository {
    async findAll (): Promise<UserData[]> {
        const userCollection = await MongoHelper.getCollection('users')
        return (await userCollection.find<MongodbUser>({}).toArray()).map(this.withApplicationId)
    }
  
    async findByEmail (email: string): Promise<UserData> {
        const userCollection = await MongoHelper.getCollection('users')
        const user = await userCollection.findOne<MongodbUser>({ email: email })
        if (user) {
            return this.withApplicationId(user)
        }
        return null
    }
  
    async add (user: UserData): Promise<UserData> {
        const userCollection = await MongoHelper.getCollection('users')
        const userClone = {
            email: user.email,
            password: user.password,
            _id: null
        }
        await userCollection.insertOne(userClone)
        return this.withApplicationId(userClone)
    }
  
    private withApplicationId (dbUser: MongodbUser): UserData {
        return {
            email: dbUser.email,
            password: dbUser.password,
            id: dbUser._id.toString()
        }
    }
  }