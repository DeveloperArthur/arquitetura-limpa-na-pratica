import { adaptMiddleware } from '../../main/adapters/express-middleware-adapter'
import { makeAuthMiddleware } from '../../main/factories/factory-middleware'

export const authentication = adaptMiddleware(makeAuthMiddleware())
