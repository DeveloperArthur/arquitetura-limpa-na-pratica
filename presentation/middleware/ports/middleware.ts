import { HttpResponse } from "../../controllers/ports/http-response";

export interface Middleware<T = any> {
    handle: (httpRequest: T) => Promise<HttpResponse>
}