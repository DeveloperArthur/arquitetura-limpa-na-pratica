import { Express, Router } from 'express'
import { authentication } from '../../main/middleware/authentication'
import { adaptRoute } from '../../main/adapters/express-route-adapter'
import { makeCreateNoteController, makeLoadNotesController, 
    makeRemoveNoteController, makeSignInController, 
    makeSignUpController, makeUpdateNoteController } from '../factories/factory-controller'

export default (app: Express): void => {
    const router = Router()
    router.post('/notes', authentication, adaptRoute(makeCreateNoteController()))
    router.delete('/notes/:noteId', authentication, adaptRoute(makeRemoveNoteController()))
    router.put('/notes/:noteId', authentication, adaptRoute(makeUpdateNoteController()))
    router.get('/notes', authentication, adaptRoute(makeLoadNotesController()))
    router.post('/signin', adaptRoute(makeSignInController()))
    router.post('/signup', adaptRoute(makeSignUpController()))
  }