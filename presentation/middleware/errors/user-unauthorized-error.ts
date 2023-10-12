export class UserUnauthorizedError extends Error {
    public readonly name = 'UserUnauthorizedError'
  
    constructor () {
      super('User not allowed to perform this operation.')
    }
  }
  