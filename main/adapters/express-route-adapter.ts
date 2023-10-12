import { HttpRequest } from "../../presentation/controllers/ports/http-request";
import { WebController } from "../../presentation/controllers/web-controller";
import { Request, Response } from 'express'

export const adaptRoute = (controller: WebController) => {
    return async (req: Request, res: Response) => {
        const httpRequest: HttpRequest = {
            body: req.body
        }
        const httpResponse = await controller.handle(httpRequest)
        res.status(httpResponse.statusCode).json(httpResponse.body)
    }
}