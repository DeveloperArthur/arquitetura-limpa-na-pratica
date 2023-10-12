export class InvalidTokenError extends Error {
    public readonly name = 'InvalidTokenError'
  
    constructor () {
      super('Invalid token or requester id.')
    }
  }
  